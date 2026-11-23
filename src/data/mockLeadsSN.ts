export interface ProspectSN {
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

export const initialLeadsSN: ProspectSN[] = [
  // 🌟 CLIENT CIBLE PRIORITAIRE DU JOUR (PRÉSENTATION PRÉVUE À MERMOZ)
  {
    id: 'lead-sn-000',
    companyName: 'BaEauBab Sénégal (Purification & Bonbonnes 19L)',
    sector: 'BTP_NETTOYAGE',
    district: 'Mermoz - Sacré-Cœur, Dakar',
    phone: '+221 33 865 40 40',
    whatsappPhone: '221338654040',
    email: 'baeaubab@baeaubab.sn',
    estimatedEmployees: '80 - 150 livreurs & techniciens',
    contactPerson: 'Directeur Général / Direction Financière (DAF)',
    keyPainPoint: 'Paiement instantané des chauffeurs-livreurs 19L sur le terrain via Wave et gestion automatisée des acomptes du 15 du mois.',
    status: 'DEMO_PREVUE',
    personalizedMessage: 'Bonjour Direction BaEauBab Sénégal, nous avons préparé la console souveraine PayLocal Africa configurée spécialement pour votre flotte de livreurs 19L et techniciens fontaines à Dakar. Au plaisir de vous présenter la solution aujourd\'hui à Mermoz !'
  },
  // 1. SÉCURITÉ & GARDIENNAGE À DAKAR (Gros volume Wave & Orange Money)
  {
    id: 'lead-sn-001',
    companyName: 'GAP Sécurité (Dakar)',
    sector: 'SECURITE',
    district: 'Dakar (Almadies / VDN)',
    phone: '+221 77 531 90 18',
    whatsappPhone: '221775319018',
    email: 'commercial@gap-securite.com',
    estimatedEmployees: '80 - 150 vigiles',
    contactPerson: 'Directeur des Opérations / Gérant',
    keyPainPoint: 'Perte de temps sur les transferts Wave et Orange Money manuels à chaque fin de mois.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction GAP Sécurité, je suis le fondateur de PayLocal ici à Dakar. Nous aidons les sociétés de gardiennage sénégalaises à virer tous les salaires et acomptes de leurs vigiles sur Wave et Orange Money en 1 clic sans retraits bancaires risqués, avec bulletins certifiés IPRES/CSS envoyés directement sur WhatsApp. Seriez-vous ouvert à une démo de 10 min cette semaine à vos bureaux ou en visio ?'
  },
  {
    id: 'lead-sn-002',
    companyName: 'A.S.S (Agence Sénégalaise de Sécurité / SOGA)',
    sector: 'SECURITE',
    district: 'Sicap Amitié II, Dakar',
    phone: '+221 77 729 48 48',
    whatsappPhone: '221777294848',
    estimatedEmployees: '60 - 120 agents',
    contactPerson: 'Gérant / Responsable Paie',
    keyPainPoint: 'Gestion lourde des acomptes du 15 du mois et des retenues sur salaires.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction A.S.S Amitié II, vos vigiles demandent souvent des avances le 15 du mois. Avec PayLocal (conçu à Dakar), vous enregistrez l\'acompte et il se déduit automatiquement du virement Wave/Orange Money final en toute conformité IPRES. Puis-je vous montrer notre outil en 5 minutes ?'
  },
  {
    id: 'lead-sn-003',
    companyName: 'Vigilus Groupe (Sécurité Privée)',
    sector: 'SECURITE',
    district: 'VDN Sacré-Cœur 3, Dakar',
    phone: '+221 76 620 60 64',
    whatsappPhone: '221766206064',
    estimatedEmployees: '100 - 250 vigiles',
    contactPerson: 'Directeur Administratif & Financier',
    keyPainPoint: 'Erreurs de réconciliation entre relevé Wave Business et état de paie mensuel.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction Financière Vigilus Groupe, réconcilier vos paiements Wave Business et vos fiches de paie pour des dizaines d\'agents prend des jours. PayLocal connecte les virements et génère directement vos déclarations IPRES, CSS et État 102 en 3 clics. Disponible pour un échange rapide cette semaine à Dakar ?'
  },
  {
    id: 'lead-sn-004',
    companyName: 'SAGAM Sécurité Sénégal',
    sector: 'SECURITE',
    district: 'Dakar Plateau',
    phone: '+221 33 849 20 00',
    whatsappPhone: '221775319018', // Alternative WhatsApp directe
    estimatedEmployees: '200+ agents',
    contactPerson: 'Direction des Ressources Humaines',
    keyPainPoint: 'Volume massif de bulletins de paie papier et gestion des réclamations d\'agents dispersés.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction RH SAGAM Sécurité, distribuer des centaines de bulletins papier aux agents postés dans tout Dakar est complexe. Avec PayLocal, vos agents reçoivent leur fiche certifiée IPRES directement sur WhatsApp dès le virement Wave exécuté. Découvrons la solution en 10 minutes.'
  },

  // 2. CABINETS D'EXPERTISE COMPTABLE DAKAR (Membres ONECCA - Levier x30 PMEs)
  {
    id: 'lead-sn-005',
    companyName: 'AXE Audit & Expertise (ONECCA)',
    sector: 'COMPTABILITE',
    district: 'Sacré-Cœur III, Dakar',
    phone: '+221 77 599 96 65',
    whatsappPhone: '221775999665',
    email: 'axe@axexpertise.com',
    estimatedEmployees: 'Gère ~35 PMEs clientes',
    contactPerson: 'Expert-Comptable Associé',
    keyPainPoint: 'Temps perdu par les collaborateurs sur Excel à recalculer l\'IPRES Cadre/RG, la CSS et le barème IRPP.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Maître / Direction Cabinet AXE Audit Sacré-Cœur, vos collaborateurs passent des heures sur Excel à recalculer l\'IPRES Cadre/RG, la CSS et l\'IRPP pour vos clients PME. Basés à Dakar, nous avons développé PayLocal avec un espace multi-dossiers pour cabinets comptables et paiement Wave/OM en 1 clic. Seriez-vous disponible pour une présentation de 10 min ?'
  },
  {
    id: 'lead-sn-006',
    companyName: 'Cabinet DIENG & Associés / CADG (ONECCA)',
    sector: 'COMPTABILITE',
    district: 'Sicap Dieuppeul 2, Dakar',
    phone: '+221 77 652 08 20',
    whatsappPhone: '221776520820',
    email: 'contact@cadg-compta.com',
    estimatedEmployees: 'Gère ~45 PMEs clientes',
    contactPerson: 'Expert-Comptable & Associé',
    keyPainPoint: 'Édition manuelle de l\'État 102 fiscal et transmission lente des bulletins.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Cabinet Dieng & Associés Dieuppeul, vos clients PME cherchent à moderniser leur paie. PayLocal calcule la paie sénégalaise aux normes 2026, exporte automatiquement l\'État 102 et permet l\'envoi des fiches certifiées par WhatsApp. Découvrons ensemble notre programme Partenaire Cabinet.'
  },
  {
    id: 'lead-sn-007',
    companyName: 'CECA Expertise Comptable (ONECCA)',
    sector: 'COMPTABILITE',
    district: 'Cité Alima VDN, Dakar',
    phone: '+221 76 254 99 99',
    whatsappPhone: '221762549999',
    estimatedEmployees: 'Gère ~30 PMEs clientes',
    contactPerson: 'Responsable Pôle Social',
    keyPainPoint: 'Gestion fastidieuse des cotisations IPM et plafonds CSS / IPRES.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Responsable Social Cabinet CECA VDN, facilitez la paie de vos PMEs clientes au Sénégal. PayLocal applique les plafonds exacts IPRES et CSS et permet aux dirigeants de payer par Wave en 1 clic. Puis-je vous faire une démo de 10 minutes cette semaine ?'
  },
  {
    id: 'lead-sn-008',
    companyName: 'EXTERNALYS Conseil & Audit',
    sector: 'COMPTABILITE',
    district: 'Zone B, Dakar',
    phone: '+221 77 757 39 12',
    whatsappPhone: '221777573912',
    estimatedEmployees: 'Gère ~25 entreprises clientes',
    contactPerson: 'Gérant & Auditeur',
    keyPainPoint: 'Digitalisation des dossiers clients PME et reporting social.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction Externalys Zone B, modernisez la gestion sociale de vos clients dakarois. Avec PayLocal, offrez-leur un tableau de bord moderne et le virement Mobile Money en masse certifié conforme au Code du Travail sénégalais. Échangeons 10 min en visio ou à Dakar !'
  },
  {
    id: 'lead-sn-009',
    companyName: 'ALLIANCES FIDUCIAIRE',
    sector: 'COMPTABILITE',
    district: 'Point E, Dakar',
    phone: '+221 77 679 26 50',
    whatsappPhone: '221776792650',
    estimatedEmployees: 'Gère ~40 clients PME',
    contactPerson: 'Directeur Associé',
    keyPainPoint: 'Retards récurrents des clients pour la transmission des éléments variables de paie.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Cabinet Alliances Fiduciaire Point E, la clôture mensuelle de la paie de vos PMEs clientes est souvent ralentie par les acomptes et primes. PayLocal automatise tout cela et génère les états fiscaux sénégalais en 3 clics. Démo rapide de 10 min possible cette semaine ?'
  },

  // 3. BTP, NETTOYAGE & SERVICES DAKAR
  {
    id: 'lead-sn-010',
    companyName: 'Sénégal Nettoyage & Multiservices',
    sector: 'BTP_NETTOYAGE',
    district: 'Yoff / Ouest Foire, Dakar',
    phone: '+221 77 638 90 12',
    whatsappPhone: '221776389012',
    estimatedEmployees: '35 - 75 agents de surface',
    contactPerson: 'Responsable d\'Exploitation',
    keyPainPoint: 'Paiement dispersé sur Wave et Orange Money avec personnel non bancarisé.',
    status: 'A_CONTACTER',
    personalizedMessage: 'Bonjour Direction Sénégal Nettoyage, payer des dizaines d\'agents de nettoyage dispersés sur Wave et Orange Money chaque mois prend un temps fou. Avec PayLocal, vous validez votre bordereau et tous vos agents sont crédités instantanément. Test gratuit sans engagement sur votre prochaine paie ?'
  }
];
