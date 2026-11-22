import React, { useState } from 'react';
import { CountryCode, EnterpriseBranding, BrandColorTheme } from '../engine/types';
import { InputSanitizer } from '../security/sanitizer';
import { 
  X, 
  Palette, 
  Building2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Stamp, 
  Smartphone, 
  FileText, 
  RotateCcw,
  Sliders,
  Award
} from 'lucide-react';

interface EnterpriseBrandingModalProps {
  country: CountryCode;
  currentBranding: EnterpriseBranding;
  onSave: (branding: EnterpriseBranding) => void;
  onClose: () => void;
}

export const EnterpriseBrandingModal: React.FC<EnterpriseBrandingModalProps> = ({
  country,
  currentBranding,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState<EnterpriseBranding>({ ...currentBranding });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const colorThemes: { id: BrandColorTheme; name: string; bgClass: string; borderClass: string; textClass: string; hex: string }[] = [
    { id: 'EMERALD', name: 'Émeraude FinTech', bgClass: 'from-emerald-600 to-teal-500', borderClass: 'border-emerald-500', textClass: 'text-emerald-500', hex: '#10b981' },
    { id: 'BLUE', name: 'Bleu Corporate & Banque', bgClass: 'from-blue-600 to-indigo-500', borderClass: 'border-blue-500', textClass: 'text-blue-500', hex: '#3b82f6' },
    { id: 'AMBER', name: 'Ambre & Or Prestige', bgClass: 'from-amber-500 to-orange-500', borderClass: 'border-amber-500', textClass: 'text-amber-500', hex: '#f59e0b' },
    { id: 'PURPLE', name: 'Pourpre & Tech Moderne', bgClass: 'from-purple-600 to-pink-500', borderClass: 'border-purple-500', textClass: 'text-purple-500', hex: '#8b5cf6' },
    { id: 'ROSE', name: 'Corail & Énergie', bgClass: 'from-rose-600 to-red-500', borderClass: 'border-rose-500', textClass: 'text-rose-500', hex: '#f43f5e' },
  ];

  const activeTheme = colorThemes.find((t) => t.id === form.brandColor) || colorThemes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedBranding: EnterpriseBranding = {
      ...form,
      companyName: InputSanitizer.cleanText(form.companyName, 100),
      tagline: InputSanitizer.cleanText(form.tagline, 150),
      legalId: InputSanitizer.cleanText(form.legalId, 50),
      headquarters: InputSanitizer.cleanText(form.headquarters, 150),
      phone: InputSanitizer.cleanPhone(form.phone),
      logoInitial: InputSanitizer.cleanText(form.logoInitial, 4).toUpperCase() || 'P',
      smsSenderName: InputSanitizer.cleanSmsSender(form.smsSenderName),
      customStampTitle: InputSanitizer.cleanText(form.customStampTitle, 80),
    };
    onSave(sanitizedBranding);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${activeTheme.bgClass} text-white flex items-center justify-center shadow-md font-black text-lg`}>
              {form.logoInitial || 'P'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Personnalisation de Marque • La « Touche » Sur-Mesure
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Marque Entreprise
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personnalisez les bulletins officiels, le cachet certifié et les alertes SMS Mobile Money à l'image de votre société.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Section 1 : Palette & Touche Visuelle */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-slate-700" />
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                1. Palette de Couleurs & Identité Visuelle
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, brandColor: theme.id }))}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    form.brandColor === theme.id
                      ? `${theme.borderClass} bg-slate-50 ring-2 ring-offset-1 ring-slate-400 shadow-sm`
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-xl bg-gradient-to-tr ${theme.bgClass} shadow-sm mb-2`} />
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 leading-tight">{theme.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2 : Raison Sociale & Données Officielles */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                2. Informations Officielles de l'Entreprise
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Nom Officiel de l'Entreprise (Raison Sociale)
                </label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="ex: Dakar Protection Sécurité Privée SARL"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Initiale ou Monogramme de Logo
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={form.logoInitial}
                  onChange={(e) => setForm({ ...form, logoInitial: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all uppercase"
                  placeholder="ex: D ou DP"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Activité Principale ou Slogan de l'Entreprise
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="ex: Gardiennage, Télésurveillance & Sécurité Privée"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Identifiants Légaux & Fiscaux (NINEA / RCCM / NIU / IFU)
                </label>
                <input
                  type="text"
                  value={form.legalId}
                  onChange={(e) => setForm({ ...form, legalId: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="ex: NINEA : 008459123 • RCCM : SN-DKR-2023-B-8910"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Téléphone Officiel du Siège
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="ex: +221 33 820 15 20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Adresse du Siège Social
                </label>
                <input
                  type="text"
                  value={form.headquarters}
                  onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="ex: Almadies, Route de la Corniche Ouest, Dakar (Sénégal)"
                />
              </div>
            </div>
          </div>

          {/* Section 3 : Cachet Officiel & Expéditeur SMS Mobile Money */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <Stamp className="w-4 h-4 text-slate-700" />
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                3. Cachet Numérique Certifié & Alertes SMS Mobile Money
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Titre du Signataire Officiel sur les Bulletins
                </label>
                <input
                  type="text"
                  value={form.customStampTitle}
                  onChange={(e) => setForm({ ...form, customStampTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="ex: Direction Générale (Dakar)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Nom d'Expéditeur SMS Wave / Orange Money (Max 11 car.)
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={form.smsSenderName}
                  onChange={(e) => setForm({ ...form, smsSenderName: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all uppercase"
                  placeholder="ex: DAKAR_SECU"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Nom qui apparaît dans l'alerte SMS reçue par le salarié.
                </span>
              </div>
            </div>

            {/* Aperçu du Cachet en Direct */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Aperçu du Cachet Électronique :</span>
                <p className="text-xs font-semibold text-slate-700">
                  Apposé automatiquement sur chaque bulletin et export officiel télé-déclaré.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border-2 border-dashed border-emerald-600/70 bg-emerald-50/50 text-emerald-900 text-center font-mono text-[10px] space-y-0.5 shadow-sm shrink-0">
                <div className="font-black text-xs uppercase tracking-wider">{form.companyName || 'VOTRE ENTREPRISE'}</div>
                <div className="font-bold text-emerald-700">★ VU ET APPROUVÉ ★</div>
                <div className="text-[9px] text-slate-500">Signataire : {form.customStampTitle || 'Direction Générale'}</div>
                <div className="text-[8px] text-emerald-600 font-bold">HORODATAGE TLS 1.3 • SCELLÉ LÉGAL</div>
              </div>
            </div>

            {/* Option Marque Blanche */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-black text-purple-950">Option Marque Blanche Intégrale</span>
                </div>
                <p className="text-[11px] text-purple-800">
                  Masquer discrètement les mentions « Propulsé par PayLocal » pour mettre 100% en valeur la marque de votre cabinet ou entreprise.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                <input
                  type="checkbox"
                  checked={form.whiteLabelMode}
                  onChange={(e) => setForm({ ...form, whiteLabelMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Boutons d'Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl bg-gradient-to-tr ${activeTheme.bgClass} text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center space-x-2`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Touche Personnalisée Enregistrée !</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Enregistrer Ma Touche Sur-Mesure</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
