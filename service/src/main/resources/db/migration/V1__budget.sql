CREATE OR REPLACE FUNCTION updated_at_now()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS budget_category (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    budget_limit    NUMERIC(10, 2) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_budget_category_name         UNIQUE (name),
    CONSTRAINT chk_budget_category_name_len     CHECK (char_length(name) <= 255),
    CONSTRAINT chk_budget_category_budget_limit CHECK (budget_limit >= 0)
);
CREATE INDEX IF NOT EXISTS idx_budget_category_name ON budget_category (name);
CREATE OR REPLACE TRIGGER trg_budget_category_updated_at_before_update
    BEFORE UPDATE ON budget_category
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_vendor (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_budget_vendor_name     UNIQUE (name),
    CONSTRAINT chk_budget_vendor_name_len CHECK (char_length(name) <= 255)
);
CREATE INDEX IF NOT EXISTS idx_budget_vendor_name ON budget_vendor (name);
CREATE OR REPLACE TRIGGER trg_budget_vendor_updated_at_before_update
    BEFORE UPDATE ON budget_vendor
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_entry (
    id                  BIGSERIAL PRIMARY KEY,
    entry_date          DATE NOT NULL,
    notes               TEXT NOT NULL,
    budget_category_id  BIGINT REFERENCES budget_category (id) ON DELETE SET NULL,
    budget_vendor_id    BIGINT REFERENCES budget_vendor (id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_budget_entry_notes_len CHECK (char_length(notes) <= 1000)
);
CREATE INDEX IF NOT EXISTS idx_budget_entry_entry_date ON budget_entry (entry_date);
CREATE OR REPLACE TRIGGER trg_budget_entry_updated_at_before_update
    BEFORE UPDATE ON budget_entry
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();
