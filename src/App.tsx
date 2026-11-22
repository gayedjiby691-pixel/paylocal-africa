import React, { useState, useMemo, useEffect } from 'react';
import { initialEmployees } from './data/mockEmployees';
import { EmployeeProfile, CountryCode, PayslipResult } from './engine/types';
import { PayrollCalculator } from './engine/payrollCalculator';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { EmployeeTable } from './components/EmployeeTable';
import { PayslipViewerModal } from './components/PayslipViewerModal';
import { SalaryAdvanceModal } from './components/SalaryAdvanceModal';
import { BulkPayoutModal } from './components/BulkPayoutModal';
import { EmployeeModal } from './components/EmployeeModal';
import { TaxDeclarationExportModal } from './components/TaxDeclarationExportModal';
import { SecurityCenterModal } from './components/SecurityCenterModal';
import { LeadPipelineModal } from './components/LeadPipelineModal';
import { ArchiveVaultModal } from './components/ArchiveVaultModal';
import { LoginModal, UserSession } from './components/LoginModal';
import { SecurityAuditService } from './security/auditLogger';
import { EnvValidator } from './security/env';
import { Sparkles, ShieldCheck, LogOut, User, Target } from 'lucide-react';

export const App: React.FC = () => {
  useEffect(() => {
    EnvValidator.validate();
  }, []);

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('SN'); // Défaut Sénégal (Dakar) car le fondateur y réside
  const [activePeriod, setActivePeriod] = useState<string>('Mai 2026');
  const [employees, setEmployees] = useState<EmployeeProfile[]>(initialEmployees);
  const [salaryAdvances, setSalaryAdvances] = useState<Map<string, number>>(new Map([
    ['emp-005', 40000], // Kouassi Koffi en Côte d'Ivoire a pris un acompte
    ['emp-002', 30000],
    ['emp-003', 25000],
  ]));
  const [isPayoutDone, setIsPayoutDone] = useState<boolean>(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  // Modals state
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<EmployeeProfile | null>(null);
  const [selectedAdvanceEmp, setSelectedAdvanceEmp] = useState<EmployeeProfile | null>(null);
  const [showBulkPayout, setShowBulkPayout] = useState<boolean>(false);
  const [showTaxExport, setShowTaxExport] = useState<boolean>(false);
  const [showNewEmployee, setShowNewEmployee] = useState<boolean>(false);
  const [showSecurityCenter, setShowSecurityCenter] = useState<boolean>(false);
  const [showLeadPipeline, setShowLeadPipeline] = useState<boolean>(false);
  const [showArchiveVault, setShowArchiveVault] = useState<boolean>(false);

  // Filtrer les salariés selon le pays sélectionné
  const currentEmployees = useMemo(() => {
    return employees.filter((emp) => emp.country === selectedCountry);
  }, [employees, selectedCountry]);

  const currentPayslips = useMemo(() => {
    const map = new Map<string, PayslipResult>();
    currentEmployees.forEach((emp) => {
      const advanceDeduction = salaryAdvances.get(emp.id) || 0;
      const result = PayrollCalculator.calculate(
        {
          employee: emp,
          salaryAdvancesDeduction: advanceDeduction,
        },
        activePeriod
      );
      map.set(emp.id, result);
    });
    return map;
  }, [currentEmployees, salaryAdvances, activePeriod]);

  const stats = useMemo(() => {
    let totalGross = 0;
    let totalNet = 0;
    let totalSocialEmployer = 0;
    let totalTaxes = 0;
    let totalAdvances = 0;

    currentEmployees.forEach((emp) => {
      const slip = currentPayslips.get(emp.id);
      if (slip) {
        totalGross += slip.grossSalary;
        totalNet += slip.netToPay;
        totalSocialEmployer += slip.totalEmployerSocial;
        totalTaxes += slip.totalTaxes;
        totalAdvances += slip.salaryAdvancesDeduction;
      }
    });

    return {
      totalEmployees: currentEmployees.length,
      totalGrossSalary: totalGross,
      totalNetToPay: totalNet,
      totalSocialEmployer,
      totalTaxes,
      totalAdvancesDeducted: totalAdvances,
    };
  }, [currentEmployees, currentPayslips]);

  const handleSaveAdvance = (employeeId: string, amount: number) => {
    setSalaryAdvances((prev) => {
      const next = new Map(prev);
      next.set(employeeId, amount);
      return next;
    });

    const emp = employees.find((e) => e.id === employeeId);
    if (emp) {
      SecurityAuditService.logAction(
        currentUser?.email || 'session@kalia.ci',
        'ADVANCE_RECORDED',
        `Acompte de ${amount.toLocaleString('fr-FR')} FCFA validé pour ${emp.firstName} ${emp.lastName}.`
      );
    }
  };

  const handleAddEmployee = (newEmp: EmployeeProfile) => {
    setEmployees((prev) => [newEmp, ...prev]);
    SecurityAuditService.logAction(
      currentUser?.email || 'session@kalia.ci',
      'EMPLOYEE_CREATED',
      `Nouveau collaborateur créé : ${newEmp.firstName} ${newEmp.lastName} (${newEmp.country}).`
    );
  };

  const handlePayoutSuccess = () => {
    setIsPayoutDone(true);
    SecurityAuditService.logAction(
      currentUser?.email || 'session@kalia.ci',
      'PAYOUT_INITIATED',
      `Déboursement groupé de masse exécuté avec succès pour ${currentEmployees.length} salariés.`,
      'CRITICAL'
    );
  };

  const handleLogout = () => {
    SecurityAuditService.logAction(
      currentUser?.email || 'session@kalia.ci',
      'DATA_EXPORTED',
      'Déconnexion sécurisée de la session utilisateur.',
      'INFO'
    );
    setCurrentUser(null);
  };

  const getCountryBannerTitle = (code: CountryCode) => {
    switch (code) {
      case 'SN': return 'Sénégal • IPRES (Retraite RG & Cadre), CSS (Prestations & Accident), IPM & IRPP';
      case 'CI': return 'Côte d\'Ivoire (Abidjan) • CNPS (Retraite & Prestations), CMU (1 000 FCFA), FDFP, IS (1.5%), CN & IGR';
      case 'CM': return 'Cameroun (CEMAC) • CNPS (Plafond 750k), Crédit Foncier (CFC), FNE, IRPP & CAC (10%)';
      case 'BJ': return 'Bénin • CNSS (3.6% / 15.4%), VPS (4%) & IPTS (Barème DGI)';
    }
  };

  if (!currentUser) {
    return (
      <LoginModal
        onLogin={(session) => {
          setCurrentUser(session);
          setSelectedCountry(session.country);
          SecurityAuditService.logAction(
            session.email,
            'DATA_EXPORTED',
            `Connexion sécurisée réussie en tant que ${session.role} (${session.name}). Espace confiné au pays : ${session.country}`,
            'INFO'
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Barre Supérieure Utilisateur Connecté */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Session Sécurisée TLS 1.3</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline font-mono">Tenant: {currentUser.organization}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowLeadPipeline(true)}
            className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-bold transition-colors mr-2"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Prospects Qualifiés ({selectedCountry === 'SN' ? '10' : '12'})</span>
          </button>

          <div className="flex items-center space-x-1.5 text-white font-medium">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentUser.name}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              {currentUser.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-slate-400 hover:text-red-400 font-semibold transition-colors pl-2 border-l border-slate-800"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Navigation & Header */}
      <Header
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          setIsPayoutDone(false);
        }}
        allowedCountries={currentUser.allowedCountries}
        organizationName={currentUser.organization}
        activePeriod={activePeriod}
        onOpenBulkPayout={() => setShowBulkPayout(true)}
        onOpenTaxExport={() => setShowTaxExport(true)}
        onOpenNewEmployee={() => setShowNewEmployee(true)}
        onOpenSecurityCenter={() => setShowSecurityCenter(true)}
        onOpenLeadPipeline={() => setShowLeadPipeline(true)}
        onOpenArchives={() => setShowArchiveVault(true)}
        isPayoutDone={isPayoutDone}
        isPrivacyMode={isPrivacyMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Conseil Pro avec raccourci Prospection */}
        <div className="mb-6 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl shadow-slate-950/10 border border-emerald-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </span>
              <h1 className="text-base font-extrabold text-white tracking-tight">
                Paie conforme & Déboursement Instantané • {getCountryBannerTitle(selectedCountry)}
              </h1>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {selectedCountry === 'SN'
                ? 'Campagne territoriale prête : 10 entreprises et cabinets qualifiés à Dakar avec coordonnées directes WhatsApp.'
                : 'Campagne territoriale prête : 12 entreprises et cabinets qualifiés à Abidjan avec coordonnées directes WhatsApp.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 text-xs shrink-0 relative z-10">
            <button
              onClick={() => setShowLeadPipeline(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center space-x-2 hover:scale-[1.02]"
            >
              <Target className="w-4 h-4" />
              <span>Ouvrir Prospects ({selectedCountry === 'SN' ? '10' : '12'})</span>
            </button>
            <button
              onClick={() => setShowBulkPayout(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all hover:bg-white/15"
            >
              Simuler Payout
            </button>
          </div>
        </div>

        {/* Cartes KPI */}
        <StatsCards
          totalEmployees={stats.totalEmployees}
          totalGrossSalary={stats.totalGrossSalary}
          totalNetToPay={stats.totalNetToPay}
          totalSocialEmployer={stats.totalSocialEmployer}
          totalTaxes={stats.totalTaxes}
          totalAdvancesDeducted={stats.totalAdvancesDeducted}
          isPrivacyMode={isPrivacyMode}
        />

        {/* Tableau des Salariés */}
        <EmployeeTable
          employees={currentEmployees}
          payslips={currentPayslips}
          salaryAdvances={salaryAdvances}
          onSelectEmployeeForPayslip={setSelectedPayslipEmp}
          onOpenAdvanceModal={setSelectedAdvanceEmp}
          isPayoutDone={isPayoutDone}
          isPrivacyMode={isPrivacyMode}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">PayLocal Africa © 2026 — Plateforme B2B de Paie & Déboursement Mobile Money Multi-Pays</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Sécurité certifiée : Cloisonnement RLS • Idempotence • HMAC-SHA256 • Conforme CDP / ARTCI / BCEAO
        </p>
      </footer>

      {/* Modals */}
      {selectedPayslipEmp && (
        <PayslipViewerModal
          employee={selectedPayslipEmp}
          payslip={currentPayslips.get(selectedPayslipEmp.id) || null}
          onClose={() => setSelectedPayslipEmp(null)}
        />
      )}

      {selectedAdvanceEmp && (
        <SalaryAdvanceModal
          employee={selectedAdvanceEmp}
          currentAdvance={salaryAdvances.get(selectedAdvanceEmp.id) || 0}
          onSaveAdvance={handleSaveAdvance}
          onClose={() => setSelectedAdvanceEmp(null)}
        />
      )}

      {showBulkPayout && (
        <BulkPayoutModal
          employees={currentEmployees}
          payslips={currentPayslips}
          onClose={() => setShowBulkPayout(false)}
          onPayoutSuccess={handlePayoutSuccess}
        />
      )}

      {showTaxExport && (
        <TaxDeclarationExportModal
          country={selectedCountry}
          periodLabel={activePeriod}
          payslips={Array.from(currentPayslips.values())}
          onClose={() => setShowTaxExport(false)}
        />
      )}

      {showNewEmployee && (
        <EmployeeModal
          country={selectedCountry}
          onSave={handleAddEmployee}
          onClose={() => setShowNewEmployee(false)}
        />
      )}

      {showSecurityCenter && (
        <SecurityCenterModal
          isPrivacyMode={isPrivacyMode}
          onTogglePrivacyMode={() => setIsPrivacyMode(!isPrivacyMode)}
          onClose={() => setShowSecurityCenter(false)}
        />
      )}

      {showLeadPipeline && (
        <LeadPipelineModal
          userCountry={selectedCountry}
          onClose={() => setShowLeadPipeline(false)}
        />
      )}

      {showArchiveVault && (
        <ArchiveVaultModal
          country={selectedCountry}
          onClose={() => setShowArchiveVault(false)}
        />
      )}

    </div>
  );
};
