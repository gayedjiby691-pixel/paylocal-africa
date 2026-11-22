import React, { useState } from 'react';
import { initialLeadsCI, ProspectCI } from '../data/mockLeadsCI';
import { initialLeadsSN, ProspectSN } from '../data/mockLeadsSN';
import { initialLeadsCM, ProspectCM } from '../data/mockLeadsCM';
import { initialLeadsBJ, ProspectBJ } from '../data/mockLeadsBJ';
import { X, MessageSquare, Download, Phone, MapPin, Users, Briefcase, ShieldCheck } from 'lucide-react';
import { CountryCode } from '../engine/types';

type Prospect = ProspectCI | ProspectSN | ProspectCM | ProspectBJ;

interface LeadPipelineModalProps {
  onClose: () => void;
  userCountry: CountryCode;
}

export const LeadPipelineModal: React.FC<LeadPipelineModalProps> = ({ onClose, userCountry }) => {
  // Confinement strict souverain : l'utilisateur ne charge et ne voit QUE les données de son propre pays
  const getInitialLeads = (c: CountryCode): Prospect[] => {
    switch (c) {
      case 'SN': return initialLeadsSN;
      case 'CI': return initialLeadsCI;
      case 'CM': return initialLeadsCM;
      case 'BJ': return initialLeadsBJ;
      default: return initialLeadsSN;
    }
  };

  const getCountryMeta = (c: CountryCode) => {
    switch (c) {
      case 'SN': return { flag: '🇸🇳', name: 'Sénégal (Dakar)', tag: 'Dakar_Senegal' };
      case 'CI': return { flag: '🇨🇮', name: 'Côte d\'Ivoire (Abidjan)', tag: 'Abidjan_Cote_d_Ivoire' };
      case 'CM': return { flag: '🇨🇲', name: 'Cameroun (Douala)', tag: 'Douala_Cameroun' };
      case 'BJ': return { flag: '🇧🇯', name: 'Bénin (Cotonou)', tag: 'Cotonou_Benin' };
    }
  };

  const countryMeta = getCountryMeta(userCountry);
  const [leads, setLeads] = useState<Prospect[]>(getInitialLeads(userCountry));
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    if (selectedSector === 'ALL') return true;
    return lead.sector === selectedSector;
  });

  const handleUpdateStatus = (id: string, newStatus: Prospect['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
  };

  const handleOpenWhatsApp = (lead: Prospect) => {
    const encodedText = encodeURIComponent(lead.personalizedMessage);
    const url = `https://wa.me/${lead.whatsappPhone}?text=${encodedText}`;
    window.open(url, '_blank');
    handleUpdateStatus(lead.id, 'MESSAGE_ENVOYE');
  };

  const handleCopyMessage = (id: string, message: string) => {
    navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCSV = () => {
    const territoryLabel = countryMeta.tag;
    let csv = 'ID,Entreprise,Secteur,Quartier,Telephone,Effectif,Interlocuteur,Statut,Message\n';
    leads.forEach((l) => {
      csv += `${l.id},"${l.companyName}",${l.sector},"${l.district}",${l.phone},"${l.estimatedEmployees}","${l.contactPerson}",${l.status},"${l.personalizedMessage.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prospects_Qualifies_${territoryLabel}_PayLocal.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // KPIs pour le territoire souverain
  const totalLeads = leads.length;
  const contacted = leads.filter((l) => l.status === 'MESSAGE_ENVOYE').length;
  const demos = leads.filter((l) => l.status === 'DEMO_PREVUE').length;
  const signed = leads.filter((l) => l.status === 'CLIENT_SIGNE').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Isolé Souverain (Strictement confiné au pays connecté) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center shadow-md shadow-emerald-500/20 text-sm">
              {countryMeta.flag}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Pipeline de Prospection Locale • Territoire {countryMeta.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {totalLeads} Entreprises Qualifiées
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Isolation RLS active : données et prospects strictement confinés à ce pays
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Confinement Territorial RLS</span>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
              title="Exporter vers Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export Excel</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pipeline KPIs & Secteurs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          
          {/* KPIs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Cibles Territoriales :</span>
              <strong className="text-slate-900 font-bold text-sm font-mono">{totalLeads}</strong>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 flex items-center justify-between">
              <span className="font-semibold">Messages Envoyés :</span>
              <strong className="font-bold text-sm font-mono">{contacted}</strong>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between">
              <span className="font-semibold">Démos Planifiées :</span>
              <strong className="font-bold text-sm font-mono">{demos}</strong>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <span className="font-semibold">Clients Signés :</span>
              <strong className="font-bold text-sm font-mono">{signed}</strong>
            </div>
          </div>

          {/* Filtres Secteurs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider mr-1">Filtrer par secteur :</span>
            <button
              onClick={() => setSelectedSector('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedSector === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tous ({leads.length})
            </button>
            <button
              onClick={() => setSelectedSector('SECURITE')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedSector === 'SECURITE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🛡️ Sécurité & Gardiennage ({leads.filter((l) => l.sector === 'SECURITE').length})
            </button>
            <button
              onClick={() => setSelectedSector('COMPTABILITE')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedSector === 'COMPTABILITE'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              📊 Cabinets Comptables ({leads.filter((l) => l.sector === 'COMPTABILITE').length})
            </button>
            <button
              onClick={() => setSelectedSector('BTP_NETTOYAGE')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedSector === 'BTP_NETTOYAGE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              🏗️ BTP & Services ({leads.filter((l) => l.sector === 'BTP_NETTOYAGE').length})
            </button>
          </div>

        </div>

        {/* Lead Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredLeads.map((lead) => {
            const getSectorBadge = (sec: string) => {
              switch (sec) {
                case 'SECURITE':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Sécurité & Gardiennage</span>;
                case 'COMPTABILITE':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Cabinet Comptable</span>;
                case 'BTP_NETTOYAGE':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">BTP & Services</span>;
              }
            };

            const getStatusBadge = (st: Prospect['status']) => {
              switch (st) {
                case 'A_CONTACTER':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">À contacter</span>;
                case 'MESSAGE_ENVOYE':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Message WhatsApp Envoyé</span>;
                case 'DEMO_PREVUE':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Démo Planifiée</span>;
                case 'CLIENT_SIGNE':
                  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Client Pilote Signé 🎉</span>;
              }
            };

            return (
              <div
                key={lead.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all space-y-3"
              >
                
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-extrabold text-slate-900">{lead.companyName}</h4>
                      {getSectorBadge(lead.sector)}
                      {getStatusBadge(lead.status)}
                    </div>
                    
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.district}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono font-medium">{lead.phone}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.estimatedEmployees}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-700 font-semibold">{lead.contactPerson}</span>
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'Action Rapide */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenWhatsApp(lead)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                      title="Ouvrir la conversation WhatsApp avec le message pré-rempli"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Contacter sur WhatsApp</span>
                    </button>

                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as Prospect['status'])}
                      className="px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="A_CONTACTER">Statut: À contacter</option>
                      <option value="MESSAGE_ENVOYE">Statut: Message envoyé</option>
                      <option value="DEMO_PREVUE">Statut: Démo planifiée</option>
                      <option value="CLIENT_SIGNE">Statut: Client signé</option>
                    </select>
                  </div>
                </div>

                {/* Message Personnalisé & Pain Point */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Message d'accroche personnalisé (Prêt à l'envoi) :
                    </span>
                    <button
                      onClick={() => handleCopyMessage(lead.id, lead.personalizedMessage)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold text-[11px] transition-colors"
                    >
                      {copiedId === lead.id ? '✓ Copié !' : 'Copier texte'}
                    </button>
                  </div>
                  <p className="text-slate-600 italic font-normal bg-white p-2.5 rounded-lg border border-slate-200">
                    "{lead.personalizedMessage}"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong>Douleur clé ciblée :</strong> {lead.keyPainPoint}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0 text-xs text-slate-500">
          <span>💡 Cliquez sur <strong>"Contacter sur WhatsApp"</strong> pour ouvrir directement WhatsApp avec le message pré-rempli.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Fermer le Pipeline
          </button>
        </div>

      </div>
    </div>
  );
};
