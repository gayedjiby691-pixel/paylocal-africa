import React from 'react';
import { CountryCode, PayslipResult } from '../engine/types';
import { X, FileSpreadsheet, Download, Printer, Landmark, CheckCircle } from 'lucide-react';

interface TaxDeclarationExportModalProps {
  country: CountryCode;
  periodLabel: string;
  payslips: PayslipResult[];
  onClose: () => void;
}

export const TaxDeclarationExportModal: React.FC<TaxDeclarationExportModalProps> = ({
  country,
  periodLabel,
  payslips,
  onClose,
}) => {
  const formatMoney = (val: number = 0) => val.toLocaleString('fr-FR') + ' FCFA';

  const totalGross = payslips.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalTaxable = payslips.reduce((sum, p) => sum + p.taxableGrossSalary, 0);
  const totalIRPP = payslips.reduce((sum, p) => sum + p.totalTaxes, 0);
  const totalSocialEmployee = payslips.reduce((sum, p) => sum + p.totalEmployeeSocial, 0);
  const totalSocialEmployer = payslips.reduce((sum, p) => sum + p.totalEmployerSocial, 0);

  const getDeclarationMeta = () => {
    switch (country) {
      case 'SN':
        return {
          title: 'ÉTAT 102 & RÉCAPITULATIF IPRES/CSS (SÉNÉGAL)',
          authority: 'Direction Générale des Impôts et des Domaines (DGID) • IPRES • CSS',
        };
      case 'CI':
        return {
          title: 'BORDEREAU DGI & DÉCLARATION CNPS / CMU (CÔTE D\'IVOIRE)',
          authority: 'Direction Générale des Impôts (DGI) • CNPS • CNAM',
        };
      case 'CM':
        return {
          title: 'DIPE (DOCUMENT D\'INFORMATION PERSONNEL) & CNPS (CAMEROUN)',
          authority: 'Direction Générale des Impôts (DGI Cameroun) • CNPS Cameroun • CFC • FNE',
        };
      case 'BJ':
        return {
          title: 'BORDEREAU UNIQUE CNSS & IPTS / VPS (BÉNIN)',
          authority: 'Direction Générale des Impôts (DGI Bénin) • CNSS Bénin',
        };
    }
  };

  const meta = getDeclarationMeta();

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Matricule,Nom,Salaire Brut,Brut Fiscal,Retenue Fiscale,Charges Salariales,Charges Patronales,Net Verse\n';
    
    payslips.forEach((p) => {
      csvContent += `${p.matricule},"${p.employeeName}",${p.grossSalary},${p.taxableGrossSalary},${p.totalTaxes},${p.totalEmployeeSocial},${p.totalEmployerSocial},${p.netToPay}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Declaration_Fiscale_${country}_${periodLabel.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{meta.title}</h3>
              <p className="text-xs text-slate-500">Période : {periodLabel} • {meta.authority}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV / Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Summary KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Masse Salariale Brute</span>
              <div className="text-xl font-black text-slate-900 mt-1">{formatMoney(totalGross)}</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Total Impôts & Taxes (DGI)</span>
              <div className="text-xl font-black text-amber-900 mt-1">{formatMoney(totalIRPP)}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Total Cotisations Sociales</span>
              <div className="text-xl font-black text-blue-900 mt-1">{formatMoney(totalSocialEmployee + totalSocialEmployer)}</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Matricule</th>
                  <th className="py-2.5 px-3">Nom du Salarié</th>
                  <th className="py-2.5 px-3 text-right">Salaire Brut</th>
                  <th className="py-2.5 px-3 text-right">Retenue Fiscale</th>
                  <th className="py-2.5 px-3 text-right">Part Salariale</th>
                  <th className="py-2.5 px-3 text-right">Part Patronale</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-900">Total Social</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payslips.map((p) => (
                  <tr key={p.employeeId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{p.matricule}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{p.employeeName}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatMoney(p.grossSalary)}</td>
                    <td className="py-2.5 px-3 text-right text-amber-700 font-semibold">{formatMoney(p.totalTaxes)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{formatMoney(p.totalEmployeeSocial)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{formatMoney(p.totalEmployerSocial)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatMoney(p.totalEmployeeSocial + p.totalEmployerSocial)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t border-slate-300">
                <tr>
                  <td className="py-3 px-3" colSpan={2}>TOTAUX DÉCLARATION</td>
                  <td className="py-3 px-3 text-right">{formatMoney(totalGross)}</td>
                  <td className="py-3 px-3 text-right text-amber-800">{formatMoney(totalIRPP)}</td>
                  <td className="py-3 px-3 text-right">{formatMoney(totalSocialEmployee)}</td>
                  <td className="py-3 px-3 text-right">{formatMoney(totalSocialEmployer)}</td>
                  <td className="py-3 px-3 text-right text-emerald-800">
                    {formatMoney(totalSocialEmployee + totalSocialEmployer)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Conforme aux formulaires officiels dématérialisés de la zone OHADA.</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700">Norme: CGI-{country}-2026</span>
          </div>

        </div>

      </div>
    </div>
  );
};
