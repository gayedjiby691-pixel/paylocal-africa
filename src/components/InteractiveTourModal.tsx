import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  ShieldCheck, 
  SendHorizontal, 
  FileText, 
  FolderArchive, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Smartphone,
  Landmark
} from 'lucide-react';
import { CountryCode } from '../engine/types';

export interface TourStep {
  id: number;
  badge: string;
  title: string;
  description: string;
  actionLabel: string;
  featureTarget: 'PORTAL' | 'EMPLOYEES' | 'PAYSLIP' | 'PAYOUT' | 'ARCHIVES' | 'FINAL';
  keyStat?: { label: string; value: string };
}

interface InteractiveTourModalProps {
  country: CountryCode;
  onClose: () => void;
  onOpenBulkPayout: () => void;
  onOpenPayslipSample: () => void;
  onOpenArchives: () => void;
  onOpenTaxExport: () => void;
  onOpenDemoRequest: () => void;
}

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({
  country,
  onClose,
  onOpenBulkPayout,
  onOpenPayslipSample,
  onOpenArchives,
  onOpenTaxExport,
  onOpenDemoRequest,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(true);
  const [progress, setProgress] = useState(0);

  const steps: TourStep[] = [
    {
      id: 1,
      badge: 'Étape 1 sur 5 • Sécurité & Souveraineté',
      title: 'Console Territoriale Confinée & Sécurisée',
      description: 'Chaque entreprise est confinée à son propre territoire légal (Dakar ou Abidjan) sans fuite de données transfrontalières. Authentification bancaire par OTP à 6 chiffres et chiffrement TLS 1.3.',
      actionLabel: 'Découvrir la gestion des salariés →',
      featureTarget: 'EMPLOYEES',
      keyStat: { label: 'Conformité Réglementaire', value: 'BCEAO & OHADA' },
    },
    {
      id: 2,
      badge: 'Étape 2 sur 5 • Automatisation OHADA',
      title: 'Calcul de Paie & Acomptes Wave en 1 Clic',
      description: 'Fini les calculs manuels sur Excel ! Un salarié demande un acompte du 15 sur Wave ? Vous le validez en un clic. Il est déduit automatiquement sur son net de fin de mois sans aucune erreur.',
      actionLabel: 'Voir un bulletin officiel certifié →',
      featureTarget: 'PAYSLIP',
      keyStat: { label: 'Gain de temps comptable', value: '92% plus rapide' },
    },
    {
      id: 3,
      badge: 'Étape 3 sur 5 • Conformité Salariale',
      title: 'Bulletins de Paie avec Filigrane Légal',
      description: 'Chaque bulletin intègre le calcul exact des cotisations IPRES retraite (générale et cadres), de la CSS (accidents et prestations) et du barème progressif d\'impôt IRPP au franc près, avec zone de stamp officiel.',
      actionLabel: 'Tester le déboursement groupé de masse →',
      featureTarget: 'PAYOUT',
      keyStat: { label: 'Risque d\'erreur de calcul', value: '0.00% garanti' },
    },
    {
      id: 4,
      badge: 'Étape 4 sur 5 • Le Clou du Spectacle',
      title: 'Virement de 4 125 000 FCFA sur Wave en 3s',
      description: 'Le moment magique : regroupez tous les comptes Wave et Orange Money de vos salariés. En 1 clic sécurisé avec clé d\'idempotence anti-doublon, tous les téléphones reçoivent leur salaire en simultané par SMS.',
      actionLabel: 'Découvrir le coffre-fort fiscal & archives →',
      featureTarget: 'ARCHIVES',
      keyStat: { label: 'Déboursement groupé', value: '3 secondes chrono' },
    },
    {
      id: 5,
      badge: 'Étape 5 sur 5 • Fiscalité & Archivage',
      title: 'État 102 DGID & Coffre-Fort Légal 10 Ans',
      description: 'PayLocal génère en 1 clic l\'État 102 officiel exigé par la DGID pour votre télé-déclaration Etax, et archive chaque clôture mensuelle sous scellé cryptographique SHA-256 pendant 10 ans (Code du Travail Art. L.114).',
      actionLabel: 'Demander un pilote gratuit pour mon entreprise ✨',
      featureTarget: 'FINAL',
      keyStat: { label: 'Conservation légale', value: '10 ans inaltérable' },
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Lecture automatique de la visite guidée (8 secondes par étape)
  useEffect(() => {
    if (!isPlayingAuto) return;
    const intervalTime = 8000;
    const tickTime = 100;
    const stepIncrement = (tickTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex((curr) => curr + 1);
            return 0;
          } else {
            setIsPlayingAuto(false);
            return 100;
          }
        }
        return prev + stepIncrement;
      });
    }, tickTime);

    return () => clearInterval(timer);
  }, [isPlayingAuto, currentStepIndex, steps.length]);

  const handleStepChange = (index: number) => {
    setCurrentStepIndex(index);
    setProgress(0);
  };

  const executeCurrentStepAction = () => {
    switch (currentStep.featureTarget) {
      case 'PAYSLIP':
        onOpenPayslipSample();
        break;
      case 'PAYOUT':
        onOpenBulkPayout();
        break;
      case 'ARCHIVES':
        onOpenArchives();
        break;
      case 'FINAL':
        onClose();
        onOpenDemoRequest();
        break;
      default:
        if (currentStepIndex < steps.length - 1) {
          handleStepChange(currentStepIndex + 1);
        }
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-950 text-white rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden shadow-emerald-500/10 backdrop-blur-xl">
        
        {/* Barre de progression fluide */}
        <div className="h-1.5 w-full bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header Carte Démo */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                  {currentStep.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white tracking-tight">
                Démonstration Interactive Guidée
              </h4>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title={isPlayingAuto ? 'Mettre en pause' : 'Reprendre la lecture automatique'}
            >
              {isPlayingAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Quitter la démonstration"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contenu de l'étape */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-white leading-tight">
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Statistique clé / Preuve institutionnelle */}
          {currentStep.keyStat && (
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium text-[11px]">{currentStep.keyStat.label}</span>
              <span className="font-mono font-black text-emerald-400 text-xs sm:text-sm">
                {currentStep.keyStat.value}
              </span>
            </div>
          )}

          {/* Bouton d'action interactif */}
          <button
            onClick={executeCurrentStepAction}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 group hover:scale-[1.01]"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer Navigation Pas-à-Pas */}
        <div className="px-5 py-3 bg-white/[0.03] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleStepChange(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentStepIndex === idx 
                    ? 'w-6 bg-emerald-400 ring-2 ring-emerald-400/30' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Aller à l'étape ${s.id}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStepChange(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono text-slate-400">
              {currentStepIndex + 1} / {steps.length}
            </span>

            <button
              onClick={() => handleStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === steps.length - 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
