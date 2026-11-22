// ==============================================================================
// PAYLOCAL - Sécurité : Validation des Variables d'Environnement au Démarrage
// ==============================================================================

export interface AppConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isProduction: boolean;
}

export class EnvValidator {
  /**
   * Vérifie au démarrage de l'application que les variables requises sont saines
   * et qu'aucun secret serveur ne fuit dans le bundle client.
   */
  public static validate(): AppConfig {
    const metaEnv = (import.meta as any).env || {};
    const isProduction = Boolean(metaEnv.PROD);

    // Détection de fuite : interdiction stricte de variables sensibles dans le bundle client
    const clientEnvKeys = Object.keys(metaEnv);
    const forbiddenPatterns = ['SERVICE_ROLE', 'SECRET_KEY', 'PRIVATE_KEY', 'PASSWORD'];
    
    for (const key of clientEnvKeys) {
      for (const pattern of forbiddenPatterns) {
        if (key.toUpperCase().includes(pattern) && !key.startsWith('VITE_SAFE_')) {
          console.error(
            `[FATAL SÉCURITÉ] Variable sensible détectée dans l'environnement client : ${key}.`
          );
        }
      }
    }

    return {
      supabaseUrl: metaEnv.VITE_SUPABASE_URL,
      supabaseAnonKey: metaEnv.VITE_SUPABASE_ANON_KEY,
      isProduction,
    };
  }
}
