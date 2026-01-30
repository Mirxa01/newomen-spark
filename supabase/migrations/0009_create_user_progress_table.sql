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