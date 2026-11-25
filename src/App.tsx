import React, { useState, useMemo, useEffect } from 'react';
import { initialEmployees } from './data/mockEmployees';
import { EmployeeProfile, CountryCode, PayslipResult, EnterpriseBranding } from './engine/types';
import { PayrollCalculator } from './engine/payrollCalculator';
import { defaultBrandings } from './data/defaultBrandings';
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
import { InteractiveTourModal } from './components/InteractiveTourModal';
import { RequestDemoModal } from './components/RequestDemoModal';
import { EnterpriseBrandingModal } from './components/EnterpriseBrandingModal';
import { LoginModal, UserSession } from './components/LoginModal';
import { SecurityAuditService } from './security/auditLogger';
import { EnvValidator } from './security/env';
import { Sparkles, ShieldCheck, LogOut, User, Target, Palette } from 'lucide-react';

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
  const [showInteractiveTour, setShowInteractiveTour] = useState<boolean>(false);
  const [showDemoRequest, setShowDemoRequest] = useState<boolean>(false);
  const [showBrandingModal, setShowBrandingModal] = useState<boolean>(false);

  // La « Touche » Sur-Mesure de l'entreprise (Marque, Logo, Couleurs, Cachet)
  const [branding, setBranding] = useState<EnterpriseBranding>(() => {
    return defaultBrandings.SN;
  });

  useEffect(() => {
    const saved = localStorage.getItem(`paylocal_branding_${selectedCountry}`);
    if (saved) {
      try {
        setBranding(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setBranding(defaultBrandings[selectedCountry] || defaultBrandings.SN);
  }, [selectedCountry]);

  const handleSaveBranding = (updated: EnterpriseBranding) => {
    setBranding(updated);
    localStorage.setItem(`paylocal_branding_${selectedCountry}`, JSON.stringify(updated));
    SecurityAuditService.logAction(
      currentUser?.email || 'session@paylocal.africa',
      'BRANDING_UPDATED',
      `Touche sur-mesure personnalisée enregistrée pour l'entreprise : ${updated.companyName} (Thème: ${updated.brandColor}).`,
      'INFO'
    );
  };

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
    const sovereignEmp: EmployeeProfile = {
      ...newEmp,
      country: selectedCountry,
    };
    setEmployees((prev) => [sovereignEmp, ...prev]);
    SecurityAuditService.logAction(
      currentUser?.email || 'session@kalia.ci',
      'EMPLOYEE_CREATED',
      `Nouveau collaborateur créé sur le territoire souverain ${sovereignEmp.country} : ${sovereignEmp.firstName} ${sovereignEmp.lastName}.`
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
        onStartInteractiveTour={() => setShowInteractiveTour(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white w-full overflow-x-hidden">
      
      {/* Barre Supérieure Utilisateur Connecté */}
      <div className="bg-slate-900 text-slate-300 text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-800 w-full overflow-hidden">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] sm:text-xs">TLS 1.3</span>
          </div>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline font-mono truncate text-[11px] max-w-[200px] lg:max-w-xs">
            Tenant: {branding.companyName || currentUser.organization}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 text-white font-medium text-xs">
            <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{currentUser.name.split(' ')[0]}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
              {currentUser.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-slate-400 hover:text-red-400 font-semibold transition-colors pl-2 border-l border-slate-800 text-xs"
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
          if (c !== currentUser.country) {
            SecurityAuditService.logAction(
              currentUser.email,
              'DATA_EXPORTED',
              `ALERTE SÉCURITÉ : Tentative de basculement non autorisé vers le pays ${c} bloquée par l'isolation souveraine.`,
              'CRITICAL'
            );
            return;
          }
          setSelectedCountry(currentUser.country);
          setIsPayoutDone(false);
        }}
        allowedCountries={currentUser.allowedCountries}
        organizationName={branding.companyName || currentUser.organization}
        branding={branding}
        onOpenBranding={() => setShowBrandingModal(true)}
        activePeriod={activePeriod}
        onOpenBulkPayout={() => setShowBulkPayout(true)}
        onOpenTaxExport={() => setShowTaxExport(true)}
        onOpenNewEmployee={() => setShowNewEmployee(true)}
        onOpenSecurityCenter={() => setShowSecurityCenter(true)}
        onOpenLeadPipeline={() => setShowLeadPipeline(true)}
        onOpenArchives={() => setShowArchiveVault(true)}
        onOpenTour={() => setShowInteractiveTour(true)}
        isPayoutDone={isPayoutDone}
        isPrivacyMode={isPrivacyMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Conseil Pro avec raccourci Prospection & Démo */}
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

          <div className="flex flex-wrap items-center gap-2 text-xs relative z-10">
            <button
              onClick={() => setShowBrandingModal(true)}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-extrabold px-3 py-2.5 rounded-xl border border-purple-500/40 transition-all flex items-center space-x-1.5 shadow-sm hover:scale-[1.02]"
              title="Personnaliser la touche visuelle de l'entreprise (Logo, Couleurs, Cachet officiel)"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Ma Touche</span>
            </button>
            <button
              onClick={() => setShowInteractiveTour(true)}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold px-3.5 py-2.5 rounded-xl border border-emerald-500/40 transition-all flex items-center space-x-1.5 shadow-sm hover:scale-[1.02]"
              title="Lancer la démonstration interactive guidée"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>🎬 Démo Guidée</span>
            </button>
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
          onOpenNewEmployee={() => setShowNewEmployee(true)}
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
          branding={branding}
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

      {showInteractiveTour && (
        <InteractiveTourModal
          country={selectedCountry}
          onClose={() => setShowInteractiveTour(false)}
          onOpenBulkPayout={() => {
            setShowInteractiveTour(false);
            setShowBulkPayout(true);
          }}
          onOpenPayslipSample={() => {
            setShowInteractiveTour(false);
            if (currentEmployees.length > 0) {
              setSelectedPayslipEmp(currentEmployees[0]);
            }
          }}
          onOpenArchives={() => {
            setShowInteractiveTour(false);
            setShowArchiveVault(true);
          }}
          onOpenTaxExport={() => {
            setShowInteractiveTour(false);
            setShowTaxExport(true);
          }}
          onOpenDemoRequest={() => {
            setShowInteractiveTour(false);
            setShowDemoRequest(true);
          }}
        />
      )}

      {showDemoRequest && (
        <RequestDemoModal onClose={() => setShowDemoRequest(false)} />
      )}

      {showBrandingModal && (
        <EnterpriseBrandingModal
          country={selectedCountry}
          currentBranding={branding}
          onSave={handleSaveBranding}
          onClose={() => setShowBrandingModal(false)}
        />
      )}

    </div>
  );
};
