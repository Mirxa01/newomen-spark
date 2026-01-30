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