CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status session_status DEFAULT 'active',
    duration_seconds INTEGER DEFAULT 0,
    intensity_preference TEXT DEFAULT 'direct',
    messages_count INTEGER DEFAULT 0,
    summary TEXT,
    summary_generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);