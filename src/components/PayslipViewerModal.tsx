import React, { useState } from 'react';
import { PayslipResult, EmployeeProfile, EnterpriseBranding } from '../engine/types';
import { X, Printer, Send, Check, ShieldCheck, ArrowLeft, Download, Award, CheckCircle2, Lock } from 'lucide-react';

interface PayslipViewerModalProps {
  payslip: PayslipResult | null;
  employee: EmployeeProfile | null;
  branding?: EnterpriseBranding;
  onClose: () => void;
}

export const PayslipViewerModal: React.FC<PayslipViewerModalProps> = ({
  payslip,
  employee,
  branding,
  onClose,
}) => {
  const [whatsappSent, setWhatsappSent] = useState(false);

  if (!payslip || !employee) return null;

  const formatMoney = (val: number = 0) => val.toLocaleString('fr-FR') + ' FCFA';

  const getBrandGradient = (theme?: string) => {
    switch (theme) {
      case 'BLUE': return 'from-blue-600 to-indigo-500';
      case 'AMBER': return 'from-amber-500 to-orange-500';
      case 'PURPLE': return 'from-purple-600 to-pink-500';
      case 'ROSE': return 'from-rose-600 to-red-500';
      default: return 'from-emerald-600 to-teal-500';
    }
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => {
      setWhatsappSent(false);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTaxAuthority = () => {
    switch (payslip.country) {
      case 'SN': return 'DGID • IPRES • CSS Sénégal';
      case 'CI': return 'DGI • CNPS • CMU Côte d\'Ivoire';
      case 'CM': return 'DGI • CNPS • FNE Cameroun';
      case 'BJ': return 'DGI • CNSS Bénin';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container Modal */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Sticky Header with PROMINENT "RETOUR" BUTTON */}
        <div className="px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            {/* BOUTON RETOUR PRINCIPAL EN HAUT */}
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all hover:-translate-x-0.5"
              title="Retourner à la liste des salariés (Échap)"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Retour</span>
            </button>

            <div className="h-5 w-px bg-white/10 hidden sm:block"></div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Bulletin Officiel
                </span>
                <span className="text-sm font-bold text-white">
                  {employee.firstName} {employee.lastName}
                </span>
                <span className="text-xs text-slate-400 hidden md:inline">
                  • {employee.jobTitle || 'Salarié'} ({payslip.periodLabel})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSendWhatsApp}
              className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm ${
                whatsappSent
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {whatsappSent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Envoyé !</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Payslip Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-50 flex-1 space-y-6">
          
          {/* Printable White Document Canvas */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/90 shadow-sm text-slate-800 print:p-0 print:border-none print:shadow-none relative overflow-hidden">
            
            {/* Watermark Sécurité Bancaire Discret */}
            <div className="absolute right-6 top-28 opacity-[0.03] pointer-events-none select-none font-black text-7xl rotate-[-25deg] text-slate-900">
              PAYLOCAL CONFORME
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getBrandGradient(branding?.brandColor)} text-white font-black text-xl flex items-center justify-center shadow-md`}>
                    {branding?.logoInitial || 'P'}
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900">
                      {branding?.companyName || 'GROUPE KALIA SARL'}
                    </h1>
                    <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      {branding?.tagline || 'Solutions de Sécurité, Services & Technologies'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                  <p>Siège : {branding?.headquarters || 'VDN Sacré-Cœur 3, Dakar (Sénégal)'}</p>
                  <p className="font-mono text-[11px]">
                    {branding?.legalId || 'NINEA : 009845722G3 • RCCM : SN-DKR-2022-B-1420'} • Téléphone : {branding?.phone || '+221 33 800 00 00'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-200">
                <div className="inline-block px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                  BULLETIN DE PAIE OFFICIEL
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">Période : {payslip.periodLabel}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Virement : <strong className="text-slate-800 font-bold">{payslip.paymentProvider}</strong> ({payslip.payoutPhone})
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Organismes : {getTaxAuthority()}
                </div>
              </div>
            </div>

            {/* Employee Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200 mb-6 text-xs">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Nom & Prénom</span>
                  <strong className="text-slate-900 font-extrabold text-sm">{payslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Poste & Fonction</span>
                  <strong className="text-emerald-800 font-bold text-xs">{employee.jobTitle || 'Salarié'}</strong>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <span>Matricule : <strong className="font-mono text-slate-800">{payslip.matricule}</strong></span>
                  <span>•</span>
                  <span>Statut : <strong className="text-slate-800">{employee.category}</strong></span>
                </div>
              </div>

              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-2 sm:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Situation Fiscale :</span>
                  <strong className="text-slate-900 font-bold">{employee.fiscalParts} part(s)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Enfants à charge :</span>
                  <strong className="text-slate-900 font-bold">{employee.childrenCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cadre Juridique :</span>
                  <strong className="text-slate-900 font-bold font-mono">Code du Travail • OHADA</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paiement Référence :</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-700">
                    ID-PAY-{payslip.employeeId.slice(-6)}
                  </span>
                </div>
              </div>
            </div>

            {/* Rubriques Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Rubrique / Désignation</th>
                    <th className="py-2.5 px-3 text-right">Base de Calcul</th>
                    <th className="py-2.5 px-3 text-right">Taux Salarial</th>
                    <th className="py-2.5 px-3 text-right">Montant Salarié</th>
                    <th className="py-2.5 px-3 text-right">Charges Patronales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                  
                  {/* Salaire de Base */}
                  <tr className="bg-white">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Salaire de Base Contractuel</td>
                    <td className="py-2.5 px-3 text-right font-mono">{formatMoney(payslip.baseSalary)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">{formatMoney(payslip.baseSalary)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                  </tr>

                  {/* Indemnité de transport */}
                  {employee.transportAllowance > 0 && (
                    <tr className="bg-slate-50/50">
                      <td className="py-2 px-3">
                        Indemnité Légale de Transport
                        <span className="text-[10px] text-emerald-700 block font-medium">Exonérée dans la limite légale</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{formatMoney(employee.transportAllowance)}</td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-800 font-mono">+{formatMoney(employee.transportAllowance)}</td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                  )}

                  {/* Primes imposables */}
                  {employee.otherTaxablePrimes > 0 && (
                    <tr className="bg-white">
                      <td className="py-2 px-3">Primes de Rendement / Poste</td>
                      <td className="py-2 px-3 text-right font-mono">{formatMoney(employee.otherTaxablePrimes)}</td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-800 font-mono">+{formatMoney(employee.otherTaxablePrimes)}</td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                  )}

                  {/* Sous-total Brut */}
                  <tr className="bg-slate-100/80 font-bold border-y border-slate-200">
                    <td className="py-2 px-3 text-slate-900 uppercase text-[10px] tracking-wider">SALAIRE BRUT TOTAL</td>
                    <td className="py-2 px-3 text-right font-mono">{formatMoney(payslip.grossSalary)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-mono font-extrabold">{formatMoney(payslip.grossSalary)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                  </tr>

                  {/* Cotisations Sociales */}
                  {payslip.socialContributions.map((contrib, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-800">{contrib.name}</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{formatMoney(contrib.baseAmount)}</td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        {contrib.employeeRate > 0 ? `${(contrib.employeeRate * 100).toFixed(1)}%` : '-'}
                      </td>
                      <td className="py-2 px-3 text-right text-red-600 font-mono font-medium">
                        {contrib.employeeAmount > 0 ? `-${formatMoney(contrib.employeeAmount)}` : '-'}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600 font-mono">
                        {contrib.employerAmount > 0 ? formatMoney(contrib.employerAmount) : '-'}
                      </td>
                    </tr>
                  ))}

                  {/* Impôts (IRPP) */}
                  {payslip.taxes.map((tax, idx) => (
                    <tr key={idx} className="bg-amber-50/40 hover:bg-amber-50/60 transition-colors">
                      <td className="py-2 px-3">
                        <strong className="text-amber-950 font-semibold">{tax.name}</strong>
                        {tax.details && <span className="text-[10px] text-amber-800 block">{tax.details}</span>}
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{formatMoney(tax.taxableBase)}</td>
                      <td className="py-2 px-3 text-right text-slate-500">Barème DGI</td>
                      <td className="py-2 px-3 text-right text-red-600 font-mono font-bold">
                        -{formatMoney(tax.amount)}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                  ))}

                  {/* Acompte déduit */}
                  {payslip.salaryAdvancesDeduction > 0 && (
                    <tr className="bg-purple-50/70 border-y border-purple-200">
                      <td className="py-2 px-3 font-bold text-purple-900" colSpan={3}>
                        💸 Acompte sur salaire déduit (Avance du 15 du mois)
                      </td>
                      <td className="py-2 px-3 text-right font-black text-purple-800 font-mono">
                        -{formatMoney(payslip.salaryAdvancesDeduction)}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">-</td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            {/* Total Block & Net à Verser Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl shadow-lg shadow-slate-950/20">
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between sm:justify-start sm:space-x-4">
                  <span className="text-slate-400">Total Cotisations Salarié :</span>
                  <strong className="text-white font-mono">{formatMoney(payslip.totalEmployeeSocial)}</strong>
                </div>
                <div className="flex justify-between sm:justify-start sm:space-x-4">
                  <span className="text-slate-400">Total Retenues Fiscales :</span>
                  <strong className="text-white font-mono">{formatMoney(payslip.totalTaxes)}</strong>
                </div>
                <div className="flex justify-between sm:justify-start sm:space-x-4">
                  <span className="text-slate-400">Charges Patronales :</span>
                  <strong className="text-white font-mono">{formatMoney(payslip.totalEmployerSocial)}</strong>
                </div>
                <div className="pt-2 text-[11px] text-emerald-300 font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Virement vérifié par Wave / Orange Money Payout API</span>
                </div>
              </div>
              
              <div className="text-left sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-extrabold block mb-1">
                  NET À PAYER (MOBILE MONEY)
                </span>
                <span className="text-3xl font-black text-white tracking-tight font-mono text-emerald-400">
                  {formatMoney(payslip.netToPay)}
                </span>
                <span className="block text-[10px] text-slate-400 mt-1">
                  Crédit automatique sur le compte Wave ({payslip.payoutPhone})
                </span>
              </div>
            </div>

            {/* Signatures & Certification Stamp Area */}
            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 text-xs text-slate-500">
              <div>
                <p className="font-bold text-slate-800">Pour l'Employeur :</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{branding?.customStampTitle || 'Direction Générale'}</p>
                <div className="mt-3 p-3 border-2 border-dashed border-emerald-600/70 rounded-xl bg-emerald-50/50 text-emerald-950 font-mono text-[9px] text-center space-y-0.5 shadow-sm">
                  <div className="font-black text-[10px] uppercase">{branding?.companyName || 'GROUPE KALIA SARL'}</div>
                  <div className="font-bold text-emerald-700">★ VU ET APPROUVÉ • BON POUR PAIEMENT ★</div>
                  <div className="text-[8px] text-slate-500">Signataire : {branding?.customStampTitle || 'Direction Générale'}</div>
                  <div className="text-[7px] text-emerald-600 font-bold">HORODATÉ PAR CLÉ SOUVERAINE TLS 1.3</div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">Pour le Salarié :</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Reçu pour solde de tout compte</p>
                <div className="mt-3 h-20 border border-dashed border-slate-300 rounded-xl p-2 flex flex-col items-center justify-center text-[10px] text-slate-400 space-y-1">
                  <span>[Quittance Numérique Certifiée]</span>
                  <span className="font-mono text-[9px] text-emerald-600 font-semibold">SMS : « Reçu de {branding?.smsSenderName || 'PAYLOCAL'} »</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* STICKY BOTTOM ACTION BAR WITH OBVIOUS "RETOUR" BUTTON */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          
          {/* BOUTON RETOUR TRÈS CLAIR AU BAS DE PAGE */}
          <button
            onClick={onClose}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all shadow-sm order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Retour au Tableau de Bord</span>
          </button>

          {/* Quick Actions Right */}
          <div className="flex items-center space-x-2.5 order-1 sm:order-2">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimer PDF</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all ${
                whatsappSent
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {whatsappSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Bulletin envoyé au salarié !</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer au salarié par WhatsApp</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
