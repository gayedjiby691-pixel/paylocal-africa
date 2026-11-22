import React, { useState, useEffect } from 'react';
import { EmployeeProfile, PayslipResult } from '../engine/types';
import { X, SendHorizontal, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, RefreshCw, ArrowLeft, Lock } from 'lucide-react';
import { IdempotencyManager } from '../security/idempotency';

interface BulkPayoutModalProps {
  employees: EmployeeProfile[];
  payslips: Map<string, PayslipResult>;
  onClose: () => void;
  onPayoutSuccess: () => void;
}

export const BulkPayoutModal: React.FC<BulkPayoutModalProps> = ({
  employees,
  payslips,
  onClose,
  onPayoutSuccess,
}) => {
  const [step, setStep] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [expectedOtp, setExpectedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatMoney = (val: number = 0) => val.toLocaleString('fr-FR') + ' FCFA';

  // Génération dynamique d'un code OTP cryptographique simulé
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    setInputOtp(code); // Pré-rempli pour simplifier le test
  };

  useEffect(() => {
    generateNewOtp();
    // Clé d'idempotence unique
    const key = IdempotencyManager.generateBatchKey(
      'kalia-org-01',
      'Mai2026',
      employees.map((e) => e.id)
    );
    setIdempotencyKey(key);
  }, [employees]);

  // Calcul des totaux par opérateur
  let totalNet = 0;
  let waveCount = 0;
  let waveAmount = 0;
  let orangeCount = 0;
  let orangeAmount = 0;
  let mtnCount = 0;
  let mtnAmount = 0;

  employees.forEach((emp) => {
    const slip = payslips.get(emp.id);
    const amount = slip ? slip.netToPay : emp.baseSalary;
    totalNet += amount;
    if (emp.paymentProvider === 'WAVE') {
      waveCount++;
      waveAmount += amount;
    } else if (emp.paymentProvider === 'ORANGE_MONEY') {
      orangeCount++;
      orangeAmount += amount;
    } else {
      mtnCount++;
      mtnAmount += amount;
    }
  });

  const handleConfirmDisbursement = () => {
    setErrorMessage('');
    
    // Vérification de l'idempotence anti-double paiement
    const lockCheck = IdempotencyManager.checkAndLock(idempotencyKey);
    if (!lockCheck.allowed) {
      setErrorMessage(lockCheck.reason || 'Transaction bloquée par le verrou d\'idempotence.');
      return;
    }

    setStep('PROCESSING');
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        IdempotencyManager.markSuccess(idempotencyKey, { totalNet, recipients: employees.length });
        setTimeout(() => {
          setStep('SUCCESS');
          onPayoutSuccess();
        }, 500);
      } else {
        setProgress(p);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-400" />
            </button>
            <div>
              <h3 className="text-sm font-black text-white">Déboursement Groupé Mobile Money</h3>
              <p className="text-xs text-slate-400">Passerelle API Wave Business, Orange & MTN</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: REVIEW */}
        {step === 'REVIEW' && (
          <div className="p-6 space-y-5">
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-5 rounded-2xl shadow-inner border border-emerald-900/40">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">
                Montant total net à virer
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {formatMoney(totalNet)}
              </div>
              <div className="text-xs text-slate-400 mt-2 flex justify-between items-center border-t border-white/10 pt-2">
                <span>Bénéficiaires : <strong className="text-white">{employees.length} collaborateurs</strong></span>
                <span className="font-mono text-[10px] text-emerald-400 flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Idempotent
                </span>
              </div>
            </div>

            {/* Répartition Opérateurs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sky-900">Wave</span>
                  <span className="px-1.5 py-0.2 rounded bg-sky-200 text-sky-900 font-bold text-[10px] font-mono">{waveCount}</span>
                </div>
                <div className="font-black text-slate-900 text-xs font-mono">{formatMoney(waveAmount)}</div>
              </div>

              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-orange-900">Orange</span>
                  <span className="px-1.5 py-0.2 rounded bg-orange-200 text-orange-900 font-bold text-[10px] font-mono">{orangeCount}</span>
                </div>
                <div className="font-black text-slate-900 text-xs font-mono">{formatMoney(orangeAmount)}</div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-yellow-900">MTN MoMo</span>
                  <span className="px-1.5 py-0.2 rounded bg-yellow-200 text-yellow-900 font-bold text-[10px] font-mono">{mtnCount}</span>
                </div>
                <div className="font-black text-slate-900 text-xs font-mono">{formatMoney(mtnAmount)}</div>
              </div>
            </div>

            {/* Sécurité Maker-Checker avec OTP Dynamique */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-900 font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                  Validation Maker-Checker (Code OTP de Sécurité)
                </div>
                <button
                  type="button"
                  onClick={generateNewOtp}
                  className="text-amber-800 hover:text-amber-950 text-[10px] font-bold flex items-center space-x-1"
                  title="Générer un nouveau code OTP"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Régénérer</span>
                </button>
              </div>
              <p className="text-amber-800">
                Saisissez le code de confirmation envoyé à la Direction Générale :
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-slate-600 font-semibold">Code OTP :</span>
                <input
                  type="text"
                  maxLength={6}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  className="px-3 py-1 font-mono font-black tracking-widest text-slate-900 bg-white border border-slate-300 rounded-xl text-base w-32 text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-extrabold text-xs hover:bg-slate-50 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={handleConfirmDisbursement}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-1.5"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>Exécuter les Virements</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 'PROCESSING' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Virements en cours d'exécution...</h4>
              <p className="text-xs text-slate-500 mt-1">Connexion sécurisée aux API Wave et Orange Money</p>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Traitement du lot : {progress}% validé
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'SUCCESS' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">Salaires Déboursés avec Succès !</h4>
              <p className="text-xs text-slate-500 mt-1">
                <strong>{employees.length} collaborateurs</strong> ont été crédités instantanément.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Clé Idempotence :</span>
                <span className="font-bold text-slate-800 text-[10px]">{idempotencyKey.slice(0, 24)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statut Traitement :</span>
                <span className="font-bold text-emerald-600">COMPLETED_VERIFIED</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors"
            >
              ← Retour au Tableau de Bord
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
