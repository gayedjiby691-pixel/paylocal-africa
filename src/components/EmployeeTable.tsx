import React from 'react';
import { EmployeeProfile, PayslipResult } from '../engine/types';
import { FileText, HandCoins, CheckCircle2, Clock, Smartphone, ChevronRight } from 'lucide-react';
import { DataMasking } from '../security/masking';

interface EmployeeTableProps {
  employees: EmployeeProfile[];
  payslips: Map<string, PayslipResult>;
  salaryAdvances: Map<string, number>;
  onSelectEmployeeForPayslip: (emp: EmployeeProfile) => void;
  onOpenAdvanceModal: (emp: EmployeeProfile) => void;
  isPayoutDone: boolean;
  isPrivacyMode?: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  payslips,
  salaryAdvances,
  onSelectEmployeeForPayslip,
  onOpenAdvanceModal,
  isPayoutDone,
  isPrivacyMode = false,
}) => {
  const formatMoney = (val: number = 0) => {
    const raw = val.toLocaleString('fr-FR') + ' FCFA';
    return DataMasking.maskMoney(raw, isPrivacyMode);
  };

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'WAVE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5 animate-pulse"></span>
            Wave
          </span>
        );
      case 'ORANGE_MONEY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
            Orange Money
          </span>
        );
      case 'MTN_MOMO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
            MTN MoMo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
            Virement
          </span>
        );
    }
  };

  // Helper pour les initiales et couleurs d'avatars
  const getAvatarGradient = (id: string) => {
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-emerald-600 to-teal-600',
      'from-purple-600 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-cyan-600 to-blue-600',
    ];
    const index = Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
      
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900">Salariés & Calculs de Paie</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 font-mono">
              {employees.length} collaborateurs
            </span>
            {isPrivacyMode && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-purple-100 text-purple-700">
                Mode Discret
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Moteur légal certifié • Application en temps réel des plafonds sociaux et des tranches fiscales
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Statut de la période :</span>
          {isPayoutDone ? (
            <span className="inline-flex items-center text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Salaires Payés via API
            </span>
          ) : (
            <span className="inline-flex items-center text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Prêt pour déboursement
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/90 text-[11px] uppercase font-black text-slate-500 tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3.5">Salarié / Poste</th>
              <th scope="col" className="px-6 py-3.5">Régime & Parts</th>
              <th scope="col" className="px-6 py-3.5 text-right">Salaire Brut</th>
              <th scope="col" className="px-6 py-3.5 text-right">Retenues (Charges+Impôts)</th>
              <th scope="col" className="px-6 py-3.5 text-right">Acompte (15 du mois)</th>
              <th scope="col" className="px-6 py-3.5 text-right">Net à Débourser</th>
              <th scope="col" className="px-6 py-3.5 text-center">Opérateur</th>
              <th scope="col" className="px-6 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => {
              const slip = payslips.get(emp.id);
              const advance = salaryAdvances.get(emp.id) || 0;
              const gross = slip ? slip.grossSalary : emp.baseSalary;
              const deductions = slip ? slip.totalEmployeeSocial + slip.totalTaxes : 0;
              const netToPay = slip ? slip.netToPay : emp.baseSalary;
              const initials = `${emp.firstName[0] || ''}${emp.lastName[0] || ''}`.toUpperCase();

              return (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Salarié avec Avatar & Poste */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarGradient(emp.id)} text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0`}>
                        {initials}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 leading-tight">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                          {emp.jobTitle || 'Salarié'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {emp.matricule} • {isPrivacyMode ? DataMasking.maskPhone(emp.phone) : emp.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Régime & Parts */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide w-fit ${
                        emp.category === 'CADRE'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {emp.category === 'CADRE' ? 'CADRE (Rég. Compl.)' : 'NON-CADRE (Rég. Gén.)'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {emp.fiscalParts} part{emp.fiscalParts > 1 ? 's' : ''} ({emp.childrenCount} enf.)
                      </span>
                    </div>
                  </td>

                  {/* Salaire Brut */}
                  <td className="px-6 py-4 text-right font-semibold text-slate-800 font-mono">
                    {formatMoney(gross)}
                  </td>

                  {/* Retenues */}
                  <td className="px-6 py-4 text-right">
                    <span className="text-red-600 font-semibold font-mono">
                      -{formatMoney(deductions)}
                    </span>
                    {slip && (
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Ch: {formatMoney(slip.totalEmployeeSocial)} | Imp: {formatMoney(slip.totalTaxes)}
                      </span>
                    )}
                  </td>

                  {/* Acompte */}
                  <td className="px-6 py-4 text-right">
                    {advance > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-lg font-bold text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200">
                        -{formatMoney(advance)}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-mono text-xs">-</span>
                    )}
                  </td>

                  {/* Net à Débourser */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-slate-900 text-base font-mono text-emerald-700">
                      {formatMoney(netToPay)}
                    </span>
                  </td>

                  {/* Canal Payout */}
                  <td className="px-6 py-4 text-center">
                    {getProviderBadge(emp.paymentProvider)}
                  </td>

                  {/* Boutons d'Action Rapide */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onSelectEmployeeForPayslip(emp)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all shadow-sm"
                        title="Ouvrir le bulletin de paie certifié"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fiche</span>
                      </button>

                      <button
                        onClick={() => onOpenAdvanceModal(emp)}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                          advance > 0
                            ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                        title="Gérer l'acompte du 15 du mois"
                      >
                        <HandCoins className="w-3.5 h-3.5 text-purple-600" />
                        <span>{advance > 0 ? 'Acompte ✓' : 'Acompte'}</span>
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
