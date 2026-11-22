import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Users, 
  CheckCircle2, 
  SendHorizontal, 
  MessageSquare,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface RequestDemoModalProps {
  onClose: () => void;
}

export const RequestDemoModal: React.FC<RequestDemoModalProps> = ({ onClose }) => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('DAF / Responsable Financier');
  const [companyName, setCompanyName] = useState('');
  const [countryCity, setCountryCity] = useState('Dakar (Sénégal)');
  const [phone, setPhone] = useState('');
  const [employeeRange, setEmployeeRange] = useState('20 à 50 salariés');
  const [currentPayoutMethod, setCurrentPayoutMethod] = useState('Espèces & Cash en caisse');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Sauvegarde de la demande en session locale pour consultation par le fondateur
    try {
      const existingLeads = JSON.parse(localStorage.getItem('paylocal_inbound_leads') || '[]');
      existingLeads.unshift({
        id: `LEAD-${Date.now()}`,
        fullName,
        role,
        companyName,
        countryCity,
        phone,
        employeeRange,
        currentPayoutMethod,
        date: new Date().toISOString(),
      });
      localStorage.setItem('paylocal_inbound_leads', JSON.stringify(existingLeads));
    } catch {
      // Ignore if localStorage unavailable
    }
  };

  const getWhatsAppDirectLink = () => {
    const text = `Bonjour PayLocal Africa,\n\nJe souhaite planifier une démonstration et tester le pilote gratuit pour notre entreprise :\n• Société : ${companyName}\n• Ville : ${countryCity}\n• Effectif : ${employeeRange}\n• Contact : ${fullName} (${role})\n• Tél : ${phone}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Demander un Accès Pilote Gratuit
              </h2>
              <p className="text-xs text-slate-300">
                Sans engagement • Testez sur 5 à 10 salariés sur votre prochain cycle de paie
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            /* Confirmation & Action WhatsApp */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Demande enregistrée avec succès !</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Merci <strong>{fullName}</strong>. Un spécialiste paie de la direction PayLocal va vous contacter sous <strong>2h ouvrées</strong> pour configurer votre espace de démonstration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="text-slate-500">Récapitulatif de votre demande :</div>
                <div className="font-bold text-slate-800">• Entreprise : {companyName} ({countryCity})</div>
                <div className="font-bold text-slate-800">• Effectif : {employeeRange}</div>
                <div className="font-bold text-slate-800">• Décideur : {fullName} - {role}</div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <a
                  href={getWhatsAppDirectLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirmer sur WhatsApp (Prioritaire)</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          ) : (
            /* Formulaire de qualification B2B */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nom du Décideur */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Votre Nom & Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Moussa Sow"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Fonction */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Votre Fonction *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-800"
                    >
                      <option>DAF / Responsable Financier</option>
                      <option>Directeur Général / Gérant</option>
                      <option>Directeur des Ressources Humaines</option>
                      <option>Expert-Comptable / Fiduciaire</option>
                      <option>Autre décideur</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Société */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom de votre Entreprise *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Société Agro-Industrielle"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Ville / Région */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville & Région d'Implantation *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Thiès, Saint-Louis, Dakar, Abidjan..."
                      value={countryCity}
                      onChange={(e) => setCountryCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Numéro WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone WhatsApp Professionnel *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+221 77 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Nombre de salariés */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Effectif de Salariés *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={employeeRange}
                      onChange={(e) => setEmployeeRange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-800"
                    >
                      <option>Moins de 15 salariés</option>
                      <option>15 à 50 salariés</option>
                      <option>50 à 150 salariés</option>
                      <option>150 à 500 salariés</option>
                      <option>Plus de 500 salariés</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mode de déboursement actuel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comment payez-vous vos salariés aujourd'hui ?
                </label>
                <select
                  value={currentPayoutMethod}
                  onChange={(e) => setCurrentPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-slate-800"
                >
                  <option>Espèces / Retraits physiques à la banque (Cash)</option>
                  <option>Chèques bancaires individuels</option>
                  <option>Virements bancaires (lents pour les ouvriers)</option>
                  <option>Wave / Orange Money fait manuellement numéro par numéro</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Vos informations restent strictement confidentielles et ne sont jamais partagées à des tiers.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Envoyer ma demande d'accès pilote</span>
                <SendHorizontal className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
