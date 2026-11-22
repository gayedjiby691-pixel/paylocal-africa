-- ==============================================================================
-- PAYLOCAL - Base de données PostgreSQL (Multi-tenant & Conformité OHADA / UEMOA)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ORGANISATIONS / ENTREPRISES (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_id VARCHAR(100), -- NINEA au Sénégal, CC / RCCM en Côte d'Ivoire
    country_code VARCHAR(2) NOT NULL DEFAULT 'SN', -- 'SN' pour Sénégal, 'CI' pour Côte d'Ivoire
    currency VARCHAR(10) NOT NULL DEFAULT 'XOF',
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. UTILISATEURS DU SYSTÈME (Admins, RH, Experts-comptables)
CREATE TYPE user_role AS ENUM ('super_admin', 'accountant', 'hr_manager', 'director', 'viewer');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role user_role NOT NULL DEFAULT 'hr_manager',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EMPLOYÉS
CREATE TYPE contract_type AS ENUM ('CDI', 'CDD', 'STAGE', 'JOURNALIER', 'PRESTATAIRE');
CREATE TYPE professional_category AS ENUM ('CADRE', 'NON_CADRE');
CREATE TYPE mobile_money_provider AS ENUM ('WAVE', 'ORANGE_MONEY', 'MTN_MOMO', 'MOOV_MONEY', 'CASH', 'BANK_TRANSFER');

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) NOT NULL, -- Matricule interne
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    
    -- Situation Légale & Fiscale
    contract_type contract_type NOT NULL DEFAULT 'CDI',
    category professional_category NOT NULL DEFAULT 'NON_CADRE',
    marital_status VARCHAR(50) DEFAULT 'CELIBATAIRE', -- CELIBATAIRE, MARIE, etc.
    children_count INT DEFAULT 0,
    fiscal_parts NUMERIC(3, 1) DEFAULT 1.0, -- Parts fiscales pour le quotient familial
    national_id VARCHAR(100), -- CNI / Passeport
    social_security_number VARCHAR(100), -- N° IPRES / CNPS
    
    -- Paramètres de Rémunération
    base_salary NUMERIC(12, 2) NOT NULL, -- Salaire de base (XOF)
    transport_allowance NUMERIC(12, 2) DEFAULT 0, -- Indemnité de transport (souvent exonérée sous un seuil)
    housing_allowance NUMERIC(12, 2) DEFAULT 0, -- Indemnité de logement (imposable)
    other_taxable_primes NUMERIC(12, 2) DEFAULT 0,
    other_exempt_primes NUMERIC(12, 2) DEFAULT 0,
    
    -- Mode de Paiement Principal
    payout_method mobile_money_provider NOT NULL DEFAULT 'WAVE',
    payout_account_number VARCHAR(50) NOT NULL, -- N° Wave ou Orange Money
    
    is_active BOOLEAN DEFAULT TRUE,
    hired_at DATE NOT NULL,
    resigned_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(organization_id, employee_code)
);

-- 5. ACOMPTES SUR SALAIRE (Gestion du 15 du mois)
CREATE TYPE advance_status AS ENUM ('PENDING', 'APPROVED', 'DISBURSED', 'DEDUCTED', 'REJECTED');

CREATE TABLE IF NOT EXISTS salary_advances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status advance_status NOT NULL DEFAULT 'PENDING',
    payout_method mobile_money_provider,
    payout_transaction_ref VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PÉRIODES DE PAIE (Mensuelles)
CREATE TYPE payroll_period_status AS ENUM ('DRAFT', 'VALIDATED', 'PAID', 'CLOSED');

CREATE TABLE IF NOT EXISTS payroll_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_label VARCHAR(50) NOT NULL, -- ex: "Mai 2026"
    month INT NOT NULL, -- 1 à 12
    year INT NOT NULL,  -- ex: 2026
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status payroll_period_status NOT NULL DEFAULT 'DRAFT',
    total_gross NUMERIC(15, 2) DEFAULT 0,
    total_net NUMERIC(15, 2) DEFAULT 0,
    total_social_employee NUMERIC(15, 2) DEFAULT 0,
    total_social_employer NUMERIC(15, 2) DEFAULT 0,
    total_tax NUMERIC(15, 2) DEFAULT 0,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(organization_id, month, year)
);

-- 7. BULLETINS DE PAIE DÉTAILLÉS (Fiche de Paie)
CREATE TABLE IF NOT EXISTS payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_period_id UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    
    -- Données de Rémunération
    base_salary NUMERIC(12, 2) NOT NULL,
    overtime_amount NUMERIC(12, 2) DEFAULT 0,
    taxable_allowances NUMERIC(12, 2) DEFAULT 0,
    exempt_allowances NUMERIC(12, 2) DEFAULT 0,
    gross_salary NUMERIC(12, 2) NOT NULL, -- Salaire Brut Total
    
    -- Cotisations Sociales Salariales
    social_security_employee NUMERIC(12, 2) NOT NULL, -- Ex: IPRES / CNPS
    health_insurance_employee NUMERIC(12, 2) NOT NULL, -- Ex: IPM / CMU
    total_social_employee NUMERIC(12, 2) NOT NULL,
    
    -- Impôts & Retenues Fiscales
    taxable_base NUMERIC(12, 2) NOT NULL,
    income_tax NUMERIC(12, 2) NOT NULL, -- IRPP / IS
    
    -- Déductions Diverses (Acomptes, Prêts)
    advances_deducted NUMERIC(12, 2) DEFAULT 0,
    other_deductions NUMERIC(12, 2) DEFAULT 0,
    
    -- NET FINAL
    net_salary NUMERIC(12, 2) NOT NULL, -- Montant net avant acompte
    net_to_pay NUMERIC(12, 2) NOT NULL,  -- Net effectif à verser sur Mobile Money
    
    -- Charges Patronales (Coût Entreprise)
    social_security_employer NUMERIC(12, 2) NOT NULL,
    accident_work_employer NUMERIC(12, 2) NOT NULL,
    total_employer_charges NUMERIC(12, 2) NOT NULL,
    total_cost_to_company NUMERIC(12, 2) NOT NULL, -- Coût global employeur
    
    -- Statut du Paiement
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_reference VARCHAR(255),
    payment_provider mobile_money_provider,
    
    -- Distribution WhatsApp
    sent_via_whatsapp BOOLEAN DEFAULT FALSE,
    whatsapp_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(payroll_period_id, employee_id)
);

-- 8. TRANSACTIONS & DÉBOURSEMENTS BULK (Wave / Orange Money)
CREATE TYPE bulk_payout_status AS ENUM ('INITIATED', 'PROCESSING', 'SUCCESS', 'PARTIAL_SUCCESS', 'FAILED');

CREATE TABLE IF NOT EXISTS payout_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_period_id UUID REFERENCES payroll_periods(id) ON DELETE SET NULL,
    provider mobile_money_provider NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    total_recipients INT NOT NULL,
    status bulk_payout_status NOT NULL DEFAULT 'INITIATED',
    external_batch_id VARCHAR(255), -- ID de transaction chez Wave / Orange Money
    approved_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS payout_batch_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES payout_batches(id) ON DELETE CASCADE,
    payslip_id UUID REFERENCES payslips(id) ON DELETE SET NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    external_transaction_id VARCHAR(255),
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- INDEXES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_payslips_period ON payslips(payroll_period_id);
CREATE INDEX IF NOT EXISTS idx_advances_employee ON salary_advances(employee_id);
