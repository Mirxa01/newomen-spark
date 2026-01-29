-- Fix 1: Add admin SELECT policy for subscriptions
CREATE POLICY "Admins can view all subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Fix 2: Remove user UPDATE policy on subscriptions (they shouldn't be able to modify tier/limits)
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscriptions;

-- Fix 3: Replace user INSERT policy with server-only insert via trigger
-- First, drop the existing policy
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;

-- Create a policy that only allows admins to insert (users will go through edge functions)
CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscriptions 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create a policy that allows initial subscription creation during onboarding only for discovery tier
CREATE POLICY "Users can create discovery subscription" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND tier = 'discovery'::subscription_tier 
  AND status = 'active'::subscription_status
  AND voice_minutes_limit <= 5
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = auth.uid() 
    AND s.status = 'active'::subscription_status
  )
);

-- Fix 4: Add unique constraint for active subscriptions per user
CREATE UNIQUE INDEX IF NOT EXISTS one_active_subscription_per_user 
ON public.subscriptions (user_id) 
WHERE (status = 'active'::subscription_status);

-- Fix 5: Add admin management policy for subscriptions (update/delete)
CREATE POLICY "Admins can update subscriptions" 
ON public.subscriptions 
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can delete subscriptions" 
ON public.subscriptions 
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Fix 6: Prevent users from updating event booking status (only payment webhooks should)
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.event_bookings;

-- Users can only update bookings if they own them AND they're not changing status to confirmed
CREATE POLICY "Users can update pending bookings" 
ON public.event_bookings 
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending'::booking_status)
WITH CHECK (auth.uid() = user_id AND status IN ('pending'::booking_status, 'cancelled'::booking_status));

-- Fix 7: Add database constraint for WhatsApp number format
ALTER TABLE public.membership_leads 
ADD CONSTRAINT valid_whatsapp_format 
CHECK (whatsapp_number ~ '^\+?[1-9]\d{1,14}$');

-- Add length constraints for name
ALTER TABLE public.membership_leads 
ADD CONSTRAINT valid_fullname_length 
CHECK (length(full_name) >= 2 AND length(full_name) <= 100);