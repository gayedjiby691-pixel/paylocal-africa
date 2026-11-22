export interface ProspectCM {
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

export const initialLeadsCM: ProspectCM[] = [
  {
    id: 'lead-cm-001',
    companyName: 'Cameroon Security Services (Douala)',
    sector: 'SECURITE',
    district: 'Douala (Akwa / Bonanjo)',
    phone: '+237 6 99 45 21 00',
    whatsappPhone: '237699452100',
    email: 'contact@cameroon-security.cm',
    estimatedEmployees: '70 - 140 agents',
    contactPerson: 'Directeur d\'Exploitation',
    keyPainPoint: 'Retraits de cash risqués pour payer les vigiles dispersés sur Douala et Yaoundé.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction Cameroon Security, PayLocal automatise le virement groupé de vos salaires sur MTN Mobile Money et Orange Money en 3 secondes avec bulletins conformes DIPE & CNPS Cameroun. Seriez-vous ouvert à une démo de 10 min cette semaine ?'
  },
  {
    id: 'lead-cm-002',
    companyName: 'Cabinet Fiduciaire d\'Afrique Centrale (CFAC)',
    sector: 'COMPTABILITE',
    district: 'Douala (Bonapriso)',
    phone: '+237 6 77 88 12 34',
    whatsappPhone: '237677881234',
    email: 'direction@cfac-cameroun.com',
    estimatedEmployees: '15 clients PME gérées',
    contactPerson: 'Expert-Comptable Associé',
    keyPainPoint: 'Calculs fastidieux des cotisations CNPS 750k, CFC, FNE et télé-déclarations DIPE.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Maître, PayLocal intègre directement le barème IRPP et CAC Cameroun et le plafond CNPS 750k avec génération automatique du DIPE en un clic pour vos clients. Pouvons-nous vous présenter l\'espace fiduciaire ?'
  },
  {
    id: 'lead-cm-003',
    companyName: 'BTP & Logistique Littoral SA',
    sector: 'BTP_NETTOYAGE',
    district: 'Douala (Zone Portuaire / Bassa)',
    phone: '+237 6 94 30 15 88',
    whatsappPhone: '237694301588',
    email: 'rh@btp-littoral.cm',
    estimatedEmployees: '110 ouvriers et chauffeurs',
    contactPerson: 'Responsable RH & Paie',
    keyPainPoint: 'Files d\'attente interminables aux guichets pour les journaliers.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction BTP Littoral, fini les paiements manuels de vos équipes de chantier : PayLocal dispatche les paies sur leurs portefeuilles MTN et Orange Money instantanément avec traçabilité complète. Disponible pour un test sur 5 salariés ?'
  }
];
