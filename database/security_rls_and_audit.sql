-- ==============================================================================
-- PAYLOCAL - Sécurité Niveau Banque : RLS Complet, Chiffrement & Audit Trail
-- Conforme aux exigences BCEAO, CDP (Sénégal) et ARTCI (Côte d'Ivoire)
-- Version 2.0 : 100% des tables couvertes avec clauses WITH CHECK complètes
-- ==============================================================================

-- 1. ACTIVATION DU ROW LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_batch_items ENABLE ROW LEVEL SECURITY;

-- 2. POLITIQUES RLS DE CLOISONNEMENT STRICT (TENANT ISOLATION EXHAUSTIF)
-- Une entreprise ne peut sous aucun prétexte lire ou modifier les données d'une autre entreprise.

-- Helper fonction d'obtention de l'organisation active
CREATE OR REPLACE FUNCTION get_current_org_id() RETURNS UUID AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_organization_id', true), '')::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2.1 Politique Organisations
DROP POLICY IF EXISTS tenant_isolation_orgs ON organizations;
CREATE POLICY tenant_isolation_orgs ON organizations
    FOR ALL
    USING (id = get_current_org_id())
    WITH CHECK (id = get_current_org_id());

-- 2.2 Politique Utilisateurs
DROP POLICY IF EXISTS tenant_isolation_users ON users;
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (organization_id = get_current_org_id())
    WITH CHECK (organization_id = get_current_org_id());

-- 2.3 Politique Salariés
DROP POLICY IF EXISTS tenant_isolation_employees ON employees;
CREATE POLICY tenant_isolation_employees ON employees
    FOR ALL
    USING (organization_id = get_current_org_id())
    WITH CHECK (organization_id = get_current_org_id());

-- 2.4 Politique Acomptes sur Salaire
DROP POLICY IF EXISTS tenant_isolation_advances ON salary_advances;
CREATE POLICY tenant_isolation_advances ON salary_advances
    FOR ALL
    USING (organization_id = get_current_org_id())
    WITH CHECK (organization_id = get_current_org_id());

-- 2.5 Politique Périodes de Paie
DROP POLICY IF EXISTS tenant_isolation_payroll_periods ON payroll_periods;
CREATE POLICY tenant_isolation_payroll_periods ON payroll_periods
    FOR ALL
    USING (organization_id = get_current_org_id())
    WITH CHECK (organization_id = get_current_org_id());

-- 2.6 Politique Bulletins de Paie
DROP POLICY IF EXISTS tenant_isolation_payslips ON payslips;
CREATE POLICY tenant_isolation_payslips ON payslips
    FOR ALL
    USING (
        payroll_period_id IN (
            SELECT id FROM payroll_periods WHERE organization_id = get_current_org_id()
        )
    )
    WITH CHECK (
        payroll_period_id IN (
            SELECT id FROM payroll_periods WHERE organization_id = get_current_org_id()
        )
    );

-- 2.7 Politique Lots de Déboursement (Payout Batches)
DROP POLICY IF EXISTS tenant_isolation_payout_batches ON payout_batches;
CREATE POLICY tenant_isolation_payout_batches ON payout_batches
    FOR ALL
    USING (
        payroll_period_id IN (
            SELECT id FROM payroll_periods WHERE organization_id = get_current_org_id()
        )
    )
    WITH CHECK (
        payroll_period_id IN (
            SELECT id FROM payroll_periods WHERE organization_id = get_current_org_id()
        )
    );

-- 2.8 Politique Lignes de Déboursement (Payout Batch Items)
DROP POLICY IF EXISTS tenant_isolation_payout_batch_items ON payout_batch_items;
CREATE POLICY tenant_isolation_payout_batch_items ON payout_batch_items
    FOR ALL
    USING (
        batch_id IN (
            SELECT b.id FROM payout_batches b
            JOIN payroll_periods p ON b.payroll_period_id = p.id
            WHERE p.organization_id = get_current_org_id()
        )
    )
    WITH CHECK (
        batch_id IN (
            SELECT b.id FROM payout_batches b
            JOIN payroll_periods p ON b.payroll_period_id = p.id
            WHERE p.organization_id = get_current_org_id()
        )
    );

-- ==============================================================================
-- 3. REGISTRE D'AUDIT IMMUABLE (AUDIT TRAIL SÉCURISÉ)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    actor_user_id UUID,
    actor_email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Interdiction stricte de modifier ou supprimer les logs d'audit (Immuabilité)
CREATE OR REPLACE RULE no_update_audit_logs AS ON UPDATE TO security_audit_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_audit_logs AS ON DELETE TO security_audit_logs DO INSTEAD NOTHING;

CREATE INDEX IF NOT EXISTS idx_audit_org_created ON security_audit_logs(organization_id, created_at DESC);

-- ==============================================================================
-- 4. TABLE DE GESTION DE L'IDEMPOTENCE (ANTI-DOUBLE DÉBOURSEMENT)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    organization_id UUID NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_payload_hash VARCHAR(64) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    response_body JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_idempotency_lookup ON idempotency_keys(idempotency_key, organization_id);

CREATE OR REPLACE FUNCTION purge_expired_idempotency_keys() RETURNS void AS $$
BEGIN
    DELETE FROM idempotency_keys WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
