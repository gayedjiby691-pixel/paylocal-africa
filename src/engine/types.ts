// ==============================================================================
// PAYLOCAL - Moteur de Paie : Types & Modèles de Données
// ==============================================================================

export type CountryCode = 'SN' | 'CI' | 'CM' | 'BJ'; // Sénégal, Côte d'Ivoire, Cameroun, Bénin

export type EmployeeCategory = 'CADRE' | 'NON_CADRE';

export type MobileMoneyProvider = 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'BANK';

export interface EmployeeProfile {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  jobTitle?: string; // Poste / Fonction occupée (ex: Vigile, Agent de sécurité, Comptable)
  phone: string;
  email?: string;
  country: CountryCode;
  category: EmployeeCategory;
  fiscalParts: number; // Parts fiscales pour le quotient familial
  childrenCount: number;
  
  // Salaire de base et indemnités contractuelles
  baseSalary: number; // Salaire de base (XOF ou XAF)
  transportAllowance: number;
  housingAllowance: number;
  functionAllowance: number;
  otherTaxablePrimes: number;
  
  // Mode de paiement
  paymentProvider: MobileMoneyProvider;
  payoutPhone: string;
}

export interface PayrollInput {
  employee: EmployeeProfile;
  overtimeHours?: number;
  overtimeAmount?: number;
  salaryAdvancesDeduction: number;
  exceptionalBonus?: number;
  absenceDeduction?: number;
}

export interface SocialContribution {
  name: string;
  baseAmount: number;
  employeeRate: number;
  employeeAmount: number;
  employerRate: number;
  employerAmount: number;
}

export interface TaxDeduction {
  name: string;
  taxableBase: number;
  amount: number;
  details?: string;
}

export interface PayslipResult {
  employeeId: string;
  matricule: string;
  employeeName: string;
  periodLabel: string;
  country: CountryCode;
  currency: string;
  
  // Éléments bruts
  baseSalary: number;
  overtimeAmount: number;
  taxableAllowances: number;
  exemptAllowances: number;
  grossSalary: number;
  
  // Cotisations Sociales
  socialContributions: SocialContribution[];
  totalEmployeeSocial: number;
  totalEmployerSocial: number;
  
  // Impôt sur le revenu
  taxableGrossSalary: number;
  taxes: TaxDeduction[];
  totalTaxes: number;
  
  // Déductions diverses
  salaryAdvancesDeduction: number;
  
  // Soldes Nets
  netSalaryBeforeAdvances: number;
  netToPay: number;
  
  // Coût Global pour l'employeur
  totalCostToCompany: number;
  
  // Informations de virement
  paymentProvider: MobileMoneyProvider;
  payoutPhone: string;
}

export type BrandColorTheme = 'EMERALD' | 'BLUE' | 'AMBER' | 'PURPLE' | 'ROSE';

export interface EnterpriseBranding {
  companyName: string;
  tagline: string;
  legalId: string; // NINEA / RCCM / NIU / IFU
  headquarters: string;
  phone: string;
  brandColor: BrandColorTheme;
  logoInitial: string;
  whiteLabelMode: boolean; // Marque blanche (masque la mention PayLocal pour afficher 100% l'entreprise)
  smsSenderName: string; // Nom de l'expéditeur SMS Mobile Money (Wave / Orange Money)
  customStampTitle: string; // Titre du signataire officiel (ex: Direction Générale)
}
