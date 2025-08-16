
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  plan TEXT,
  remaining_instances INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT REFERENCES users(id),
  session_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
