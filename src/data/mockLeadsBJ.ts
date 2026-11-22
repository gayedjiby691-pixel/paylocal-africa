export interface ProspectBJ {
  id: string;
  companyName: string;
  sector: 'SECURITE' | 'COMPTABILITE' | 'BTP_NETTOYAGE';
  district: string;
  phone: string;
  whatsappPhone: string;
  email?: string;
  estimatedEmployees: string;
  contactPerson: string;
  keyPainPoint: string;
  status: 'A_CONTACTER' | 'MESSAGE_ENVOYE' | 'DEMO_PREVUE' | 'CLIENT_SIGNE';
  personalizedMessage: string;
}

export const initialLeadsBJ: ProspectBJ[] = [
  {
    id: 'lead-bj-001',
    companyName: 'Bénin Gardiennage & Surveillance (BGS)',
    sector: 'SECURITE',
    district: 'Cotonou (Haie Vive / Ganhi)',
    phone: '+229 97 45 12 80',
    whatsappPhone: '22997451280',
    email: 'contact@bgs-benin.bj',
    estimatedEmployees: '50 - 90 agents',
    contactPerson: 'Directeur Général',
    keyPainPoint: 'Risque de manipulation d\'espèces pour la paie des vigiles à Cotonou et Calavi.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction BGS, PayLocal permet de virer les salaires de tous vos agents sur MTN MoMo et Moov Money en 1 clic avec bulletins légaux conformes CNSS & IPTS Bénin. Seriez-vous disponible pour une brève démo de 10 min ?'
  },
  {
    id: 'lead-bj-002',
    companyName: 'Cabinet Audit & Conseil du Bénin (CACB)',
    sector: 'COMPTABILITE',
    district: 'Cotonou (Cadjehoun)',
    phone: '+229 96 11 22 33',
    whatsappPhone: '22996112233',
    email: 'expert@cacb-benin.com',
    estimatedEmployees: '20 entreprises suivies',
    contactPerson: 'Expert-Comptable Agréé',
    keyPainPoint: 'Génération manuelle des bordereaux uniques CNSS et calcul du VPS 4%.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Maître, simplifiez la gestion sociale de vos clients au Bénin : PayLocal automatise le barème IPTS, les cotisations CNSS et le VPS avec export direct des déclarations fiscales en un clic. Discutons-en 5 minutes.'
  },
  {
    id: 'lead-bj-003',
    companyName: 'Nettoyage & Propreté Moderne SARL',
    sector: 'BTP_NETTOYAGE',
    district: 'Cotonou (Akpakpa)',
    phone: '+229 95 80 70 60',
    whatsappPhone: '22995807060',
    email: 'direction@proprete-benin.bj',
    estimatedEmployees: '65 agents de surface',
    contactPerson: 'Gérant / Chef du Personnel',
    keyPainPoint: 'Retards récurrents de paiement et départs d\'agents.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction Propreté Moderne, assurez la ponctualité de vos paies en envoyant les salaires par virement groupé sur MTN MoMo et Moov Money dès le 30 du mois, tout en archivant les preuves sur 10 ans. Pouvons-nous vous faire une démo test ?'
  }
];
