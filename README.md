# 🌍 PayLocal Africa — SaaS Paie & Payout Mobile Money (OHADA / UEMOA)

**PayLocal** est une solution SaaS B2B conçue pour automatiser la paie des PMEs africaines et débourser instantanément les salaires via **Wave** et **Orange Money**.

---

## 🚀 Démarrage Rapide (En Local)

Pour lancer le serveur de développement interactif :

```bash
# Lancement de l'application
npm run dev
```

L'application s'ouvre directement sur `http://localhost:3000`.

Pour tester le build de production :
```bash
npm run build
npm run preview
```

---

## 📁 Structure du Projet

```
├── database/
│   └── schema.sql                  # Schéma PostgreSQL complet multi-tenant (Supabase / Neon)
├── docs/
│   └── COMMERCIAL_KIT.md           # Guide d'acquisition, scripts WhatsApp & objection handling
├── src/
│   ├── components/                 # Composants UI React
│   │   ├── Header.tsx              # Navbar avec sélecteur Sénégal / Côte d'Ivoire & actions
│   │   ├── StatsCards.tsx          # KPIs financiers (Brut, Net, Impôts, Acomptes)
│   │   ├── EmployeeTable.tsx       # Tableau interactif des calculs de paie
│   │   ├── PayslipViewerModal.tsx  # Fiche de paie officielle avec export & WhatsApp
│   │   ├── SalaryAdvanceModal.tsx  # Gestion des acomptes (le 15 du mois)
│   │   ├── BulkPayoutModal.tsx     # Simulation de déboursement groupé Mobile Money
│   │   ├── EmployeeModal.tsx       # Formulaire d'ajout de salarié
│   │   └── TaxDeclarationExportModal.tsx # Export État 102 (SN) & DISA (CI)
│   ├── engine/                     # Moteur de règles fiscales & sociales
│   │   ├── types.ts                # Types TypeScript stricts
│   │   └── payrollCalculator.ts    # Calculs IPRES, CSS, CNPS, CMU, IRPP, IS, parts
│   ├── data/
│   │   └── mockEmployees.ts        # Données de démonstration réalistes
│   ├── App.tsx                     # Application principale
│   └── main.tsx                    # Point d'entrée React
├── index.html                      # Layout avec Tailwind CSS
├── package.json                    # Dépendances & scripts
└── vite.config.ts                  # Configuration Vite
```

---

## ⚡ Fonctionnalités Clés Implémentées

1. **Moteur Fiscal & Social Local :**
   * **Sénégal :** IPRES Régime Général (5.6% / 8.4%), IPRES Cadre, CSS (Prestations & Accident), IPM, CFCE (3%), Barème progressif IRPP avec quotient familial (parts fiscales).
   * **Côte d'Ivoire :** CNPS Retraite (6.3% / 7.7%), Prestations familiales, CMU, FDFP, IS (1.5%), Contribution Nationale (CN) et IGR.
2. **Gestion des Acomptes ("Le 15 du mois") :**
   * Enregistrement de l'avance demandée par le salarié avec virement direct.
   * Déduction automatique sur le salaire net à la fin du mois.
3. **Déboursement Mobile Money Groupé (Bulk Payout) :**
   * Répartition automatique Wave vs Orange Money.
   * Validation sécurisée Maker-Checker (simulation OTP).
   * Horodatage et références de lots.
4. **Distribution WhatsApp & Impression PDF :**
   * Bulletin de paie certifié et formaté aux normes légales.
   * Envoi du PDF en 1 clic sur WhatsApp.
5. **Exports Fiscaux Officiels :**
   * Génération de l'État légal mensuel pour la DGI et les organismes sociaux (export CSV/Excel).

---

## 📞 Support & Déploiement

Conçu pour être hébergé sur **Vercel** ou **Netlify**, avec une base de données **Supabase** (PostgreSQL) et les APIs **Wave Business Payout** / **Moneroo** / **Paystack**.
