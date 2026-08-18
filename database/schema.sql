-- FindBack Database Schema Additions (Two-Factor Handover)

-- 1. Add private_verification_detail to lost_items
ALTER TABLE public.lost_items 
ADD COLUMN IF NOT EXISTS private_verification_detail TEXT;

-- 2. Create verification_otps table for Account Verification
CREATE TABLE IF NOT EXISTS public.verification_otps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create handover_requests table to track Handover status
CREATE TABLE IF NOT EXISTS public.handover_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id INTEGER REFERENCES public.matches(id) NOT NULL,
    lost_report_id INTEGER REFERENCES public.lost_items(id) NOT NULL,
    found_report_id INTEGER REFERENCES public.found_items(id) NOT NULL,
    requester_id UUID REFERENCES auth.users(id) NOT NULL,
    finder_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (match_id)
);
