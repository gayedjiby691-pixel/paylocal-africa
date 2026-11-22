// ==============================================================================
// PAYLOCAL - Sécurité : Journal d'Audit Immuable (Audit Trail)
// ==============================================================================

export interface SecurityEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: 'PAYOUT_INITIATED' | 'ADVANCE_RECORDED' | 'SALARY_UPDATED' | 'EMPLOYEE_CREATED' | 'DATA_EXPORTED';
  description: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export class SecurityAuditService {
  private static logs: SecurityEvent[] = [
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
    return newEvent;
  }
}
