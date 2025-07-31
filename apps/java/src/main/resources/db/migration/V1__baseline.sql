CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name TEXT NOT NULL CONSTRAINT chk_user_first_name CHECK ((char_length(first_name) <= 255)),
    last_name TEXT NOT NULL CONSTRAINT chk_user_last_name CHECK ((char_length(last_name) <= 255)),
    pass_hash CHAR(60) NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);