-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER ROLES (for admin permissions)
-- ============================================
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TYPE public.intensity_preference AS ENUM ('soft', 'direct', 'no_mercy');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    nickname TEXT,
    full_name TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    horoscope_sign TEXT,
    language TEXT DEFAULT 'en',
    cultural_preferences JSONB DEFAULT '{}',
    intensity_preference intensity_preference DEFAULT 'direct',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 0,
    memory_consent BOOLEAN DEFAULT TRUE,
    psychological_profile JSONB DEFAULT '{}',
    voice_minutes_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TYPE public.subscription_tier AS ENUM ('discovery', 'growth', 'transformation');
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tier subscription_tier NOT NULL DEFAULT 'discovery',
    status subscription_status NOT NULL DEFAULT 'active',
    paypal_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    voice_minutes_limit INTEGER DEFAULT 0,
    voice_minutes_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    capacity INTEGER DEFAULT 50,
    spots_taken INTEGER DEFAULT 0,
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    status event_status DEFAULT 'draft',
    member_free_access BOOLEAN DEFAULT FALSE,
    transformation_only BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can view published events
CREATE POLICY "Anyone can view published events"
ON public.events FOR SELECT
USING (status = 'published');

-- Admins can manage all events
CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- EVENT BOOKINGS TABLE
-- ============================================
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');

CREATE TABLE public.event_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status booking_status DEFAULT 'pending',
    ticket_type TEXT DEFAULT 'standard',
    payment_id TEXT,
    payment_status TEXT,
    amount_paid DECIMAL(10, 2),
    is_member_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (event_id, user_id)
);

ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
ON public.event_bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.event_bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.event_bookings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings"
ON public.event_bookings FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- MEMBERSHIP LEADS TABLE (WhatsApp form)
-- ============================================
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'converted', 'declined');

CREATE TABLE public.membership_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    event_id UUID REFERENCES public.events(id),
    source TEXT,
    status lead_status DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_leads ENABLE ROW LEVEL SECURITY;

-- Leads can be created by anyone (public form)
CREATE POLICY "Anyone can create membership leads"
ON public.membership_leads FOR INSERT
WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view leads"
ON public.membership_leads FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage leads"
ON public.membership_leads FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- ASSESSMENTS TABLE
-- ============================================
CREATE TYPE public.assessment_visibility AS ENUM ('public', 'authenticated', 'members_only');

CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    icon TEXT,
    questions_count INTEGER DEFAULT 0,
    duration_minutes INTEGER DEFAULT 10,
    visibility assessment_visibility DEFAULT 'public',
    is_active BOOLEAN DEFAULT TRUE,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    questions JSONB DEFAULT '[]',
    scoring_logic JSONB DEFAULT '{}',
    result_narratives JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Public assessments viewable by anyone
CREATE POLICY "Anyone can view public assessments"
ON public.assessments FOR SELECT
USING (visibility = 'public' AND is_active = TRUE);

-- Authenticated users can view authenticated assessments
CREATE POLICY "Authenticated can view auth assessments"
ON public.assessments FOR SELECT
USING (visibility IN ('public', 'authenticated') AND is_active = TRUE AND auth.uid() IS NOT NULL);

-- Admins can manage all assessments
CREATE POLICY "Admins can manage assessments"
ON public.assessments FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- ASSESSMENT RESULTS TABLE
-- ============================================
CREATE TABLE public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    answers JSONB DEFAULT '{}',
    scores JSONB DEFAULT '{}',
    result_narrative TEXT,
    follow_up_prompts JSONB DEFAULT '[]',
    saved_to_memory BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own results"
ON public.assessment_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results"
ON public.assessment_results FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all results"
ON public.assessment_results FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- ONBOARDING QUESTIONS TABLE
-- ============================================
CREATE TABLE public.onboarding_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'multiple_choice',
    options JSONB DEFAULT '[]',
    order_index INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view onboarding questions"
ON public.onboarding_questions FOR SELECT
USING (true);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_bookings_updated_at
    BEFORE UPDATE ON public.event_bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_membership_leads_updated_at
    BEFORE UPDATE ON public.membership_leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();