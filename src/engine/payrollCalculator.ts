// ==============================================================================
// PAYLOCAL - Moteur de Calcul Fiscal & Social Multi-Pays (OHADA / UEMOA / CEMAC)
// ==============================================================================

import { EmployeeProfile, PayrollInput, PayslipResult, SocialContribution, TaxDeduction } from './types';

export class PayrollCalculator {
  
  /**
   * Calcule le bulletin de paie complet selon le pays et les paramètres
   */
  public static calculate(input: PayrollInput, periodLabel: string = 'Courant'): PayslipResult {
    const { employee } = input;
    
    switch (employee.country) {
      case 'SN':
        return this.calculateSenegal(input, periodLabel);
      case 'CI':
        return this.calculateCoteDivoire(input, periodLabel);
      case 'CM':
        return this.calculateCameroon(input, periodLabel);
      case 'BJ':
        return this.calculateBenin(input, periodLabel);
      default:
        return this.calculateSenegal(input, periodLabel);
    }
  }

  // ----------------------------------------------------------------------------
  // 🇸🇳 SÉNÉGAL (CGI & Code de la Sécurité Sociale - UEMOA)
  // ----------------------------------------------------------------------------
  private static calculateSenegal(input: PayrollInput, periodLabel: string): PayslipResult {
    const { employee, overtimeAmount = 0, exceptionalBonus = 0, salaryAdvancesDeduction = 0, absenceDeduction = 0 } = input;
    
    const MAX_EXEMPT_TRANSPORT = 20820;
    const exemptTransport = Math.min(employee.transportAllowance, MAX_EXEMPT_TRANSPORT);
    const taxableTransport = Math.max(0, employee.transportAllowance - MAX_EXEMPT_TRANSPORT);
    
    const taxableAllowances = employee.housingAllowance + employee.functionAllowance + employee.otherTaxablePrimes + taxableTransport;
    const exemptAllowances = exemptTransport;
    
    const grossSalary = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances + exemptAllowances - absenceDeduction);
    const grossTaxableForSocial = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances - absenceDeduction);
    
    const socialContributions: SocialContribution[] = [];
    
    // IPRES Régime Général (Plafond 432 000 FCFA/mois)
    const ipresRgBase = Math.min(grossTaxableForSocial, 432000);
    const ipresRgEmployee = Math.round(ipresRgBase * 0.056);
    const ipresRgEmployer = Math.round(ipresRgBase * 0.084);
    socialContributions.push({
      name: 'IPRES Régime Général (Retraite)',
      baseAmount: ipresRgBase,
      employeeRate: 0.056,
      employeeAmount: ipresRgEmployee,
      employerRate: 0.084,
      employerAmount: ipresRgEmployer,
    });

    // IPRES Cadre Régime Complémentaire (432 000 à 1 296 000 FCFA)
    if (employee.category === 'CADRE' && grossTaxableForSocial > 432000) {
      const ipresCadreBase = Math.min(grossTaxableForSocial - 432000, 1296000 - 432000);
      const ipresCadreEmployee = Math.round(ipresCadreBase * 0.024);
      const ipresCadreEmployer = Math.round(ipresCadreBase * 0.036);
      socialContributions.push({
        name: 'IPRES Cadre (Complémentaire)',
        baseAmount: ipresCadreBase,
        employeeRate: 0.024,
        employeeAmount: ipresCadreEmployee,
        employerRate: 0.036,
        employerAmount: ipresCadreEmployer,
      });
    }

    // CSS (Prestations Familiales & Accident)
    const cssPlafonneeBase = Math.min(grossTaxableForSocial, 63000);
    const cssFamilyEmployer = Math.round(cssPlafonneeBase * 0.07);
    const cssAccidentEmployer = Math.round(cssPlafonneeBase * 0.03);
    socialContributions.push({
      name: 'CSS (Prestations & Accident du Travail)',
      baseAmount: cssPlafonneeBase,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.10,
      employerAmount: cssFamilyEmployer + cssAccidentEmployer,
    });

    // IPM (Santé)
    const ipmBase = Math.min(grossTaxableForSocial, 250000);
    const ipmEmployee = Math.round(ipmBase * 0.03);
    const ipmEmployer = Math.round(ipmBase * 0.03);
    socialContributions.push({
      name: 'IPM (Santé / Maladie)',
      baseAmount: ipmBase,
      employeeRate: 0.03,
      employeeAmount: ipmEmployee,
      employerRate: 0.03,
      employerAmount: ipmEmployer,
    });

    // CFCE (Patronal 3%)
    const cfceEmployer = Math.round(grossTaxableForSocial * 0.03);
    socialContributions.push({
      name: 'CFCE (Contribution Patronale)',
      baseAmount: grossTaxableForSocial,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.03,
      employerAmount: cfceEmployer,
    });

    const totalEmployeeSocial = socialContributions.reduce((sum, item) => sum + item.employeeAmount, 0);
    const totalEmployerSocial = socialContributions.reduce((sum, item) => sum + item.employerAmount, 0);

    // Fiscalité IRPP Sénégal
    const brutFiscal = Math.max(0, grossTaxableForSocial - totalEmployeeSocial);
    const abattementFraisPro = Math.min(Math.round(brutFiscal * 0.30), 75000);
    const baseImposableIR = Math.max(0, brutFiscal - abattementFraisPro);
    const irTheorique = this.computeSenegalProgressiveTax(baseImposableIR);
    const reductionRate = this.getSenegalFamilyReductionRate(employee.fiscalParts);
    const finalIRPP = Math.max(0, Math.round(irTheorique * (1 - reductionRate)));

    const taxes: TaxDeduction[] = [
      {
        name: 'IRPP (Impôt sur le Revenu)',
        taxableBase: baseImposableIR,
        amount: finalIRPP,
        details: `Réduction famille : ${(reductionRate * 100).toFixed(0)}% (${employee.fiscalParts} part(s))`,
      }
    ];

    const netSalaryBeforeAdvances = grossSalary - totalEmployeeSocial - finalIRPP;
    const netToPay = Math.max(0, netSalaryBeforeAdvances - salaryAdvancesDeduction);
    const totalCostToCompany = grossSalary + totalEmployerSocial;

    return {
      employeeId: employee.id,
      matricule: employee.matricule,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      periodLabel,
      country: 'SN',
      currency: 'FCFA',
      baseSalary: employee.baseSalary,
      overtimeAmount,
      taxableAllowances,
      exemptAllowances,
      grossSalary,
      socialContributions,
      totalEmployeeSocial,
      totalEmployerSocial,
      taxableGrossSalary: baseImposableIR,
      taxes,
      totalTaxes: finalIRPP,
      salaryAdvancesDeduction,
      netSalaryBeforeAdvances,
      netToPay,
      totalCostToCompany,
      paymentProvider: employee.paymentProvider,
      payoutPhone: employee.payoutPhone,
    };
  }

  // ----------------------------------------------------------------------------
  // 🇨🇮 CÔTE D'IVOIRE (CNPS, CMU, IS, CN, IGR - UEMOA)
  // ----------------------------------------------------------------------------
  private static calculateCoteDivoire(input: PayrollInput, periodLabel: string): PayslipResult {
    const { employee, overtimeAmount = 0, exceptionalBonus = 0, salaryAdvancesDeduction = 0, absenceDeduction = 0 } = input;
    
    const MAX_EXEMPT_TRANSPORT = 30000;
    const exemptTransport = Math.min(employee.transportAllowance, MAX_EXEMPT_TRANSPORT);
    const taxableTransport = Math.max(0, employee.transportAllowance - MAX_EXEMPT_TRANSPORT);
    
    const taxableAllowances = employee.housingAllowance + employee.functionAllowance + employee.otherTaxablePrimes + taxableTransport;
    const exemptAllowances = exemptTransport;
    const grossSalary = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances + exemptAllowances - absenceDeduction);
    const grossTaxableForSocial = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances - absenceDeduction);

    const socialContributions: SocialContribution[] = [];

    // CNPS Retraite (Plafond: 1 647 315 FCFA)
    const cnpsRetraiteBase = Math.min(grossTaxableForSocial, 1647315);
    const cnpsRetraiteEmployee = Math.round(cnpsRetraiteBase * 0.063);
    const cnpsRetraiteEmployer = Math.round(cnpsRetraiteBase * 0.077);
    socialContributions.push({
      name: 'CNPS Retraite',
      baseAmount: cnpsRetraiteBase,
      employeeRate: 0.063,
      employeeAmount: cnpsRetraiteEmployee,
      employerRate: 0.077,
      employerAmount: cnpsRetraiteEmployer,
    });

    // CNPS Prestations Familiales & Accident du travail
    const cnpsPlafonneeBase = Math.min(grossTaxableForSocial, 70000);
    socialContributions.push({
      name: 'CNPS Prestations & Accident du Travail',
      baseAmount: cnpsPlafonneeBase,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.0875,
      employerAmount: Math.round(cnpsPlafonneeBase * 0.0875),
    });

    // CMU (Couverture Maladie Universelle)
    socialContributions.push({
      name: 'CMU (Assurance Maladie)',
      baseAmount: grossTaxableForSocial,
      employeeRate: 0,
      employeeAmount: 1000,
      employerRate: 0,
      employerAmount: 1000,
    });

    // FDFP (Formation Continue)
    socialContributions.push({
      name: 'FDFP (Formation Continue & Apprentissage)',
      baseAmount: grossTaxableForSocial,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.018,
      employerAmount: Math.round(grossTaxableForSocial * 0.018),
    });

    const totalEmployeeSocial = socialContributions.reduce((sum, item) => sum + item.employeeAmount, 0);
    const totalEmployerSocial = socialContributions.reduce((sum, item) => sum + item.employerAmount, 0);

    // Fiscalité Ivoirienne (IS, CN, IGR)
    const baseIS = Math.round(grossTaxableForSocial * 0.80);
    const impotIS = Math.round(baseIS * 0.015);

    let impotCN = 0;
    if (baseIS > 50000 && baseIS <= 130000) {
      impotCN = Math.round((baseIS - 50000) * 0.015);
    } else if (baseIS > 130000 && baseIS <= 200000) {
      impotCN = Math.round(1200 + (baseIS - 130000) * 0.05);
    } else if (baseIS > 200000) {
      impotCN = Math.round(4700 + (baseIS - 200000) * 0.10);
    }

    const baseIGR = Math.max(0, (grossTaxableForSocial * 0.85) - totalEmployeeSocial - impotIS - impotCN);
    const parts = Math.max(1, employee.fiscalParts);
    const quotient = baseIGR / parts;
    let igrParPart = 0;
    if (quotient > 25000) {
      igrParPart = (quotient - 25000) * 0.10;
    }
    const impotIGR = Math.round(Math.max(0, igrParPart * parts));
    const totalTaxes = impotIS + impotCN + impotIGR;

    const taxes: TaxDeduction[] = [
      { name: 'IS (Impôt sur Salaire 1.5%)', taxableBase: baseIS, amount: impotIS },
      { name: 'CN (Contribution Nationale)', taxableBase: baseIS, amount: impotCN },
      { name: 'IGR (Impôt Général sur le Revenu)', taxableBase: baseIGR, amount: impotIGR, details: `${parts} part(s)` },
    ];

    const netSalaryBeforeAdvances = grossSalary - totalEmployeeSocial - totalTaxes;
    const netToPay = Math.max(0, netSalaryBeforeAdvances - salaryAdvancesDeduction);
    const totalCostToCompany = grossSalary + totalEmployerSocial;

    return {
      employeeId: employee.id,
      matricule: employee.matricule,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      periodLabel,
      country: 'CI',
      currency: 'FCFA',
      baseSalary: employee.baseSalary,
      overtimeAmount,
      taxableAllowances,
      exemptAllowances,
      grossSalary,
      socialContributions,
      totalEmployeeSocial,
      totalEmployerSocial,
      taxableGrossSalary: baseIS,
      taxes,
      totalTaxes,
      salaryAdvancesDeduction,
      netSalaryBeforeAdvances,
      netToPay,
      totalCostToCompany,
      paymentProvider: employee.paymentProvider,
      payoutPhone: employee.payoutPhone,
    };
  }

  // ----------------------------------------------------------------------------
  // 🇨🇲 CAMEROUN (CNPS, IRPP, CAC, Crédit Foncier, FNE, RAV - CEMAC)
  // ----------------------------------------------------------------------------
  private static calculateCameroon(input: PayrollInput, periodLabel: string): PayslipResult {
    const { employee, overtimeAmount = 0, exceptionalBonus = 0, salaryAdvancesDeduction = 0, absenceDeduction = 0 } = input;
    
    // Au Cameroun, l'indemnité de transport est exonérée dans la limite des frais réels ou barème (ex: 25 000 XAF)
    const MAX_EXEMPT_TRANSPORT = 25000;
    const exemptTransport = Math.min(employee.transportAllowance, MAX_EXEMPT_TRANSPORT);
    const taxableTransport = Math.max(0, employee.transportAllowance - MAX_EXEMPT_TRANSPORT);
    
    const taxableAllowances = employee.housingAllowance + employee.functionAllowance + employee.otherTaxablePrimes + taxableTransport;
    const exemptAllowances = exemptTransport;
    const grossSalary = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances + exemptAllowances - absenceDeduction);
    const grossTaxable = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances - absenceDeduction);

    const socialContributions: SocialContribution[] = [];

    // CNPS Pension Vieillesse (Retraite) - Plafond: 750 000 XAF/mois
    const cnpsBase = Math.min(grossTaxable, 750000);
    const cnpsRetraiteEmployee = Math.round(cnpsBase * 0.042); // 4.2% salarié
    const cnpsRetraiteEmployer = Math.round(cnpsBase * 0.042); // 4.2% employeur
    socialContributions.push({
      name: 'CNPS Pension Vieillesse (Plafond 750k)',
      baseAmount: cnpsBase,
      employeeRate: 0.042,
      employeeAmount: cnpsRetraiteEmployee,
      employerRate: 0.042,
      employerAmount: cnpsRetraiteEmployer,
    });

    // CNPS Prestations Familiales (7% employeur) & Accidents du Travail (2.5% employeur)
    const cnpsPrestationsEmployer = Math.round(cnpsBase * 0.07);
    const cnpsAccidentEmployer = Math.round(cnpsBase * 0.025);
    socialContributions.push({
      name: 'CNPS Prestations & Accidents du Travail',
      baseAmount: cnpsBase,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.095,
      employerAmount: cnpsPrestationsEmployer + cnpsAccidentEmployer,
    });

    // Crédit Foncier du Cameroun (CFC : 1% salarié, 1.5% employeur)
    const cfcEmployee = Math.round(grossTaxable * 0.01);
    const cfcEmployer = Math.round(grossTaxable * 0.015);
    socialContributions.push({
      name: 'Crédit Foncier du Cameroun (CFC)',
      baseAmount: grossTaxable,
      employeeRate: 0.01,
      employeeAmount: cfcEmployee,
      employerRate: 0.015,
      employerAmount: cfcEmployer,
    });

    // FNE (Fonds National de l'Emploi : 1% employeur)
    const fneEmployer = Math.round(grossTaxable * 0.01);
    socialContributions.push({
      name: 'FNE (Fonds National Emploi)',
      baseAmount: grossTaxable,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.01,
      employerAmount: fneEmployer,
    });

    const totalEmployeeSocial = socialContributions.reduce((sum, item) => sum + item.employeeAmount, 0);
    const totalEmployerSocial = socialContributions.reduce((sum, item) => sum + item.employerAmount, 0);

    // Fiscalité Camerounaise (CGI Cameroun)
    // 1. Abattement forfaitaire pour frais professionnels : 30%
    const abattementFrais = Math.round(grossTaxable * 0.30);
    // 2. Abattement forfaitaire annuel de base : 500 000 XAF/an soit 41 667 XAF/mois
    const baseApresAbattements = Math.max(0, grossTaxable - abattementFrais - 41667 - cnpsRetraiteEmployee);

    // Barème mensuel progressif IRPP Cameroun
    let irppBase = 0;
    if (baseApresAbattements > 0 && baseApresAbattements <= 166667) {
      irppBase = baseApresAbattements * 0.10;
    } else if (baseApresAbattements > 166667 && baseApresAbattements <= 250000) {
      irppBase = 16667 + (baseApresAbattements - 166667) * 0.15;
    } else if (baseApresAbattements > 250000 && baseApresAbattements <= 416667) {
      irppBase = 29167 + (baseApresAbattements - 250000) * 0.25;
    } else if (baseApresAbattements > 416667) {
      irppBase = 70834 + (baseApresAbattements - 416667) * 0.35;
    }
    const finalIRPP = Math.round(irppBase);

    // CAC (Centimes Additionnels Communaux : 10% de l'IRPP)
    const cacAmount = Math.round(finalIRPP * 0.10);

    // RAV (Redevance Audiovisuelle - tranche forfaitaire)
    let ravAmount = 0;
    if (grossTaxable > 50000 && grossTaxable <= 100000) ravAmount = 750;
    else if (grossTaxable > 100000 && grossTaxable <= 200000) ravAmount = 1950;
    else if (grossTaxable > 200000 && grossTaxable <= 300000) ravAmount = 3250;
    else if (grossTaxable > 300000 && grossTaxable <= 400000) ravAmount = 4550;
    else if (grossTaxable > 400000 && grossTaxable <= 500000) ravAmount = 5850;
    else if (grossTaxable > 500000) ravAmount = 7150;

    const totalTaxes = finalIRPP + cacAmount + ravAmount;
    const taxes: TaxDeduction[] = [
      { name: 'IRPP (Impôt sur le Revenu)', taxableBase: baseApresAbattements, amount: finalIRPP },
      { name: 'CAC (Centimes Additionnels 10%)', taxableBase: finalIRPP, amount: cacAmount },
      { name: 'RAV (Redevance Audiovisuelle)', taxableBase: grossTaxable, amount: ravAmount },
    ];

    const netSalaryBeforeAdvances = grossSalary - totalEmployeeSocial - totalTaxes;
    const netToPay = Math.max(0, netSalaryBeforeAdvances - salaryAdvancesDeduction);
    const totalCostToCompany = grossSalary + totalEmployerSocial;

    return {
      employeeId: employee.id,
      matricule: employee.matricule,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      periodLabel,
      country: 'CM',
      currency: 'XAF',
      baseSalary: employee.baseSalary,
      overtimeAmount,
      taxableAllowances,
      exemptAllowances,
      grossSalary,
      socialContributions,
      totalEmployeeSocial,
      totalEmployerSocial,
      taxableGrossSalary: baseApresAbattements,
      taxes,
      totalTaxes,
      salaryAdvancesDeduction,
      netSalaryBeforeAdvances,
      netToPay,
      totalCostToCompany,
      paymentProvider: employee.paymentProvider,
      payoutPhone: employee.payoutPhone,
    };
  }

  // ----------------------------------------------------------------------------
  // 🇧🇯 BÉNIN (CNSS, IPTS, VPS - UEMOA)
  // ----------------------------------------------------------------------------
  private static calculateBenin(input: PayrollInput, periodLabel: string): PayslipResult {
    const { employee, overtimeAmount = 0, exceptionalBonus = 0, salaryAdvancesDeduction = 0, absenceDeduction = 0 } = input;
    
    const MAX_EXEMPT_TRANSPORT = 20000;
    const exemptTransport = Math.min(employee.transportAllowance, MAX_EXEMPT_TRANSPORT);
    const taxableTransport = Math.max(0, employee.transportAllowance - MAX_EXEMPT_TRANSPORT);
    
    const taxableAllowances = employee.housingAllowance + employee.functionAllowance + employee.otherTaxablePrimes + taxableTransport;
    const exemptAllowances = exemptTransport;
    const grossSalary = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances + exemptAllowances - absenceDeduction);
    const grossTaxable = Math.max(0, employee.baseSalary + overtimeAmount + exceptionalBonus + taxableAllowances - absenceDeduction);

    const socialContributions: SocialContribution[] = [];

    // CNSS (Caisse Nationale de Sécurité Sociale du Bénin : 3.6% salarié, 15.4% patronal)
    const cnssEmployee = Math.round(grossTaxable * 0.036);
    const cnssEmployer = Math.round(grossTaxable * 0.154);
    socialContributions.push({
      name: 'CNSS (Sécurité Sociale Bénin)',
      baseAmount: grossTaxable,
      employeeRate: 0.036,
      employeeAmount: cnssEmployee,
      employerRate: 0.154,
      employerAmount: cnssEmployer,
    });

    // VPS (Versement Patronal sur Salaires : 4% employeur)
    const vpsEmployer = Math.round(grossTaxable * 0.04);
    socialContributions.push({
      name: 'VPS (Versement Patronal sur Salaires)',
      baseAmount: grossTaxable,
      employeeRate: 0,
      employeeAmount: 0,
      employerRate: 0.04,
      employerAmount: vpsEmployer,
    });

    const totalEmployeeSocial = socialContributions.reduce((sum, item) => sum + item.employeeAmount, 0);
    const totalEmployerSocial = socialContributions.reduce((sum, item) => sum + item.employerAmount, 0);

    // IPTS (Impôt Progressif sur Traitements et Salaires du Bénin)
    // Abattement forfaitaire de 20%
    const baseIPTS = Math.round(grossTaxable * 0.80);
    let iptsAmount = 0;
    if (baseIPTS > 50000 && baseIPTS <= 130000) {
      iptsAmount = (baseIPTS - 50000) * 0.10;
    } else if (baseIPTS > 130000 && baseIPTS <= 280000) {
      iptsAmount = 8000 + (baseIPTS - 130000) * 0.15;
    } else if (baseIPTS > 280000 && baseIPTS <= 530000) {
      iptsAmount = 30500 + (baseIPTS - 280000) * 0.20;
    } else if (baseIPTS > 530000) {
      iptsAmount = 80500 + (baseIPTS - 530000) * 0.30;
    }
    const finalIPTS = Math.round(Math.max(0, iptsAmount));

    const taxes: TaxDeduction[] = [
      { name: 'IPTS (Impôt sur Traitements & Salaires)', taxableBase: baseIPTS, amount: finalIPTS },
    ];

    const netSalaryBeforeAdvances = grossSalary - totalEmployeeSocial - finalIPTS;
    const netToPay = Math.max(0, netSalaryBeforeAdvances - salaryAdvancesDeduction);
    const totalCostToCompany = grossSalary + totalEmployerSocial;

    return {
      employeeId: employee.id,
      matricule: employee.matricule,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      periodLabel,
      country: 'BJ',
      currency: 'FCFA',
      baseSalary: employee.baseSalary,
      overtimeAmount,
      taxableAllowances,
      exemptAllowances,
      grossSalary,
      socialContributions,
      totalEmployeeSocial,
      totalEmployerSocial,
      taxableGrossSalary: baseIPTS,
      taxes,
      totalTaxes: finalIPTS,
      salaryAdvancesDeduction,
      netSalaryBeforeAdvances,
      netToPay,
      totalCostToCompany,
      paymentProvider: employee.paymentProvider,
      payoutPhone: employee.payoutPhone,
    };
  }

  // Helpers Sénégal
  private static computeSenegalProgressiveTax(monthlyTaxableBase: number): number {
    let tax = 0;
    if (monthlyTaxableBase <= 52500) return 0;
    if (monthlyTaxableBase > 52500) tax += (Math.min(monthlyTaxableBase, 125000) - 52500) * 0.20;
    if (monthlyTaxableBase > 125000) tax += (Math.min(monthlyTaxableBase, 333333) - 125000) * 0.30;
    if (monthlyTaxableBase > 333333) tax += (Math.min(monthlyTaxableBase, 666667) - 333333) * 0.35;
    if (monthlyTaxableBase > 666667) tax += (Math.min(monthlyTaxableBase, 1125000) - 666667) * 0.37;
    if (monthlyTaxableBase > 1125000) tax += (monthlyTaxableBase - 1125000) * 0.40;
    return Math.round(tax);
  }

  private static getSenegalFamilyReductionRate(fiscalParts: number): number {
    if (fiscalParts <= 1.0) return 0.0;
    if (fiscalParts === 1.5) return 0.10;
    if (fiscalParts === 2.0) return 0.15;
    if (fiscalParts === 2.5) return 0.20;
    if (fiscalParts === 3.0) return 0.25;
    if (fiscalParts === 3.5) return 0.30;
    if (fiscalParts === 4.0) return 0.35;
    if (fiscalParts === 4.5) return 0.40;
    return 0.45;
  }
}
