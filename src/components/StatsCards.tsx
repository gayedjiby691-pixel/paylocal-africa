import React from 'react';
import { Users, Wallet, Landmark, HandCoins, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { DataMasking } from '../security/masking';

interface StatsCardsProps {
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetToPay: number;
  totalSocialEmployer: number;
  totalTaxes: number;
  totalAdvancesDeducted: number;
  currency?: string;
  isPrivacyMode?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalEmployees,
  totalGrossSalary,
  totalNetToPay,
  totalSocialEmployer,
  totalTaxes,
  totalAdvancesDeducted,
  currency = 'FCFA',
  isPrivacyMode = false,
}) => {
  const formatMoney = (val: number) => {
    const formatted = val.toLocaleString('fr-FR') + ' ' + currency;
    return DataMasking.maskMoney(formatted, isPrivacyMode);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Effectif & Masse Salariale Brute */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Masse Salariale Brute
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
          {formatMoney(totalGrossSalary)}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span><strong>{totalEmployees}</strong> salariés inscrits</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            Ce mois
          </span>
        </div>
      </div>

      {/* 2. NET DÉBOURSABLE MOBILE MONEY (HERO CARD) */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-5 rounded-2xl text-white shadow-md shadow-emerald-950/20 relative overflow-hidden group border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Net Déboursable (Mobile Money)</span>
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-white tracking-tight font-mono relative z-10 text-emerald-400">
          {formatMoney(totalNetToPay)}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-200/90 relative z-10 font-medium">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wave & Orange Money</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Prêt
          </span>
        </div>
      </div>

      {/* 3. Cotisations Sociales & Impôts (Fiscalité) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Charges Fiscales & Sociales
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
          {formatMoney(totalSocialEmployer + totalTaxes)}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">
            Impôts: <strong className="text-slate-700 font-mono">{formatMoney(totalTaxes)}</strong>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            Certifié
          </span>
        </div>
      </div>

      {/* 4. Acomptes Récupérés (15 du mois) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Acomptes Déduits (15 du mois)
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <HandCoins className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-purple-900 tracking-tight font-mono">
          {formatMoney(totalAdvancesDeducted)}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span className="text-slate-600 font-medium">Déductions automatiques</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
            Équilibré
          </span>
        </div>
      </div>

    </div>
  );
};
