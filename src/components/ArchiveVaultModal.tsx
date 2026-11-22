import React, { useState } from 'react';
import { 
  X, 
  FolderArchive, 
  Download, 
  Search, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Landmark, 
  Receipt, 
  Lock, 
  Printer,
  Eye,
  Filter,
  FileCheck
} from 'lucide-react';
import { CountryCode } from '../engine/types';

export interface ArchivedPeriod {
  id: string;
  periodLabel: string;
  year: number;
  month: string;
  country: CountryCode;
  closingDate: string;
  closedBy: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetDisbursed: number;
  totalTaxesDGID: number;
  totalSocialIPRES_CSS: number;
  payoutProvider: string;
  sha256Seal: string;
  documents: {
    name: string;
    type: 'LIVRE_PAIE' | 'ETAT_102' | 'RECU_PAYOUT' | 'BULLETINS_ZIP';
    size: string;
  }[];
}

interface ArchiveVaultModalProps {
  country: CountryCode;
  onClose: () => void;
  onPreviewPayslip?: (matricule: string) => void;
}

export const ArchiveVaultModal: React.FC<ArchiveVaultModalProps> = ({ country, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedArchive, setSelectedArchive] = useState<ArchivedPeriod | null>(null);

  const formatMoney = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  // Base d'archives légales conformes OHADA / DGID / IPRES
  const mockArchives: ArchivedPeriod[] = [
    {
      id: 'ARCH-2026-04-SN',
      periodLabel: 'Avril 2026',
      year: 2026,
      month: 'Avril',
      country: 'SN',
      closingDate: '30 Avril 2026 à 18:42:10',
      closedBy: 'Amadou Sall (Direction Générale)',
      totalEmployees: 12,
      totalGrossSalary: 4850000,
      totalNetDisbursed: 4125000,
      totalTaxesDGID: 415000,
      totalSocialIPRES_CSS: 712000,
      payoutProvider: 'Wave Business & Orange Money',
      sha256Seal: '9b2a6f7e4c1d8a3e9f2c5d1a8e7f4c2b9a1d3f5e7c9a2b4d6f8e0a1c3b5d7e9f',
      documents: [
        { name: 'Livre_de_Paie_Officiel_Avril_2026.pdf', type: 'LIVRE_PAIE', size: '1.4 Mo' },
        { name: 'Etat_102_DGID_Avril_2026.csv', type: 'ETAT_102', size: '280 Ko' },
        { name: 'Bordereau_Virements_Wave_OM_Recus.pdf', type: 'RECU_PAYOUT', size: '890 Ko' },
        { name: 'Pack_12_Bulletins_Scelles_Avril_2026.zip', type: 'BULLETINS_ZIP', size: '4.2 Mo' },
      ],
    },
    {
      id: 'ARCH-2026-03-SN',
      periodLabel: 'Mars 2026',
      year: 2026,
      month: 'Mars',
      country: 'SN',
      closingDate: '31 Mars 2026 à 17:15:00',
      closedBy: 'Amadou Sall (Direction Générale)',
      totalEmployees: 12,
      totalGrossSalary: 4850000,
      totalNetDisbursed: 4140000,
      totalTaxesDGID: 415000,
      totalSocialIPRES_CSS: 712000,
      payoutProvider: 'Wave Business',
      sha256Seal: '4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      documents: [
        { name: 'Livre_de_Paie_Officiel_Mars_2026.pdf', type: 'LIVRE_PAIE', size: '1.4 Mo' },
        { name: 'Etat_102_DGID_Mars_2026.csv', type: 'ETAT_102', size: '280 Ko' },
        { name: 'Bordereau_Virements_Wave_Recus.pdf', type: 'RECU_PAYOUT', size: '740 Ko' },
        { name: 'Pack_12_Bulletins_Scelles_Mars_2026.zip', type: 'BULLETINS_ZIP', size: '4.1 Mo' },
      ],
    },
    {
      id: 'ARCH-2026-02-SN',
      periodLabel: 'Février 2026',
      year: 2026,
      month: 'Février',
      country: 'SN',
      closingDate: '28 Février 2026 à 18:00:22',
      closedBy: 'Amadou Sall (Direction Générale)',
      totalEmployees: 11,
      totalGrossSalary: 4500000,
      totalNetDisbursed: 3850000,
      totalTaxesDGID: 390000,
      totalSocialIPRES_CSS: 660000,
      payoutProvider: 'Wave Business',
      sha256Seal: '7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e',
      documents: [
        { name: 'Livre_de_Paie_Officiel_Fevrier_2026.pdf', type: 'LIVRE_PAIE', size: '1.3 Mo' },
        { name: 'Etat_102_DGID_Fevrier_2026.csv', type: 'ETAT_102', size: '260 Ko' },
        { name: 'Bordereau_Virements_Wave_Recus.pdf', type: 'RECU_PAYOUT', size: '710 Ko' },
        { name: 'Pack_11_Bulletins_Scelles_Fevrier_2026.zip', type: 'BULLETINS_ZIP', size: '3.9 Mo' },
      ],
    },
    {
      id: 'ARCH-2026-01-SN',
      periodLabel: 'Janvier 2026',
      year: 2026,
      month: 'Janvier',
      country: 'SN',
      closingDate: '31 Janvier 2026 à 19:10:45',
      closedBy: 'Amadou Sall (Direction Générale)',
      totalEmployees: 11,
      totalGrossSalary: 4500000,
      totalNetDisbursed: 3865000,
      totalTaxesDGID: 390000,
      totalSocialIPRES_CSS: 660000,
      payoutProvider: 'Wave Business & Orange Money',
      sha256Seal: '3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c',
      documents: [
        { name: 'Livre_de_Paie_Officiel_Janvier_2026.pdf', type: 'LIVRE_PAIE', size: '1.3 Mo' },
        { name: 'Etat_102_DGID_Janvier_2026.csv', type: 'ETAT_102', size: '260 Ko' },
        { name: 'Bordereau_Virements_Wave_Recus.pdf', type: 'RECU_PAYOUT', size: '720 Ko' },
        { name: 'Pack_11_Bulletins_Scelles_Janvier_2026.zip', type: 'BULLETINS_ZIP', size: '3.9 Mo' },
      ],
    },
    {
      id: 'ARCH-2025-YEAR-SN',
      periodLabel: 'Clôture Annuelle 2025 & Bilan DGID',
      year: 2025,
      month: 'Annuel',
      country: 'SN',
      closingDate: '31 Décembre 2025 à 23:59:59',
      closedBy: 'Cabinet Fiduciaire Agréé',
      totalEmployees: 11,
      totalGrossSalary: 52400000,
      totalNetDisbursed: 44800000,
      totalTaxesDGID: 4680000,
      totalSocialIPRES_CSS: 7710000,
      payoutProvider: 'Wave & Orange Money',
      sha256Seal: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      documents: [
        { name: 'Etat_102_Annuel_DGID_2025_Certifie.csv', type: 'ETAT_102', size: '1.8 Mo' },
        { name: 'Grand_Livre_de_Paie_Exercice_2025.pdf', type: 'LIVRE_PAIE', size: '6.5 Mo' },
        { name: 'Bordereau_Recapitulatif_Annuel_IPRES_CSS_2025.pdf', type: 'RECU_PAYOUT', size: '2.1 Mo' },
      ],
    },

    // 🇨🇮 CÔTE D'IVOIRE
    {
      id: 'ARCH-2026-04-CI',
      periodLabel: 'Avril 2026',
      year: 2026,
      month: 'Avril',
      country: 'CI',
      closingDate: '30 Avril 2026 à 18:30:15',
      closedBy: 'Marie-Pascale Bamba (Direction Financière)',
      totalEmployees: 8,
      totalGrossSalary: 3800000,
      totalNetDisbursed: 3150000,
      totalTaxesDGID: 310000,
      totalSocialIPRES_CSS: 490000,
      payoutProvider: 'Wave & Orange Money CI',
      sha256Seal: '8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e',
      documents: [
        { name: 'Bordereau_CNPS_CMU_Avril_2026.pdf', type: 'RECU_PAYOUT', size: '1.2 Mo' },
        { name: 'Livre_de_Paie_Officiel_CI_Avril_2026.pdf', type: 'LIVRE_PAIE', size: '1.5 Mo' },
        { name: 'Declaration_DGI_IS_CN_IGR_Avril_2026.csv', type: 'ETAT_102', size: '310 Ko' },
        { name: 'Pack_8_Bulletins_Scelles_Abidjan_2026.zip', type: 'BULLETINS_ZIP', size: '3.1 Mo' },
      ],
    },

    // 🇨🇲 CAMEROUN (CEMAC)
    {
      id: 'ARCH-2026-04-CM',
      periodLabel: 'Avril 2026',
      year: 2026,
      month: 'Avril',
      country: 'CM',
      closingDate: '30 Avril 2026 à 17:45:00',
      closedBy: 'Samuel Eto\'o Ndong (Direction Générale)',
      totalEmployees: 6,
      totalGrossSalary: 2950000,
      totalNetDisbursed: 2480000,
      totalTaxesDGID: 240000,
      totalSocialIPRES_CSS: 310000,
      payoutProvider: 'MTN Mobile Money & Orange Money',
      sha256Seal: '5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
      documents: [
        { name: 'DIPE_Officiel_DGI_Cameroun_Avril_2026.csv', type: 'ETAT_102', size: '290 Ko' },
        { name: 'Bordereau_CNPS_CFC_FNE_Cameroun_2026.pdf', type: 'RECU_PAYOUT', size: '1.1 Mo' },
        { name: 'Grand_Livre_de_Paie_Douala_Avril_2026.pdf', type: 'LIVRE_PAIE', size: '1.3 Mo' },
        { name: 'Pack_6_Bulletins_Scelles_Cameroun_2026.zip', type: 'BULLETINS_ZIP', size: '2.8 Mo' },
      ],
    },

    // 🇧🇯 BÉNIN (UEMOA)
    {
      id: 'ARCH-2026-04-BJ',
      periodLabel: 'Avril 2026',
      year: 2026,
      month: 'Avril',
      country: 'BJ',
      closingDate: '30 Avril 2026 à 18:10:00',
      closedBy: 'Cabinet Comptable Agréé Cotonou',
      totalEmployees: 5,
      totalGrossSalary: 1850000,
      totalNetDisbursed: 1580000,
      totalTaxesDGID: 140000,
      totalSocialIPRES_CSS: 230000,
      payoutProvider: 'MTN MoMo & Moov Money Bénin',
      sha256Seal: '2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b',
      documents: [
        { name: 'Bordereau_Unique_CNSS_Benin_Avril_2026.pdf', type: 'RECU_PAYOUT', size: '980 Ko' },
        { name: 'Declaration_IPTS_VPS_DGI_Benin_2026.csv', type: 'ETAT_102', size: '220 Ko' },
        { name: 'Livre_de_Paie_Officiel_Cotonou_Avril_2026.pdf', type: 'LIVRE_PAIE', size: '1.1 Mo' },
        { name: 'Pack_5_Bulletins_Scelles_Benin_2026.zip', type: 'BULLETINS_ZIP', size: '2.2 Mo' },
      ],
    },
  ];

  const filteredArchives = mockArchives.filter((a) => {
    const matchesCountry = a.country === country;
    const matchesYear = a.year === selectedYear;
    const matchesSearch = 
      a.periodLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.closingDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.closedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesYear && matchesSearch;
  });

  const handleDownloadDoc = (docName: string) => {
    // Simulation téléchargement légal
    const dummyContent = `CONSERVATOIRE D'ARCHIVES LEGALES PAYLOCAL\nDocument: ${docName}\nCertifie conforme OHADA / DGID Senegal\nHorodatage certifie TLS 1.3\nDate d'exportation: ${new Date().toISOString()}`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* ========================================================================= */}
        {/* HEADER MODAL : SOUVERAINETÉ & CONFORMITÉ OHADA                          */}
        {/* ========================================================================= */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <FolderArchive className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Coffre-Fort & Archives Légales de Paie
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OHADA • Rétention 10 ans
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {country === 'SN' 
                  ? 'Historique certifié des paies, états 102 (DGID), bordereaux IPRES/CSS et déboursements Wave.'
                  : country === 'CI'
                  ? 'Historique certifié des paies, bordereaux DGI, cotisations CNPS/CMU et déboursements Wave/OM.'
                  : country === 'CM'
                  ? 'Historique certifié des paies, DIPE fiscal, cotisations CNPS/CFC et déboursements MTN MoMo.'
                  : 'Historique certifié des paies, bordereaux DGI, cotisations CNSS/VPS et déboursements MoMo.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* BARRE D'OUTILS : RECHERCHE & SÉLECTION D'EXERCICE                        */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exercice :</span>
            {[2026, 2025].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedYear === year
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher une période ou scellé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CORPS : LISTE DES PÉRIODES ARCHIVÉES & VUE DÉTAILLÉE                      */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {filteredArchives.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FolderArchive className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-500">Aucune archive trouvée pour cet exercice fiscal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredArchives.map((archive) => (
                <div
                  key={archive.id}
                  className="rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 hover:shadow-md transition-all p-5 space-y-4"
                >
                  
                  {/* Ligne 1 : Titre Période & Statut Scellé */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                            {archive.periodLabel}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                            Clôturé & Scellé
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Scellé légal le {archive.closingDate} par <strong className="text-slate-700">{archive.closedBy}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-right">
                      <div className="hidden sm:block">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Net Déboursé</span>
                        <span className="text-sm font-black font-mono text-emerald-600">
                          {formatMoney(archive.totalNetDisbursed)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ligne 2 : Métriques Clés de la Paie */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Effectif Salariés</span>
                      <strong className="text-slate-800 font-mono text-xs">{archive.totalEmployees} salariés</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Masse Salariale Brute</span>
                      <strong className="text-slate-800 font-mono text-xs">{formatMoney(archive.totalGrossSalary)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {country === 'SN' ? 'Retenue DGID (IRPP)' : country === 'CI' ? 'Impôts DGI (IS/CN/IGR)' : country === 'CM' ? 'Retenue DGI (IRPP/CAC)' : 'Retenue DGI (IPTS)'}
                      </span>
                      <strong className="text-amber-700 font-mono text-xs">{formatMoney(archive.totalTaxesDGID)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        {country === 'SN' ? 'Charges IPRES & CSS' : country === 'CI' ? 'Charges CNPS & CMU' : country === 'CM' ? 'Charges CNPS & CFC' : 'Charges CNSS & VPS'}
                      </span>
                      <strong className="text-blue-700 font-mono text-xs">{formatMoney(archive.totalSocialIPRES_CSS)}</strong>
                    </div>
                  </div>

                  {/* Ligne 3 : Documents Légaux Disponibles au Téléchargement */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Documents & Justificatifs Réglementaires Téléchargeables :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {archive.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 transition-colors text-xs"
                        >
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold text-slate-800 truncate block text-[11px]">
                                {doc.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownloadDoc(doc.name)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors shrink-0 ml-2"
                            title={`Télécharger ${doc.name}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ligne 4 : Empreinte Cryptographique SHA-256 */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center space-x-1 truncate max-w-md">
                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">Scellé SHA-256 : {archive.sha256Seal}</span>
                    </div>
                    <span className="text-emerald-600 font-bold shrink-0">Inaltérable</span>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* FOOTER : RÈGLEMENTATION ET SOUVERAINETÉ                                   */}
        {/* ========================================================================= */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Conformité <strong>Code du Travail Sénégalais (Art. L.114)</strong> & Référentiel OHADA : Conservation obligatoire 10 ans.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all"
          >
            Fermer le Coffre-Fort
          </button>
        </div>

      </div>
    </div>
  );
};
