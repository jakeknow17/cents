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
    amount          NUMERIC(10, 2) NOT NULL,
    color           TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_budget_category_name         UNIQUE (name),
    CONSTRAINT chk_budget_category_name_len     CHECK (char_length(name) <= 255),
    CONSTRAINT chk_budget_category_amount       CHECK (amount >= 0),
    CONSTRAINT chk_budget_category_color        CHECK (color ~ '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
);
CREATE INDEX IF NOT EXISTS idx_budget_category_name ON budget_category (name);
CREATE OR REPLACE TRIGGER trg_budget_category_updated_at_before_update
    BEFORE UPDATE ON budget_category
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_vendor (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    link        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_budget_vendor_name     UNIQUE (name),
    CONSTRAINT chk_budget_vendor_name_len CHECK (char_length(name) <= 255),
    CONSTRAINT chk_budget_vendor_link_len CHECK (char_length(name) <= 1000)
);
CREATE INDEX IF NOT EXISTS idx_budget_vendor_name ON budget_vendor (name);
CREATE OR REPLACE TRIGGER trg_budget_vendor_updated_at_before_update
    BEFORE UPDATE ON budget_vendor
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_account (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_budget_account_name     UNIQUE (name),
    CONSTRAINT chk_budget_account_name_len CHECK (char_length(name) <= 255),
    CONSTRAINT chk_budget_account_type_len CHECK (char_length(name) <= 255)
);
CREATE INDEX IF NOT EXISTS idx_budget_account_name ON budget_account (name);
CREATE OR REPLACE TRIGGER trg_budget_account_updated_at_before_update
    BEFORE UPDATE ON budget_account
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_tag (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_budget_tag_name     UNIQUE (name),
    CONSTRAINT chk_budget_tag_name_len CHECK (char_length(name) <= 255)
);
CREATE INDEX IF NOT EXISTS idx_budget_tag_name ON budget_tag (name);
CREATE OR REPLACE TRIGGER trg_budget_tag_updated_at_before_update
    BEFORE UPDATE ON budget_tag
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_transaction (
    id                  BIGSERIAL PRIMARY KEY,
    transaction_date    DATE NOT NULL,
    amount              NUMERIC(10, 2) NOT NULL,
    type                TEXT NOT NULL,
    description         TEXT NOT NULL,
    notes               TEXT NOT NULL,
    budget_category_id  BIGINT REFERENCES budget_category (id) ON DELETE SET NULL,
    budget_vendor_id    BIGINT REFERENCES budget_vendor (id) ON DELETE SET NULL,
    budget_account_id   BIGINT REFERENCES budget_account (id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_budget_transaction_type_len CHECK (char_length(type) <= 255),
    CONSTRAINT chk_budget_transaction_description_len CHECK (char_length(description) <= 255),
    CONSTRAINT chk_budget_transaction_notes_len CHECK (char_length(notes) <= 1000)
);
CREATE INDEX IF NOT EXISTS idx_budget_transaction_date ON budget_transaction (transaction_date);
CREATE INDEX IF NOT EXISTS idx_budget_transaction_description ON budget_transaction (description);
CREATE INDEX IF NOT EXISTS idx_budget_transaction_notes ON budget_transaction (notes);
CREATE OR REPLACE TRIGGER trg_budget_transaction_updated_at_before_update
    BEFORE UPDATE ON budget_transaction
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();

CREATE TABLE IF NOT EXISTS budget_transaction_tag (
    budget_transaction_id  BIGINT NOT NULL REFERENCES budget_transaction (id) ON DELETE CASCADE,
    budget_tag_id          BIGINT NOT NULL REFERENCES budget_tag (id) ON DELETE CASCADE,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_budget_transaction_tag PRIMARY KEY (budget_transaction_id, budget_tag_id)
);
CREATE INDEX IF NOT EXISTS idx_budget_transaction_tag_transaction_id ON budget_transaction_tag (budget_transaction_id);
CREATE INDEX IF NOT EXISTS idx_budget_transaction_tag_tag_id ON budget_transaction_tag (budget_tag_id);
CREATE OR REPLACE TRIGGER trg_budget_transaction_tag_updated_at_before_update
    BEFORE UPDATE ON budget_transaction_tag
    FOR EACH ROW EXECUTE FUNCTION updated_at_now();
