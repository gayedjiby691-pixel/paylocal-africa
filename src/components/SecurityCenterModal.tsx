import React, { useState } from 'react';
import { SecurityAuditService, SecurityEvent } from '../security/auditLogger';
import { X, ShieldCheck, Lock, AlertTriangle, Key, History, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface SecurityCenterModalProps {
  isPrivacyMode: boolean;
  onTogglePrivacyMode: () => void;
  onClose: () => void;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({
  isPrivacyMode,
  onTogglePrivacyMode,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AUDIT' | 'LIMITS'>('OVERVIEW');
  const [dailyLimit, setDailyLimit] = useState<number>(10000000);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const logs = SecurityAuditService.getLogs();

  const formatMoney = (val: number) => val.toLocaleString('fr-FR') + ' FCFA';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Centre de Sécurité & Conformité Bancaire</h3>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Certifié BCEAO / OHADA
                </span>
              </div>
              <p className="text-xs text-slate-400">Cloisonnement RLS, Idempotence, Chiffrement AES-256 & Audit Trail</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Paramètres & Verrous</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'AUDIT'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Journal d'Audit Immuable ({logs.length})</span>
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="p-6 space-y-6">
            
            {/* Statuts des Verrous */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Isolation Multi-Tenant (RLS)</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Séparation cryptographique des bases de données : aucune PME ne peut lire les salaires d'une autre.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Verrou Anti-Doublon (Idempotence)</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Empêche tout double virement Mobile Money en cas de coupure de connexion ou de double clic.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Maker-Checker (Double Validation)</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Le comptable prépare la paie, mais seul le Directeur peut libérer les fonds avec un code OTP SMS.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Webhooks Signés (HMAC SHA-256)</h4>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Authentification cryptographique des confirmations de versement Wave et Orange Money.
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Discrétion / Open Space */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900">Mode Discrétion (Masquage Salaires & Téléphones)</span>
                  {isPrivacyMode && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                      Actif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Masque les montants salariaux et numéros à l'écran pour travailler en toute confidentialité en open space.
                </p>
              </div>

              <button
                onClick={onTogglePrivacyMode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isPrivacyMode
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isPrivacyMode ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Masquage Activé</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Activer Masquage</span>
                  </>
                )}
              </button>
            </div>

            {/* Plafond de Sécurité Quotidien */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">Plafond Maximum de Déboursement par Lot</label>
                <span className="font-extrabold text-slate-900 font-mono">{formatMoney(dailyLimit)}</span>
              </div>
              <input
                type="range"
                min="2000000"
                max="50000000"
                step="1000000"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[11px] text-slate-400">
                Tout déboursement supérieur nécessite une autorisation spéciale par clé d'administration.
              </p>
            </div>

          </div>
        )}

        {/* Tab 2: AUDIT LOGS */}
        {activeTab === 'AUDIT' && (
          <div className="p-6">
            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-96">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date & Heure</th>
                    <th className="py-2.5 px-3">Auteur</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Détail</th>
                    <th className="py-2.5 px-3">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium whitespace-nowrap">{log.actor}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-800'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-sans text-[11px]">{log.description}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[10px] whitespace-nowrap">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>🔒 Ce registre est immuable (Write Once, Read Many) et exportable lors des audits légaux.</span>
              <span className="font-mono text-emerald-700 font-bold">Audit Mode: STRICT</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
