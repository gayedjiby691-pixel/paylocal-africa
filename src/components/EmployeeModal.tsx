import React, { useState } from 'react';
import { EmployeeProfile, CountryCode, EmployeeCategory, MobileMoneyProvider } from '../engine/types';
import { X, UserPlus, Smartphone } from 'lucide-react';

interface EmployeeModalProps {
  country: CountryCode;
  onSave: (employee: EmployeeProfile) => void;
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  country,
  onSave,
  onClose,
}) => {
  const getDefaultPhonePrefix = (c: CountryCode) => {
    switch (c) {
      case 'SN': return '+221 77 ';
      case 'CI': return '+225 07 ';
      case 'CM': return '+237 6 ';
      case 'BJ': return '+229 97 ';
    }
  };

  const getDefaultTransport = (c: CountryCode) => {
    switch (c) {
      case 'SN': return 20820;
      case 'CI': return 30000;
      case 'CM': return 25000;
      case 'BJ': return 20000;
    }
  };

  // Helper : Première lettre de chaque mot en majuscule (gère les noms composés et tirets)
  const capitalizeWords = (str: string): string => {
    return str.replace(/(^|[\s-])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase());
  };

  // Helper : Première lettre de la phrase en majuscule
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Helper : Formatage intelligent du téléphone avec espaces automatiques selon le pays
  const formatPhoneNumberInput = (raw: string, c: CountryCode): string => {
    const cleanDigits = raw.replace(/\D/g, '');

    if (c === 'SN') {
      // Sénégal (+221) : Format 9 chiffres par blocs 2 - 3 - 2 - 2 (ex: +221 77 123 45 67)
      let local = cleanDigits;
      if (local.startsWith('221')) {
        local = local.slice(3);
      }
      local = local.slice(0, 9);
      
      const chunks = [];
      if (local.length > 0) chunks.push(local.slice(0, 2));
      if (local.length > 2) chunks.push(local.slice(2, 5));
      if (local.length > 5) chunks.push(local.slice(5, 7));
      if (local.length > 7) chunks.push(local.slice(7, 9));
      
      return chunks.length > 0 ? `+221 ${chunks.join(' ')}` : '+221 ';
    }

    if (c === 'CI') {
      // Côte d'Ivoire (+225) : Format 10 chiffres par blocs de 2 (ex: +225 07 48 90 12 34)
      let local = cleanDigits;
      if (local.startsWith('225')) {
        local = local.slice(3);
      }
      local = local.slice(0, 10);
      
      const chunks = local.match(/.{1,2}/g) || [];
      return chunks.length > 0 ? `+225 ${chunks.join(' ')}` : '+225 ';
    }

    if (c === 'CM') {
      // Cameroun (+237) : Format 9 chiffres (ex: +237 6 77 12 34 56)
      let local = cleanDigits;
      if (local.startsWith('237')) {
        local = local.slice(3);
      }
      local = local.slice(0, 9);
      
      const chunks = [];
      if (local.length > 0) chunks.push(local.slice(0, 1));
      if (local.length > 1) chunks.push(local.slice(1, 3));
      if (local.length > 3) chunks.push(local.slice(3, 5));
      if (local.length > 5) chunks.push(local.slice(5, 7));
      if (local.length > 7) chunks.push(local.slice(7, 9));
      
      return chunks.length > 0 ? `+237 ${chunks.join(' ')}` : '+237 ';
    }

    // Bénin (+229) : Blocs de 2
    let local = cleanDigits;
    if (local.startsWith('229')) {
      local = local.slice(3);
    }
    local = local.slice(0, 8);
    const chunks = local.match(/.{1,2}/g) || [];
    return chunks.length > 0 ? `+229 ${chunks.join(' ')}` : '+229 ';
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState(getDefaultPhonePrefix(country));
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<EmployeeCategory>('NON_CADRE');
  const [fiscalParts, setFiscalParts] = useState<number>(1.0);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [baseSalary, setBaseSalary] = useState<number>(180000);
  const [transportAllowance, setTransportAllowance] = useState<number>(getDefaultTransport(country));
  const [housingAllowance, setHousingAllowance] = useState<number>(0);
  const [paymentProvider, setPaymentProvider] = useState<MobileMoneyProvider>(
    country === 'CM' ? 'MTN_MOMO' : 'WAVE'
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val || val.length <= 4) {
      setPhone(getDefaultPhonePrefix(country));
      return;
    }
    setPhone(formatPhoneNumberInput(val, country));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: EmployeeProfile = {
      id: 'emp-' + Date.now(),
      matricule: `EMP-${country}-${Math.floor(100 + Math.random() * 900)}`,
      firstName: capitalizeWords(firstName.trim()),
      lastName: capitalizeWords(lastName.trim()),
      jobTitle: capitalizeFirstLetter(jobTitle.trim()) || 'Agent / Salarié',
      phone: phone.trim(),
      email: email.trim() || undefined,
      country,
      category,
      fiscalParts,
      childrenCount,
      baseSalary,
      transportAllowance,
      housingAllowance,
      functionAllowance: 0,
      otherTaxablePrimes: 0,
      paymentProvider,
      payoutPhone: phone.trim(),
    };
    onSave(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Nouveau Salarié</h3>
              <p className="text-xs text-slate-400">Territoire : <strong>{country === 'SN' ? 'Sénégal (Dakar)' : 'Côte d\'Ivoire (Abidjan)'}</strong> • Barème conforme 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Prénom & Nom avec Majuscule Automatique */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Prénom <span className="text-emerald-600 font-normal lowercase">(Majuscule auto)</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(capitalizeWords(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-semibold capitalize rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="ex: Moussa"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Nom <span className="text-emerald-600 font-normal lowercase">(Majuscule auto)</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(capitalizeWords(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-semibold capitalize rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="ex: Diop"
              />
            </div>
          </div>

          {/* Poste */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
              Poste / Fonction <span className="text-emerald-600 font-normal lowercase">(Majuscule auto)</span>
            </label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(capitalizeFirstLetter(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="ex: Vigile de nuit, Chef de poste, Chauffeur, Agent de sécurité..."
            />
          </div>

          {/* Téléphone Mobile Money avec Espacement Automatique */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Téléphone Wave / Orange
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 bg-slate-50/50"
                placeholder={country === 'SN' ? '+221 77 123 45 67' : '+225 07 48 90 12 34'}
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                {country === 'SN' ? 'Format : +221 XX XXX XX XX' : 'Format : +225 XX XX XX XX XX'}
              </span>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Email (Optionnel)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="moussa.diop@entreprise.com"
              />
            </div>
          </div>

          {/* Statut & Parts Fiscales */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Statut Professionnel
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmployeeCategory)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-slate-700"
              >
                <option value="NON_CADRE">Non-Cadre (Employé / Vigile / Ouvrier)</option>
                <option value="CADRE">Cadre (Régime complémentaire)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Parts Fiscales (Quotient)
              </label>
              <select
                value={fiscalParts}
                onChange={(e) => setFiscalParts(parseFloat(e.target.value))}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold text-slate-700"
              >
                <option value={1.0}>1.0 part (Célibataire)</option>
                <option value={1.5}>1.5 part (Marié sans enfant)</option>
                <option value={2.0}>2.0 parts (Marié 1 enfant)</option>
                <option value={2.5}>2.5 parts (Marié 2 enfants)</option>
                <option value={3.0}>3.0 parts (Marié 3 enfants)</option>
                <option value={3.5}>3.5 parts (Marié 4 enfants)</option>
                <option value={4.0}>4.0 parts (Marié 5 enfants)</option>
              </select>
            </div>
          </div>

          {/* Salaire & Indemnités */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Salaire de Base Brut (FCFA)
              </label>
              <input
                type="number"
                step="5000"
                required
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-black font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Indemnité Transport (FCFA)
              </label>
              <input
                type="number"
                step="1000"
                value={transportAllowance}
                onChange={(e) => setTransportAllowance(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-bold font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Opérateur de Déboursement */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Canal de Déboursement Immédiat
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentProvider('WAVE')}
                className={`py-2 px-2 text-xs font-extrabold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                  paymentProvider === 'WAVE'
                    ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Wave</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentProvider('ORANGE_MONEY')}
                className={`py-2 px-2 text-xs font-extrabold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                  paymentProvider === 'ORANGE_MONEY'
                    ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span>Orange Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentProvider('MTN_MOMO')}
                className={`py-2 px-2 text-xs font-extrabold rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                  paymentProvider === 'MTN_MOMO'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>MTN MoMo</span>
              </button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              Enregistrer Salarié
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
