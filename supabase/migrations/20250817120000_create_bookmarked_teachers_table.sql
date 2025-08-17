CREATE TABLE bookmarked_teachers (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, teacher_id)
);