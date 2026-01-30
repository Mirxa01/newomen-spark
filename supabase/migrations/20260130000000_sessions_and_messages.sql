-- ============================================
-- VOICE SESSIONS TABLE
-- ============================================
CREATE TYPE public.session_status AS ENUM ('active', 'ended', 'interrupted');

CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status session_status DEFAULT 'active',
    duration_seconds INTEGER DEFAULT 0,
    intensity_preference public.intensity_preference DEFAULT 'direct',
    messages_count INTEGER DEFAULT 0,
    summary TEXT,
    summary_generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.sessions FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own sessions
CREATE POLICY "Users can create their own sessions"
ON public.sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions"
ON public.sessions FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- CHAT MESSAGES TABLE
-- ============================================
CREATE TYPE public.message_role AS ENUM ('user', 'assistant', 'system');

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    saved_to_memory BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own messages
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own messages
CREATE POLICY "Users can create their own messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages (for memory toggle/delete)
CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- WELLNESS LIBRARY TABLE
-- ============================================
CREATE TYPE public.content_type AS ENUM ('audio', 'youtube', 'article');

CREATE TABLE public.wellness_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    content_type content_type NOT NULL DEFAULT 'article',
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    url TEXT, -- For YouTube videos or external audio
    audio_file_url TEXT, -- For uploaded audio files
    duration_minutes INTEGER,
    thumbnail_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wellness_library ENABLE ROW LEVEL SECURITY;

-- Anyone can view active wellness content
CREATE POLICY "Anyone can view active wellness content"
ON public.wellness_library FOR SELECT
USING (is_active = TRUE);

-- Admins can manage wellness content
CREATE POLICY "Admins can manage wellness content"
ON public.wellness_library FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- USER PROGRESS TABLE (for tracking completion)
-- ============================================
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    assessments_completed TEXT[] DEFAULT '{}',
    wellness_content_completed TEXT[] DEFAULT '{}',
    daily_streak_days INTEGER DEFAULT 0,
    total_voice_minutes INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress"
ON public.user_progress FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- COUPLES CHALLENGE TABLE
-- ============================================
CREATE TYPE public.challenge_status AS ENUM ('pending', 'active', 'completed');

CREATE TABLE public.couples_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    partner_email TEXT,
    partner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status challenge_status DEFAULT 'pending',
    compatibility_result JSONB DEFAULT '{}',
    inviter_assessment_id UUID,
    partner_assessment_id UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.couples_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges"
ON public.couples_challenges FOR SELECT
USING (auth.uid() = inviter_user_id OR auth.uid() = partner_user_id);

CREATE POLICY "Users can create challenges"
ON public.couples_challenges FOR INSERT
WITH CHECK (auth.uid() = inviter_user_id);

CREATE POLICY "Users can update challenges they're part of"
ON public.couples_challenges FOR UPDATE
USING (auth.uid() = inviter_user_id OR auth.uid() = partner_user_id);

-- Admins can view all challenges
CREATE POLICY "Admins can view all challenges"
ON public.couples_challenges FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- ADMIN AUDIT LOG TABLE
-- ============================================
CREATE TYPE public.audit_action AS ENUM (
  'create', 'update', 'delete', 'publish', 'unpublish',
  'promote_user', 'demote_user', 'bulk_import', 'bulk_export'
);

CREATE TABLE public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action audit_action NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can create audit logs (done via triggers/functions)
CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_log FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Super admins and the admin who created the log can view it
CREATE POLICY "Super admins and creators can view audit logs"
ON public.admin_audit_log FOR SELECT
USING (
  public.has_role(auth.uid(), 'super_admin') OR 
  auth.uid() = admin_user_id
);

-- ============================================
-- UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wellness_library_updated_at
    BEFORE UPDATE ON public.wellness_library
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_couples_challenges_updated_at
    BEFORE UPDATE ON public.couples_challenges
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUTO-CREATE USER PROGRESS ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_user_progress_created ON auth.users;
CREATE TRIGGER on_user_progress_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_progress();

-- ============================================
-- SESSION STATISTICS UPDATE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.sessions
    SET messages_count = messages_count + 1
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status AND NEW.status = 'ended' THEN
      UPDATE public.user_progress
      SET 
        total_voice_minutes = total_voice_minutes + FLOOR(NEW.duration_seconds / 60),
        total_sessions = total_sessions + 1,
        last_active_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_session_stats_trigger
  AFTER INSERT OR UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_session_stats();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_status ON public.sessions(status);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at DESC);

CREATE INDEX idx_messages_session_id ON public.messages(session_id);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX idx_wellness_category ON public.wellness_library(category);
CREATE INDEX idx_wellness_type ON public.wellness_library(content_type);
CREATE INDEX idx_wellness_featured ON public.wellness_library(is_featured) WHERE is_featured = TRUE;

CREATE INDEX idx_couples_inviter ON public.couples_challenges(inviter_user_id);
CREATE INDEX idx_couples_code ON public.couples_challenges(invite_code);
CREATE INDEX idx_couples_expires ON public.couples_challenges(expires_at);

CREATE INDEX idx_audit_admin ON public.admin_audit_log(admin_user_id);
CREATE INDEX idx_audit_action ON public.admin_audit_log(action);
CREATE INDEX idx_audit_created_at ON public.admin_audit_log(created_at DESC);
