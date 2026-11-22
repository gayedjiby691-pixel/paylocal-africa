// ==============================================================================
// PAYLOCAL - Sécurité : Gestionnaire d'Idempotence (Anti-Double Déboursement)
// ==============================================================================

/**
 * Garantit qu'une requête de déboursement Mobile Money ne soit jamais exécutée 2 fois
 * même en cas de re-clic utilisateur ou de timeout réseau.
 */
export class IdempotencyManager {
  private static cache = new Map<string, { timestamp: number; status: 'PENDING' | 'SUCCESS'; response?: any }>();

  /**
   * Génère une clé d'idempotence unique pour un lot de paie
   */
  public static generateBatchKey(orgId: string, periodLabel: string, employeeIds: string[]): string {
    const rawString = `${orgId}:${periodLabel}:${employeeIds.sort().join(',')}`;
    // Simple hash standard pour identification client
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `IDEMP-PAYOUT-${Math.abs(hash)}-${periodLabel.replace(/\s+/g, '')}`;
  }

  /**
   * Vérifie si la transaction est déjà en cours ou a déjà réussi
   */
  public static checkAndLock(key: string): { allowed: boolean; reason?: string } {
    const existing = this.cache.get(key);
    if (existing) {
      if (existing.status === 'PENDING') {
        return { allowed: false, reason: 'Une transaction identique est déjà en cours de traitement.' };
      }
      if (existing.status === 'SUCCESS') {
        return { allowed: false, reason: 'Ce lot a déjà été déboursé avec succès. Doublon bloqué par sécurité.' };
      }
    }

    this.cache.set(key, { timestamp: Date.now(), status: 'PENDING' });
    return { allowed: true };
  }

  /**
   * Confirme le succès du déboursement
   */
  public static markSuccess(key: string, response: any): void {
    this.cache.set(key, { timestamp: Date.now(), status: 'SUCCESS', response });
  }
}
