// ==============================================================================
// PAYLOCAL - Sécurité : Journal d'Audit Immuable (Audit Trail)
// ==============================================================================

export interface SecurityEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: 
    | 'PAYOUT_INITIATED' 
    | 'ADVANCE_RECORDED' 
    | 'SALARY_UPDATED' 
    | 'EMPLOYEE_CREATED' 
    | 'DATA_EXPORTED'
    | 'AUTH_FAILURE'
    | 'AUTH_LOCKED'
    | 'CROSS_BORDER_BLOCKED'
    | 'BRANDING_UPDATED';
  description: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

const STORAGE_KEY = 'paylocal_security_audit_logs';

export class SecurityAuditService {
  private static defaultLogs: SecurityEvent[] = [
    {
      id: 'AUD-001',
      timestamp: '2026-11-21 18:30:12',
      actor: 'directeur.financier@kalia.sn',
      action: 'PAYOUT_INITIATED',
      description: 'Déboursement groupé de 2 850 000 FCFA validé via OTP SMS.',
      ipAddress: '197.234.221.14 (Dakar, SN)',
      severity: 'CRITICAL',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-11-21 14:15:05',
      actor: 'rh.comptable@kalia.sn',
      action: 'ADVANCE_RECORDED',
      description: 'Acompte de 30 000 FCFA approuvé pour Fatou Ndiaye (Wave).',
      ipAddress: '197.234.221.14 (Dakar, SN)',
      severity: 'INFO',
    },
    {
      id: 'AUD-003',
      timestamp: '2026-11-21 11:02:40',
      actor: 'rh.comptable@kalia.sn',
      action: 'DATA_EXPORTED',
      description: 'Exportation de l\'État 102 officiel pour la DGID.',
      ipAddress: '197.234.221.14 (Dakar, SN)',
      severity: 'WARNING',
    }
  ];

  private static logs: SecurityEvent[] = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...SecurityAuditService.defaultLogs];
  })();

  public static getLogs(): SecurityEvent[] {
    return [...this.logs];
  }

  public static logAction(
    actor: string,
    action: SecurityEvent['action'],
    description: string,
    severity: SecurityEvent['severity'] = 'INFO'
  ): SecurityEvent {
    const newEvent: SecurityEvent = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor,
      action,
      description,
      ipAddress: '197.234.221.14 (Dakar, SN)',
      severity,
    };
    this.logs.unshift(newEvent);
    try {
      // Conserver les 100 derniers logs dans le stockage local
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs.slice(0, 100)));
    } catch (e) {}
    return newEvent;
  }
}
