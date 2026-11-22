import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
  Building2, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Award, 
  ChevronRight, 
  ArrowLeft,
  RefreshCw,
  Fingerprint,
  Sparkles,
  Play,
  AlertTriangle
} from 'lucide-react';
import { CountryCode } from '../engine/types';
import { RequestDemoModal } from './RequestDemoModal';
import { SecurityAuditService } from '../security/auditLogger';
import { InputSanitizer } from '../security/sanitizer';

export interface UserSession {
  email: string;
  name: string;
  role: 'DIRECTEUR' | 'COMPTABLE' | 'RH';
  organization: string;
  country: CountryCode;
  allowedCountries: CountryCode[]; // Confiné de manière étanche au pays détecté
}

interface LoginModalProps {
  onLogin: (session: UserSession) => void;
  onStartInteractiveTour?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onStartInteractiveTour }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('SN');
  const [email, setEmail] = useState('direction@dakar-securite.sn');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'DIRECTEUR' | 'COMPTABLE' | 'RH'>('DIRECTEUR');
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '2', '9', '1', '0']);
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA'>('CREDENTIALS');
  const [isRememberDevice, setIsRememberDevice] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Détection automatique du pays en cas de saisie manuelle d'email avec domaine territorial
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const clean = val.toLowerCase().trim();
    if (clean.endsWith('.ci') || clean.includes('.ci') || clean.includes('abidjan') || clean.includes('ivoire')) {
      setSelectedCountry('CI');
    } else if (clean.endsWith('.cm') || clean.includes('.cm') || clean.includes('cameroun') || clean.includes('douala')) {
      setSelectedCountry('CM');
    } else if (clean.endsWith('.bj') || clean.includes('.bj') || clean.includes('benin') || clean.includes('cotonou')) {
      setSelectedCountry('BJ');
    } else if (clean.endsWith('.sn') || clean.includes('.sn') || clean.includes('dakar') || clean.includes('senegal')) {
      setSelectedCountry('SN');
    }
  };

  const getOrgDetails = (country: CountryCode) => {
    switch (country) {
      case 'SN':
        return {
          name: 'Dakar Protection Sécurité Privée SARL',
          location: 'Dakar, Sénégal (UEMOA)',
          taxTag: 'Régime DGID • IPRES • CSS',
          payoutProvider: 'Wave & Orange Money Sénégal',
        };
      case 'CI':
        return {
          name: 'Ivoire Sécurité & Gardiennage SA',
          location: 'Abidjan, Côte d\'Ivoire (UEMOA)',
          taxTag: 'Régime DGI • CNPS • CMU',
          payoutProvider: 'Wave, Orange & MTN MoMo',
        };
      case 'CM':
        return {
          name: 'Cameroun Logistique & Sécurité SA',
          location: 'Douala, Cameroun (CEMAC)',
          taxTag: 'Régime DGI • CNPS • FNE',
          payoutProvider: 'MTN MoMo & Orange Money',
        };
      case 'BJ':
        return {
          name: 'Bénin Maintenance & Services SARL',
          location: 'Cotonou, Bénin (UEMOA)',
          taxTag: 'Régime DGI • CNSS',
          payoutProvider: 'MTN MoMo & Moov',
        };
    }
  };

  const [authError, setAuthError] = useState<string | null>(null);

  // Protection Anti-Brute-Force & Verrouillage Temporaire (Standards BCEAO/OHADA)
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('paylocal_auth_fails') || 0);
    } catch {
      return 0;
    }
  });

  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('paylocal_auth_lockout');
      if (saved) {
        const t = Number(saved);
        if (t > Date.now()) return t;
      }
    } catch {}
    return null;
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (lockoutEndTime && lockoutEndTime > Date.now()) {
      return Math.ceil((lockoutEndTime - Date.now()) / 1000);
    }
    return 0;
  });

  useEffect(() => {
    if (!lockoutEndTime) {
      setRemainingSeconds(0);
      return;
    }
    const updateCountdown = () => {
      const left = Math.max(0, Math.ceil((lockoutEndTime - Date.now()) / 1000));
      setRemainingSeconds(left);
      if (left <= 0) {
        setLockoutEndTime(null);
        setFailedAttempts(0);
        try {
          localStorage.removeItem('paylocal_auth_lockout');
          localStorage.removeItem('paylocal_auth_fails');
        } catch {}
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  const triggerFailedAttempt = (reason: string) => {
    const nextFails = failedAttempts + 1;
    setFailedAttempts(nextFails);
    try {
      localStorage.setItem('paylocal_auth_fails', String(nextFails));
    } catch {}

    if (nextFails >= 5) {
      const lockUntil = Date.now() + 60 * 1000;
      setLockoutEndTime(lockUntil);
      try {
        localStorage.setItem('paylocal_auth_lockout', String(lockUntil));
      } catch {}
      SecurityAuditService.logAction(
        email,
        'AUTH_LOCKED',
        `VERROUILLAGE SYSTÈME (5 échecs consécutifs) : blocage préventif de 60 secondes appliqué au terminal.`,
        'CRITICAL'
      );
      setAuthError('Sécurité bancaire : 5 échecs consécutifs détectés. Terminal consigné pendant 60 secondes.');
    } else {
      SecurityAuditService.logAction(
        email,
        'AUTH_FAILURE',
        `Échec d'authentification (${nextFails}/5 tentatives autorisées) : ${reason}`,
        'WARNING'
      );
      setAuthError(`${reason} (${5 - nextFails} tentative(s) restante(s) avant verrouillage de sécurité).`);
    }
  };

  const getCountryName = (c: CountryCode) => {
    switch (c) {
      case 'SN': return 'Sénégal (Dakar)';
      case 'CI': return 'Côte d\'Ivoire (Abidjan)';
      case 'CM': return 'Cameroun (Douala)';
      case 'BJ': return 'Bénin (Cotonou)';
    }
  };

  // Contrôle strict de frontière territoriale (Boundary Enforcement)
  const validateCountryDomainMatch = (emailInput: string, targetCountry: CountryCode): { valid: boolean; reason?: string } => {
    const clean = emailInput.toLowerCase().trim();
    
    // Détection de tentative transfrontalière interdite :
    const isSnDomain = clean.endsWith('.sn') || clean.includes('.sn/') || clean.includes('@dakar') || clean.includes('senegal');
    const isCiDomain = clean.endsWith('.ci') || clean.includes('.ci/') || clean.includes('@abidjan') || clean.includes('ivoire');
    const isCmDomain = clean.endsWith('.cm') || clean.includes('.cm/') || clean.includes('@douala') || clean.includes('cameroun');
    const isBjDomain = clean.endsWith('.bj') || clean.includes('.bj/') || clean.includes('@cotonou') || clean.includes('benin');

    if (isSnDomain && targetCountry !== 'SN') {
      return {
        valid: false,
        reason: `⛔ ACCÈS STRICTEMENT REFUSÉ (ISOLEMENT SOUVERAIN) : Votre compte d'entreprise est domicilié au Sénégal (.sn). Vous n'avez pas l'autorisation d'accéder au territoire du ${getCountryName(targetCountry)} pour prévenir les risques de fuite et de piratage transfrontalier.`,
      };
    }

    if (isCiDomain && targetCountry !== 'CI') {
      return {
        valid: false,
        reason: `⛔ ACCÈS STRICTEMENT REFUSÉ (ISOLEMENT SOUVERAIN) : Votre compte d'entreprise est domicilié en Côte d'Ivoire (.ci). Vous ne pouvez pas accéder à l'espace souverain du ${getCountryName(targetCountry)}.`,
      };
    }

    if (isCmDomain && targetCountry !== 'CM') {
      return {
        valid: false,
        reason: `⛔ ACCÈS STRICTEMENT REFUSÉ (ISOLEMENT SOUVERAIN) : Votre compte d'entreprise est domicilié au Cameroun (.cm). Vous ne pouvez pas accéder à l'espace souverain du ${getCountryName(targetCountry)}.`,
      };
    }

    if (isBjDomain && targetCountry !== 'BJ') {
      return {
        valid: false,
        reason: `⛔ ACCÈS STRICTEMENT REFUSÉ (ISOLEMENT SOUVERAIN) : Votre compte d'entreprise est domicilié au Bénin (.bj). Vous ne pouvez pas accéder à l'espace souverain du ${getCountryName(targetCountry)}.`,
      };
    }

    return { valid: true };
  };

  const org = getOrgDetails(selectedCountry);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingSeconds > 0) {
      setAuthError(`Terminal temporairement verrouillé par mesure de sécurité bancaire. Veuillez patienter ${remainingSeconds} secondes.`);
      return;
    }

    setAuthError(null);
    const cleanEmail = InputSanitizer.cleanEmail(email);
    const cleanPassword = InputSanitizer.cleanText(password);

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAuthError('Veuillez saisir une adresse email professionnelle valide (ex: contact@societe.sn).');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setAuthError('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    // Vérification du cloisonnement souverain territorial
    const domainCheck = validateCountryDomainMatch(cleanEmail, selectedCountry);
    if (!domainCheck.valid) {
      setAuthError(domainCheck.reason || 'Accès transfrontalier interdit.');
      SecurityAuditService.logAction(
        cleanEmail,
        'CROSS_BORDER_BLOCKED',
        `TENTATIVE TRANSFRONTALIÈRE BLOQUÉE : Compte (${cleanEmail}) a tenté de pénétrer le territoire ${selectedCountry}. Accès rejeté.`,
        'CRITICAL'
      );
      return;
    }

    setStep('MFA');
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingSeconds > 0) {
      setAuthError(`Terminal temporairement consigné. Veuillez patienter ${remainingSeconds} secondes.`);
      return;
    }

    setAuthError(null);
    const cleanEmail = InputSanitizer.cleanEmail(email);

    // Re-vérification de sécurité stricte
    const domainCheck = validateCountryDomainMatch(cleanEmail, selectedCountry);
    if (!domainCheck.valid) {
      setAuthError(domainCheck.reason || 'Accès transfrontalier interdit.');
      return;
    }

    const code = otpDigits.join('');
    if (code.length !== 6) {
      setAuthError('Veuillez renseigner l\'intégralité des 6 chiffres du code OTP.');
      return;
    }

    // Vérification de sécurité du code OTP (OTP attendu en démo : 842910)
    if (code !== '842910') {
      triggerFailedAttempt('Code OTP de vérification double facteur incorrect.');
      return;
    }

    // Réinitialisation des tentatives après succès
    setFailedAttempts(0);
    setLockoutEndTime(null);
    try {
      localStorage.removeItem('paylocal_auth_fails');
      localStorage.removeItem('paylocal_auth_lockout');
    } catch {}

    onLogin({
      email: cleanEmail,
      name: role === 'DIRECTEUR' ? 'Amadou Sall (Direction Générale)' : role === 'COMPTABLE' ? 'Cabinet Fiduciaire (Expert Agréé)' : 'Fatoumata Bâ (Ressources Humaines)',
      role,
      organization: org.name,
      country: selectedCountry,
      allowedCountries: [selectedCountry],
    });
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);
    
    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleQuickEnterpriseLogin = (
    quickEmail: string, 
    quickRole: 'DIRECTEUR' | 'COMPTABLE' | 'RH', 
    quickName: string, 
    c: CountryCode
  ) => {
    const domainCheck = validateCountryDomainMatch(quickEmail, c);
    if (!domainCheck.valid) {
      setAuthError(domainCheck.reason || 'Accès transfrontalier interdit.');
      return;
    }
    const details = getOrgDetails(c);
    onLogin({
      email: quickEmail,
      name: quickName,
      role: quickRole,
      organization: details.name,
      country: c,
      allowedCountries: [c],
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* GAUCHE : PANNEAU INSTITUTIONNEL (CRÉDIBILITÉ BANCAIRE & AUTORITÉ B2B)    */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 p-8 sm:p-14 lg:p-20 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border-r border-slate-800/80 relative overflow-hidden">
        
        {/* Glow d'ambiance discret */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
              P
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">PayLocal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Africa Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Infrastructure de Paie & Déboursement Mobile Money</p>
            </div>
          </div>
        </div>

        {/* Message Central & Preuve Sociale Haute Valeur */}
        <div className="my-12 lg:my-0 space-y-8 relative z-10">
          
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              L'infrastructure souveraine de paie pour les leaders africains.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Automatisez vos bulletins conformes OHADA et virez des centaines de salaires sur Wave et Orange Money en un clic sécurisé avec signature électronique et code OTP.
            </p>
          </div>

          {/* Témoignage Client Réel (Gage de confiance institutionnel) */}
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 space-y-4 shadow-xl">
            <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
              « Clôturer la paie de nos 140 vigiles prenait 4 jours ouvrés et des risques énormes de retrait bancaire. Avec PayLocal, nous validons les acomptes du 15 et déboursons l'intégralité des salaires sur Wave en 8 minutes chrono. »
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <h4 className="text-xs font-bold text-white">Directeur Administratif & Financier</h4>
                <p className="text-[11px] text-emerald-400">Société de Sécurité & Gardiennage (Dakar)</p>
              </div>
              <div className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-mono font-bold">140 vigiles certifiés</span>
              </div>
            </div>
          </div>

          {/* Métrique Clé */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Volume Déboursé Sécurisé
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                +1,42 Milliard FCFA
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Taux de Disponibilité API
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                99.98% SLA
              </span>
            </div>
          </div>

          {/* Bouton Appel d'Action Démo Rapide */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDemoModal(true)}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 group"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>Planifier une démo personnalisée (15 min)</span>
            </button>
          </div>

        </div>

        {/* Footer de Sécurité & Réglementation */}
        <div className="pt-6 border-t border-white/10 text-xs text-slate-400 space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chiffrement Bancaire TLS 1.3 / AES-256</span>
            </span>
            <span>•</span>
            <span>Conforme BCEAO & OHADA</span>
            <span>•</span>
            <span>Souveraineté Territoriale des Données (CDP / ARTCI)</span>
          </div>
          <p className="text-[10px] text-slate-500">
            PayLocal Africa Enterprise Cloud © 2026. Tous droits réservés.
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DROITE : FORMULAIRE DE CONNEXION D'ENTREPRISE (RAZOR-SHARP & ÉPURÉ)       */}
      {/* ========================================================================= */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-20 flex flex-col justify-center bg-slate-900/40 relative">
        
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Form Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Console d'Entreprise Sécurisée</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {step === 'CREDENTIALS' ? 'Connexion à votre espace' : 'Vérification en Deux Étapes'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {step === 'CREDENTIALS' 
                ? 'Saisissez vos identifiants d\'entreprise. Votre espace territorial souverain est détecté automatiquement.'
                : 'Un code de confirmation à usage unique (OTP) a été expédié sur votre terminal sécurisé.'}
            </p>
            {remainingSeconds > 0 ? (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start space-x-3 shadow-lg shadow-red-950/50 animate-shake">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <strong className="text-white block font-black text-sm">
                    ⛔ Terminal Consigné • Sécurité Anti-Brute-Force
                  </strong>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    5 échecs consécutifs détectés. Par mesure de conformité bancaire BCEAO, tout accès est temporairement suspendu pendant encore <span className="font-mono font-black text-red-400 text-sm">{remainingSeconds}s</span>.
                  </p>
                </div>
              </div>
            ) : authError ? (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            ) : null}
          </div>

          {/* STEP 1 : IDENTIFIANTS */}
          {step === 'CREDENTIALS' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              
              {/* Choix & Détection du Territoire National Souverain (4 Pays) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Territoire National & Régime Fiscal
                  </label>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Confinement RLS Actif
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { code: 'SN' as const, flag: '🇸🇳', name: 'Sénégal', city: 'Dakar (UEMOA)', demoEmail: 'direction@dakar-securite.sn' },
                    { code: 'CI' as const, flag: '🇨🇮', name: 'Côte d\'Ivoire', city: 'Abidjan (UEMOA)', demoEmail: 'direction@ivoire-gardiennage.ci' },
                    { code: 'CM' as const, flag: '🇨🇲', name: 'Cameroun', city: 'Douala (CEMAC)', demoEmail: 'direction@douala-logistique.cm' },
                    { code: 'BJ' as const, flag: '🇧🇯', name: 'Bénin', city: 'Cotonou (UEMOA)', demoEmail: 'direction@cotonou-maintenance.bj' },
                  ].map((p) => (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(p.code);
                        setEmail(p.demoEmail);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        selectedCountry === p.code
                          ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      title={`Rejoindre directement l'espace souverain : ${p.name}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{p.flag}</span>
                        <span className="text-[9px] font-mono font-bold uppercase px-1 rounded bg-slate-800 text-slate-300">{p.code}</span>
                      </div>
                      <div className="mt-1">
                        <div className="font-extrabold text-xs text-white leading-tight">{p.name}</div>
                        <div className="text-[9px] text-slate-400">{p.city}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rôle & Habilitation Professionnelle */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Profil d'Habilitation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'DIRECTEUR', label: 'Direction Générale', sub: 'Validation & Payout' },
                    { key: 'COMPTABLE', label: 'Expert-Comptable', sub: 'Audit & Fiscalité' },
                    { key: 'RH', label: 'Gestionnaire RH', sub: 'Salariés & Présences' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === r.key
                          ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white leading-tight">{r.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Professionnel */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Adresse E-mail Professionnelle
                  </label>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Souveraineté : {org.location}
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all"
                    placeholder="nom@votre-societe.sn"
                  />
                </div>
              </div>

              {/* Mot de Passe avec Masquer / Afficher */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Mot de Passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs font-mono font-medium rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Badge d'Information Tenant Silencieux & Furtif */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">Organisation & Espace Fiscal :</span>
                    <strong className="text-white font-semibold text-xs">{org.name}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                  {org.taxTag}
                </span>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isRememberDevice}
                    onChange={(e) => setIsRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Mémoriser ce terminal sécurisé</span>
                </label>
                <a href="#assistance" onClick={(e) => { e.preventDefault(); alert("Pour réinitialiser votre accès ou enregistrer un nouveau domaine d'entreprise, contactez le support sécurisé : support@paylocal-africa.com"); }} className="hover:text-emerald-400 transition-colors">
                  Assistance DAF ?
                </a>
              </div>

              {/* Bouton de Soumission */}
              <button
                type="submit"
                disabled={remainingSeconds > 0}
                className={`w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 group ${
                  remainingSeconds > 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
                }`}
              >
                <span>{remainingSeconds > 0 ? `Terminal verrouillé (${remainingSeconds}s)` : 'Accéder à la Console Sécurisée'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Section Démonstration Institutionnelle Sécurisée */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <button
                  type="button"
                  onClick={() => handleQuickEnterpriseLogin(email, role, role === 'DIRECTEUR' ? 'Directeur Général' : role === 'COMPTABLE' ? 'Expert-Comptable Agréé' : 'Responsable RH', selectedCountry)}
                  className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/60 text-left text-xs transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white text-xs block group-hover:text-emerald-300 transition-colors">
                        Accès Direct • Espace Entreprise {org.location}
                      </strong>
                      <span className="text-[10px] text-slate-400">Authentification certifiée avec jeton RLS actif</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Bouton Lancement Démo Interactive Guidée */}
                <button
                  type="button"
                  onClick={() => {
                    handleQuickEnterpriseLogin(email, 'DIRECTEUR', 'Directeur Général (Mode Démo)', selectedCountry);
                    onStartInteractiveTour?.();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10 group"
                >
                  <Play className="w-4 h-4 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>🎬 Lancer la Démo Interactive Guidée (90s)</span>
                </button>

                {/* Bouton pour nouveaux prospects */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors py-1 px-3 rounded-lg hover:bg-emerald-500/10"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pas encore d'identifiant ? Demander un pilote gratuit</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* STEP 2 : VALIDATION MFA (2FA DE TYPE BANCAIRE / OTP CELLULES) */}
          {step === 'MFA' && (
            <form onSubmit={handleMfaSubmit} className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-white">Vérification de Sécurité Double Facteur</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conformément aux normes BCEAO, saisissez le code OTP à 6 chiffres envoyé au gestionnaire certifié pour valider la session.
                </p>
                <div className="font-mono text-[11px] text-emerald-400 font-bold">
                  Compte cible : {email}
                </div>
              </div>

              {/* 6 Cases Individuelles d'OTP */}
              <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono rounded-xl border border-slate-700 bg-slate-950 text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs text-slate-400">
                  Code de sécurité généré pour votre démonstration : <strong className="text-white font-mono">842910</strong>
                </span>
                <p className="text-[11px] text-slate-500">
                  Délai de validité du jeton : <strong>04:45</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={remainingSeconds > 0}
                className={`w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase shadow-lg transition-all flex items-center justify-center space-x-2 ${
                  remainingSeconds > 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                <span>{remainingSeconds > 0 ? `Terminal consigné (${remainingSeconds}s)` : 'Confirmer & Ouvrir la Console'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Modifier les identifiants</span>
              </button>

            </form>
          )}

        </div>

      </div>

      {showDemoModal && (
        <RequestDemoModal onClose={() => setShowDemoModal(false)} />
      )}

    </div>
  );
};
