ALTER TABLE session_history ADD COLUMN teacher_id UUID REFERENCES teachers(id);
