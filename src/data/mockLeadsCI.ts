export interface ProspectCI {
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

export const initialLeadsCI: ProspectCI[] = [
  // 1. SÉCURITÉ & GARDIENNAGE (Gros volume Mobile Money)
  {
    id: 'lead-ci-001',
    companyName: 'Ivoire Technology Sécurité',
    sector: 'SECURITE',
    district: 'Marcory (Bd du Gabon)',
    phone: '+225 07 07 58 67 00',
    whatsappPhone: '2250707586700',
    estimatedEmployees: '60 - 120 vigiles',
    contactPerson: 'Responsable Paie / Gérant',
    keyPainPoint: 'Perte de temps sur les transferts Wave & Orange Money manuels à la fin du mois.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Monsieur le Gérant, je vous contacte concernant les agents d\'Ivoire Technology à Marcory. Avec PayLocal, plateforme régionale UEMOA, vous pouvez débourser tous les salaires de vos vigiles par Wave et Orange Money en 1 clic sans passer des heures sur votre téléphone. Seriez-vous ouvert à une courte démo en visio de 10 min ?'
  },
  {
    id: 'lead-ci-002',
    companyName: 'Arrow Patrol Security (APS)',
    sector: 'SECURITE',
    district: 'Marcory (Remblais)',
    phone: '+225 01 40 90 32 01', // Numéro mobile direct
    whatsappPhone: '2250140903201',
    estimatedEmployees: '40 - 80 vigiles',
    contactPerson: 'Directeur des Opérations',
    keyPainPoint: 'Gestion des acomptes du 15 du mois et déductions d\'absences compliquées sur Excel.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction APS Marcory, vos agents de sécurité demandent souvent des acomptes le 15 du mois. PayLocal permet d\'enregistrer l\'avance et de la déduire automatiquement du virement Wave/Orange Money final en toute conformité CNPS ivoirienne. Peut-on vous montrer le fonctionnement en 5 minutes ?'
  },
  {
    id: 'lead-ci-003',
    companyName: '911 Security',
    sector: 'SECURITE',
    district: 'Yopougon',
    phone: '+225 07 48 59 32 86',
    whatsappPhone: '2250748593286',
    estimatedEmployees: '30 - 70 agents',
    contactPerson: 'Gérant / DAF',
    keyPainPoint: 'Files d\'attente de vigiles venant réclamer leurs fiches de paie papier.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction 911 Security Yopougon, vos vigiles reçoivent-ils leurs fiches de paie sur WhatsApp ? PayLocal vire les salaires sur Mobile Money et distribue automatiquement les bulletins légaux certifiés CNPS sur WhatsApp. Testez gratuitement sur votre prochaine paie.'
  },
  {
    id: 'lead-ci-004',
    companyName: 'Batirem Group (BTP & Sécurité)',
    sector: 'BTP_NETTOYAGE',
    district: 'Cocody (Riviera Palmeraie)',
    phone: '+225 07 07 43 00 00',
    whatsappPhone: '2250707430000',
    estimatedEmployees: '50 - 100 ouvriers & agents',
    contactPerson: 'Direction Générale / DAF',
    keyPainPoint: 'Paiement en espèces fastidieux et erreurs de réconciliation sur chantiers.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction Batirem Group, gérer la paie d\'ouvriers et d\'agents dispersés sur vos chantiers à Abidjan prend un temps précieux. PayLocal permet de virer tous les salaires et acomptes en 1 clic par Wave et Orange Money avec bulletins certifiés CNPS. Disponible pour un test rapide ?'
  },
  {
    id: 'lead-ci-005',
    companyName: 'Cougar Sécurité SARLU',
    sector: 'SECURITE',
    district: 'Abidjan Sud',
    phone: '+225 07 08 23 23 48',
    whatsappPhone: '2250708232348',
    estimatedEmployees: '25 - 60 agents',
    contactPerson: 'Gérant',
    keyPainPoint: 'Retrait d\'espèces à la banque pour payer les vigiles sans compte bancaire.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Monsieur le Gérant de Cougar Sécurité, évitez les risques liés au transport d\'espèces pour la paie de vos vigiles. Avec PayLocal, plateforme régionale UEMOA, vous virez instantanément sur Wave, Orange Money et MTN en validant avec un code OTP sécurisé.'
  },

  // 2. CABINETS D'EXPERTISE COMPTABLE (Le levier multiplicateur x30 PMEs)
  {
    id: 'lead-ci-006',
    companyName: 'FS & Associés (Audit & Expertise)',
    sector: 'COMPTABILITE',
    district: 'Cocody (II Plateaux, Rue K35)',
    phone: '+225 07 09 97 08 62',
    whatsappPhone: '2250709970862',
    email: 'accueil@fsexpert-comptable.com',
    estimatedEmployees: 'Gère ~40 PMEs clientes',
    contactPerson: 'Expert-Comptable Associé',
    keyPainPoint: 'Temps excessif passé par les collaborateurs sur Excel à chaque clôture mensuelle.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Maître / Direction FS & Associés Cocody, vos collaborateurs passent des jours à recalculer la CNPS, la CMU et l\'IGR pour vos PMEs clientes. Nous avons conçu PayLocal, plateforme régionale UEMOA dédiée à la paie OHADA avec portail multi-clients pour cabinets et paiement en 1 clic par Wave/Orange Money. Pouvons-nous vous faire une démo de 10 min en visio ?'
  },
  {
    id: 'lead-ci-007',
    companyName: 'H2S Expertise Comptable',
    sector: 'COMPTABILITE',
    district: 'Cocody (Angré 8ème Tranche)',
    phone: '+225 07 19 66 58 74',
    whatsappPhone: '2250719665874',
    email: 'contact@h2s-ci.net',
    estimatedEmployees: 'Gère ~25 PMEs clientes',
    contactPerson: 'Gérant & Auditeur',
    keyPainPoint: 'Mise à jour complexe des barèmes de charges sociales et fiscales (CMU, IS 1.5%).',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Cabinet H2S Angré, facilitez la paie de vos clients PME. PayLocal intègre les règles DGI/CNPS/CMU ivoiriennes 2026 et permet à vos clients de payer leurs équipes par Mobile Money tout en vous fournissant les états DISA prêts à déclarer.'
  },
  {
    id: 'lead-ci-008',
    companyName: 'Cabinet NAKAWAR',
    sector: 'COMPTABILITE',
    district: 'Cocody (II Plateaux Las Palmas)',
    phone: '+225 07 08 48 69 93',
    whatsappPhone: '2250708486993',
    estimatedEmployees: 'Gère ~35 PMEs clientes',
    contactPerson: 'Responsable Pôle Social / Paie',
    keyPainPoint: 'Allers-retours permanents avec les clients pour valider les primes et acomptes.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Responsable Social Cabinet NAKAWAR, nous proposons aux cabinets comptables de l\'espace UEMOA un accès multi-entreprises pour gérer la paie de leurs clients en 3 clics avec transmission automatique des bulletins par WhatsApp. Disponible pour 10 min de démo ?'
  },
  {
    id: 'lead-ci-009',
    companyName: 'ABCD Consulting (Abou Bernard Charrier)',
    sector: 'COMPTABILITE',
    district: 'Plateau (Indénié)',
    phone: '+225 07 07 90 78 90',
    whatsappPhone: '2250707907890',
    estimatedEmployees: 'Gère ~50 PMEs clientes',
    contactPerson: 'Associé Directeur',
    keyPainPoint: 'Digitalisation des PMEs clientes et conformité stricte aux contrôles fiscaux DGI.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction ABCD Consulting Plateau, vos clients PME cherchent à moderniser la gestion de paie sans passer par des ERP lourds inadaptés à l\'Afrique. PayLocal gère la paie ivoirienne et le déboursement Wave/MTN en 1 clic. Découvrons ensemble notre offre Partenaire Cabinet.'
  },

  // 3. BTP, NETTOYAGE & MAINTENANCE (Ouvriers & rotation forte)
  {
    id: 'lead-ci-010',
    companyName: 'SED (Service et Entretien Divers)',
    sector: 'BTP_NETTOYAGE',
    district: 'Marcory Résidentiel',
    phone: '+225 07 89 38 38 59',
    whatsappPhone: '2250789383859',
    estimatedEmployees: '45 - 90 agents de surface',
    contactPerson: 'Directeur d\'Exploitation / RH',
    keyPainPoint: 'Paiement dispersé sur plusieurs opérateurs (certains sur Wave, d\'autres sur Orange Money).',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction SED Marcory, payer des dizaines d\'agents de nettoyage dispersés sur Wave et Orange Money chaque mois prend un temps fou. Avec PayLocal, vous chargez votre liste et tous vos collaborateurs sont crédités instantanément. Test gratuit sans engagement sur votre prochaine paie ?'
  },
  {
    id: 'lead-ci-011',
    companyName: 'Ultra-Net-Cité SARL',
    sector: 'BTP_NETTOYAGE',
    district: 'Marcory (Bd du Cameroun)',
    phone: '+225 07 07 28 13 50',
    whatsappPhone: '2250707281350',
    estimatedEmployees: '30 - 70 ouvriers / techniciens',
    contactPerson: 'Gérant',
    keyPainPoint: 'Gestion des primes de pénibilité, chantiers et avances d\'argent régulières.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Monsieur le Gérant d\'Ultra-Net-Cité, vos ouvriers et techniciens réclament souvent des acomptes en cours de mois. PayLocal gère les avances et débourse les salaires nets sur Mobile Money avec édition des fiches certifiées CNPS. Voyons cela ensemble en 10 minutes.'
  },
  {
    id: 'lead-ci-012',
    companyName: 'Entretien Sécurité Assistance (ESA)',
    sector: 'BTP_NETTOYAGE',
    district: 'Yopougon (Sogefiha)',
    phone: '+225 05 06 85 20 76',
    whatsappPhone: '2250506852076',
    estimatedEmployees: '40 - 80 salariés',
    contactPerson: 'Responsable des Ressources Humaines',
    keyPainPoint: 'Risques d\'erreurs dans le calcul des retenues CMU et impôt sur salaire (IS 1.5%).',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction ESA Yopougon, simplifiez la paie de vos équipes à Abidjan. PayLocal calcule automatiquement les cotisations CNPS/CMU ivoiriennes et permet de verser les salaires par Wave et MTN MoMo en 1 clic. Démonstration gratuite disponible cette semaine.'
  }
];
