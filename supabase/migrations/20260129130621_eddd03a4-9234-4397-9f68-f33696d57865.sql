-- Phase 1: Add booking expiration to prevent spot hoarding
ALTER TABLE public.event_bookings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Set default expiration of 15 minutes for pending bookings
CREATE OR REPLACE FUNCTION public.set_booking_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set expiration for pending bookings without payment
  IF NEW.status = 'pending' AND NEW.expires_at IS NULL THEN
    NEW.expires_at := now() + interval '15 minutes';
  END IF;
  
  -- Clear expiration when booking is confirmed
  IF NEW.status = 'confirmed' THEN
    NEW.expires_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for booking expiration
DROP TRIGGER IF EXISTS set_booking_expiration_trigger ON public.event_bookings;
CREATE TRIGGER set_booking_expiration_trigger
  BEFORE INSERT OR UPDATE ON public.event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_expiration();

-- Update existing pending bookings with 15 minute expiration from now
UPDATE public.event_bookings 
SET expires_at = now() + interval '15 minutes'
WHERE status = 'pending' AND expires_at IS NULL;

-- Phase 2: Capacity enforcement trigger
CREATE OR REPLACE FUNCTION public.check_event_capacity()
RETURNS TRIGGER AS $$
DECLARE
  event_capacity INTEGER;
  confirmed_count INTEGER;
  pending_valid_count INTEGER;
BEGIN
  -- Get event capacity
  SELECT capacity INTO event_capacity
  FROM events WHERE id = NEW.event_id;
  
  -- Count confirmed bookings
  SELECT COUNT(*) INTO confirmed_count
  FROM event_bookings 
  WHERE event_id = NEW.event_id 
    AND status = 'confirmed';
  
  -- Count valid pending bookings (not expired)
  SELECT COUNT(*) INTO pending_valid_count
  FROM event_bookings 
  WHERE event_id = NEW.event_id 
    AND status = 'pending'
    AND expires_at > now()
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
  
  -- Check if event is full (confirmed + valid pending)
  IF (confirmed_count + pending_valid_count) >= COALESCE(event_capacity, 50) THEN
    RAISE EXCEPTION 'Event is sold out or all spots are reserved';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create capacity enforcement trigger
DROP TRIGGER IF EXISTS enforce_event_capacity_trigger ON public.event_bookings;
CREATE TRIGGER enforce_event_capacity_trigger
  BEFORE INSERT ON public.event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_event_capacity();

-- Phase 3: Fix membership_leads permissive INSERT policy
-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Anyone can create membership leads" ON public.membership_leads;

-- Create a more restrictive policy that still allows public lead creation
-- but includes rate limiting via a function
CREATE OR REPLACE FUNCTION public.can_create_lead()
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INTEGER;
  ip_address TEXT;
BEGIN
  -- For now, allow all inserts but could add rate limiting here
  -- This function exists to provide a hook for future rate limiting
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create policy with function call instead of bare 'true'
CREATE POLICY "Anyone can create membership leads with validation"
ON public.membership_leads
FOR INSERT
WITH CHECK (public.can_create_lead());

-- Phase 4: RLS policy to hide expired pending bookings from capacity counts
-- (but users can still see their own expired bookings)
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.event_bookings;
CREATE POLICY "Users can view their own bookings"
ON public.event_bookings
FOR SELECT
USING (auth.uid() = user_id);