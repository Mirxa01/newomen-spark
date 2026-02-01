-- ===== FIX 1: Profiles table - Block anonymous access =====
-- Add explicit policy to deny SELECT for unauthenticated users
-- (existing policies only work for authenticated users)
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- ===== FIX 2: Membership leads - Block anonymous SELECT =====
-- Add explicit policy to deny SELECT for anonymous users
-- Admins already have SELECT via their policy, but anon role needs explicit deny
CREATE POLICY "Block anonymous access to membership leads"
ON public.membership_leads
FOR SELECT
TO anon
USING (false);

-- ===== FIX 3: Event bookings - Add rate limiting and payment verification =====

-- 3a. Create rate limiting function for booking creation
CREATE OR REPLACE FUNCTION public.can_create_booking(_user_id UUID, _event_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recent_attempts INTEGER;
BEGIN
  -- Count booking attempts in the last 24 hours for this user/event combo
  SELECT COUNT(*) INTO recent_attempts
  FROM public.event_bookings
  WHERE user_id = _user_id 
    AND event_id = _event_id
    AND created_at > now() - interval '24 hours';
  
  -- Allow max 3 attempts per user per event per day
  RETURN recent_attempts < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3b. Create function to verify transformation membership for free access
CREATE OR REPLACE FUNCTION public.is_transformation_member(_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
      AND tier = 'transformation'
      AND status = 'active'
      AND (current_period_end IS NULL OR current_period_end > now())
  ) INTO is_member;
  
  RETURN is_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3c. Update booking INSERT policy with rate limiting
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.event_bookings;
CREATE POLICY "Users can create their own bookings"
ON public.event_bookings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND can_create_booking(auth.uid(), event_id)
);

-- 3d. Create trigger to validate member access on booking insert/update
CREATE OR REPLACE FUNCTION public.validate_booking_member_access()
RETURNS TRIGGER AS $$
BEGIN
  -- If claiming member access, verify they're actually a transformation member
  IF NEW.is_member_access = true THEN
    IF NOT is_transformation_member(NEW.user_id) THEN
      RAISE EXCEPTION 'User is not a valid transformation tier member';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop if exists and recreate trigger
DROP TRIGGER IF EXISTS validate_member_access_trigger ON public.event_bookings;
CREATE TRIGGER validate_member_access_trigger
BEFORE INSERT OR UPDATE ON public.event_bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_booking_member_access();

-- 3e. Create trigger to validate confirmed bookings have payment or member access
CREATE OR REPLACE FUNCTION public.validate_confirmed_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow confirmed status if payment is verified OR member access is true
  IF NEW.status = 'confirmed' THEN
    IF NEW.payment_id IS NULL AND NEW.is_member_access = false THEN
      RAISE EXCEPTION 'Cannot confirm booking without payment verification or member access';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop if exists and recreate trigger
DROP TRIGGER IF EXISTS validate_confirmed_booking_trigger ON public.event_bookings;
CREATE TRIGGER validate_confirmed_booking_trigger
BEFORE INSERT OR UPDATE ON public.event_bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_confirmed_booking();