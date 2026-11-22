import React from 'react';
import { CountryCode, EnterpriseBranding } from '../engine/types';
import { Building2, Calendar, ShieldCheck, SendHorizontal, FileText, UserPlus, Shield, Target, Lock, FolderArchive, Play, Palette } from 'lucide-react';

interface HeaderProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  allowedCountries?: CountryCode[];
  organizationName?: string;
  branding?: EnterpriseBranding;
  onOpenBranding?: () => void;
  activePeriod: string;
  onOpenBulkPayout: () => void;
  onOpenTaxExport: () => void;
  onOpenNewEmployee: () => void;
  onOpenSecurityCenter: () => void;
  onOpenLeadPipeline: () => void;
  onOpenArchives: () => void;
  onOpenTour: () => void;
  isPayoutDone: boolean;
  isPrivacyMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCountry,
  onSelectCountry,
  allowedCountries = ['SN'],
  organizationName = 'Groupe Kalia SARL',
  branding,
  onOpenBranding,
  activePeriod,
  onOpenBulkPayout,
  onOpenTaxExport,
  onOpenNewEmployee,
  onOpenSecurityCenter,
  onOpenLeadPipeline,
  onOpenArchives,
  onOpenTour,
  isPayoutDone,
  isPrivacyMode,
}) => {
  const isSingleCountryLocked = allowedCountries.length <= 1;

  const getCountryInfo = (code: CountryCode) => {
    switch (code) {
      case 'SN': return { flag: '🇸🇳', name: 'Sénégal', tag: 'DGI / IPRES' };
      case 'CI': return { flag: '🇨🇮', name: 'Côte d\'Ivoire', tag: 'DGI / CNPS' };
      case 'CM': return { flag: '🇨🇲', name: 'Cameroun', tag: 'DGI / CNPS' };
      case 'BJ': return { flag: '🇧🇯', name: 'Bénin', tag: 'DGI / CNSS' };
    }
  };

  const getBrandGradient = (theme?: string) => {
    switch (theme) {
      case 'BLUE': return 'from-blue-600 to-indigo-500 shadow-blue-500/20';
      case 'AMBER': return 'from-amber-500 to-orange-500 shadow-amber-500/20';
      case 'PURPLE': return 'from-purple-600 to-pink-500 shadow-purple-500/20';
      case 'ROSE': return 'from-rose-600 to-red-500 shadow-rose-500/20';
      default: return 'from-emerald-600 to-teal-500 shadow-emerald-500/20';
    }
  };

  const currentCountry = getCountryInfo(selectedCountry);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Entreprise */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <button
                onClick={onOpenBranding}
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getBrandGradient(branding?.brandColor)} flex items-center justify-center text-white font-black text-xl shadow-md hover:scale-105 transition-transform`}
                title="Personnaliser la touche visuelle de votre entreprise (Logo, Couleurs, Raison Sociale)"
              >
                {branding?.logoInitial || 'P'}
              </button>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    {branding?.whiteLabelMode ? (branding.companyName.split(' ')[0] || 'Enterprise') : 'PayLocal'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    OHADA / UEMOA
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">SaaS Paie & Payout Mobile Money</p>
              </div>
            </div>

            <button
              onClick={onOpenBranding}
              className="hidden lg:flex items-center space-x-2 pl-4 border-l border-slate-200 text-left hover:opacity-80 transition-opacity"
              title="Modifier la raison sociale et la touche sur-mesure"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-sm font-bold text-slate-800 block leading-tight">
                  {branding?.companyName || organizationName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {branding?.legalId ? branding.legalId.split('•')[0] : `(ID: TENANT-${selectedCountry})`}
                </span>
              </div>
            </button>
          </div>

          {/* Sélecteurs Pays & Actions */}
          <div className="flex items-center space-x-2.5">
            
            {/* GESTION DE LA SÉCURITÉ ET ISOLEMENT DU PAYS (STRICT & ÉTANCHE - ZÉRO FUITE TRANSFRONTALIÈRE) */}
            <div
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-bold text-white shadow-sm"
              title="Espace national confiné : cette entreprise n'a accès qu'à son propre territoire légal (Conforme CDP / ARTCI / BCEAO)."
            >
              <span className="text-base">{currentCountry.flag}</span>
              <span className="font-black text-white">{currentCountry.name}</span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                Territoire Confiné Sécurisé
              </span>
            </div>

            {/* BOUTON PROSPECTION (LEADS CRM) */}
            <button
              onClick={onOpenLeadPipeline}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm shadow-orange-500/20 transition-all animate-pulse"
              title="Ouvrir le pipeline de prospection"
            >
              <Target className="w-4 h-4" />
              <span className="hidden md:inline">Prospects</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/25 text-white font-mono text-[10px]">
                {selectedCountry === 'SN' ? '10' : '12'}
              </span>
            </button>

            {/* Bouton Sécurité & Audit */}
            <button
              onClick={onOpenSecurityCenter}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
              title="Centre de Sécurité Bancaire & Audit Trail"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Sécurité</span>
              {isPrivacyMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              )}
            </button>

            {/* Quick Actions */}
            <button
              onClick={onOpenNewEmployee}
              className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>+ Salarié</span>
            </button>

            <button
              onClick={onOpenTaxExport}
              className="hidden md:flex items-center space-x-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors"
              title="Exporter Déclarations Fiscales"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>État Légal</span>
            </button>

            {/* Bouton Dossier d'Archives & Coffre-Fort */}
            <button
              onClick={onOpenArchives}
              className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-all shadow-sm"
              title="Dossier d'Archives Légales & Coffre-Fort (Conforme OHADA 10 ans)"
            >
              <FolderArchive className="w-4 h-4 text-amber-600" />
              <span>Archives</span>
            </button>

            {/* Bouton Personnalisation de Marque (La Touche Sur-Mesure) */}
            {onOpenBranding && (
              <button
                onClick={onOpenBranding}
                className="flex items-center space-x-1.5 text-xs font-black px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 transition-all shadow-sm"
                title="Personnaliser la touche visuelle de votre entreprise (Logo, Couleurs, Cachet officiel)"
              >
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden xl:inline">Ma Touche</span>
              </button>
            )}

            {/* Bouton Démo Guidée Interactive */}
            <button
              onClick={onOpenTour}
              className="flex items-center space-x-1.5 text-xs font-black px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-800 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all shadow-sm"
              title="Lancer la démonstration interactive guidée"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>Démo Guidée</span>
            </button>

            {/* Bouton Payout Mobile Money Principal */}
            <button
              onClick={onOpenBulkPayout}
              className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all ${
                isPayoutDone
                  ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow'
              }`}
            >
              {isPayoutDone ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Salaires Déboursés</span>
                </>
              ) : (
                <>
                  <SendHorizontal className="w-4 h-4" />
                  <span>Débourser</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
