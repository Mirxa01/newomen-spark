-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active',
    duration_seconds INTEGER DEFAULT 0,
    intensity_preference TEXT DEFAULT 'direct',
    messages_count INTEGER DEFAULT 0,
    summary TEXT,
    summary_generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    saved_to_memory BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create wellness_library table
CREATE TABLE IF NOT EXISTS public.wellness_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    content_type TEXT NOT NULL DEFAULT 'article',
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    url TEXT,
    audio_file_url TEXT,
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

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
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

-- Create couples_challenges table
CREATE TABLE IF NOT EXISTS public.couples_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    partner_email TEXT,
    partner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    compatibility_result JSONB DEFAULT '{}',
    inviter_assessment_id UUID,
    partner_assessment_id UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.couples_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions
CREATE POLICY IF NOT EXISTS "Users can view their own sessions"
ON public.sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own sessions"
ON public.sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY IF NOT EXISTS "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own messages"
ON public.messages FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for wellness_library
CREATE POLICY IF NOT EXISTS "Anyone can view active wellness content"
ON public.wellness_library FOR SELECT
USING (is_active = TRUE);

-- RLS Policies for user_progress
CREATE POLICY IF NOT EXISTS "Users can view their own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for couples_challenges
CREATE POLICY IF NOT EXISTS "Users can view their own challenges"
ON public.couples_challenges FOR SELECT
USING (auth.uid() = inviter_user_id OR auth.uid() = partner_user_id);

CREATE POLICY IF NOT EXISTS "Users can create challenges"
ON public.couples_challenges FOR INSERT
WITH CHECK (auth.uid() = inviter_user_id);

CREATE POLICY IF NOT EXISTS "Users can update challenges they're part of"
ON public.couples_challenges FOR UPDATE
USING (auth.uid() = inviter_user_id OR auth.uid() = partner_user_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_wellness_library_updated_at ON public.wellness_library;
CREATE TRIGGER update_wellness_library_updated_at
    BEFORE UPDATE ON public.wellness_library
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_couples_challenges_updated_at ON public.couples_challenges;
CREATE TRIGGER update_couples_challenges_updated_at
    BEFORE UPDATE ON public.couples_challenges
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User progress trigger
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

-- Session stats update function and trigger
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
        total_voice_minutes = COALESCE(total_voice_minutes, 0) + FLOOR(NEW.duration_seconds / 60),
        total_sessions = COALESCE(total_sessions, 0) + 1,
        last_active_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_session_stats_trigger ON public.messages;
CREATE TRIGGER update_session_stats_trigger
  AFTER INSERT OR UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_session_stats();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_wellness_category ON public.wellness_library(category);
CREATE INDEX IF NOT EXISTS idx_wellness_type ON public.wellness_library(content_type);
CREATE INDEX IF NOT EXISTS idx_wellness_featured ON public.wellness_library(is_featured) WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_couples_inviter ON public.couples_challenges(inviter_user_id);
CREATE INDEX IF NOT EXISTS idx_couples_code ON public.couples_challenges(invite_code);
CREATE INDEX IF NOT EXISTS idx_couples_expires ON public.couples_challenges(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);