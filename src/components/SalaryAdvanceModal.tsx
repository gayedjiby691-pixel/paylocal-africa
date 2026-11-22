import React, { useState } from 'react';
import { EmployeeProfile } from '../engine/types';
import { X, HandCoins, Smartphone, CheckCircle2, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import { InputSanitizer } from '../security/sanitizer';

interface SalaryAdvanceModalProps {
  employee: EmployeeProfile | null;
  currentAdvance: number;
  onSaveAdvance: (employeeId: string, amount: number) => void;
  onClose: () => void;
}

export const SalaryAdvanceModal: React.FC<SalaryAdvanceModalProps> = ({
  employee,
  currentAdvance,
  onSaveAdvance,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(currentAdvance || 30000);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!employee) return null;

  const maxAdvanceAllowed = Math.round(employee.baseSalary * 0.5); // Règle d'or légale : max 50% du salaire de base OHADA
  const isOutOfLimits = amount <= 0 || amount > maxAdvanceAllowed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation stricte de sécurité financière
    if (amount <= 0) {
      setErrorMessage('Le montant de l\'acompte doit être supérieur à 0 FCFA.');
      return;
    }

    if (amount > maxAdvanceAllowed) {
      setErrorMessage(`Le montant dépasse le plafond légal de 50% du salaire de base (${formatMoney(maxAdvanceAllowed)}).`);
      return;
    }

    const cleanAmount = InputSanitizer.cleanNumber(amount, 1000, maxAdvanceAllowed, 0);
    onSaveAdvance(employee.id, cleanAmount);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleAmountChange = (valStr: string) => {
    const rawVal = Number(valStr);
    setAmount(rawVal);
    if (rawVal <= 0) {
      setErrorMessage('Montant invalide : l\'acompte ne peut pas être nul ou négatif.');
    } else if (rawVal > maxAdvanceAllowed) {
      setErrorMessage(`Dépassement du plafond légal de 50% (${formatMoney(maxAdvanceAllowed)}).`);
    } else {
      setErrorMessage(null);
    }
  };

  const formatMoney = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-purple-400" />
            </button>
            <div>
              <h3 className="text-sm font-black text-white">Acompte sur Salaire (15 du mois)</h3>
              <p className="text-xs text-slate-400 font-medium">{employee.firstName} {employee.lastName} • {employee.jobTitle || 'Salarié'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Acompte enregistré avec succès !</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Le montant de <strong className="text-purple-700 font-bold">{formatMoney(amount)}</strong> a été validé pour {employee.firstName}. Il sera automatiquement déduit du déboursement final de fin de mois.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Infos Récapitulatives */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Salaire de base brut :</span>
                <span className="font-extrabold text-slate-800 font-mono">{formatMoney(employee.baseSalary)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Plafond légal (50% max) :</span>
                <span className="font-bold text-emerald-700 font-mono">{formatMoney(maxAdvanceAllowed)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Canal de versement :</span>
                <span className="font-mono font-bold text-slate-800 flex items-center">
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {employee.paymentProvider} ({employee.payoutPhone})
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Montant de l'acompte (FCFA)
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Par tranche de 5 000 FCFA</span>
              </div>

              <input
                type="number"
                min="5000"
                max={maxAdvanceAllowed}
                step="5000"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border ${
                  errorMessage ? 'border-red-500 focus:ring-red-500 bg-red-50/30' : 'border-slate-300 focus:ring-purple-600'
                } focus:outline-none focus:ring-2 text-lg font-black text-slate-900 font-mono`}
                required
              />

              {/* Message d'erreur de sécurité financière */}
              {errorMessage && (
                <div className="flex items-center space-x-1.5 mt-2 text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Raccourcis de montants rapides */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Rapide :</span>
                {[15000, 25000, 30000, 50000].map((quickVal) => (
                  <button
                    key={quickVal}
                    type="button"
                    onClick={() => {
                      const val = Math.min(quickVal, maxAdvanceAllowed);
                      setAmount(val);
                      setErrorMessage(null);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 transition-colors"
                  >
                    {quickVal / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2.5 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isOutOfLimits}
                className={`flex-1 py-3 rounded-xl text-white font-black text-xs shadow-md transition-all ${
                  isOutOfLimits
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                }`}
              >
                Valider l'Acompte
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
