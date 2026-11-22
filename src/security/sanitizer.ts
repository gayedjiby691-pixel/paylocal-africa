// ==============================================================================
// PAYLOCAL - Module Centralisé de Sécurité & d'Assainissement des Données (Sanitizer)
// Conforme aux standards financiers : OWASP Top 10, BCEAO & OHADA
// ==============================================================================

export class InputSanitizer {
  /**
   * Assainit une chaîne de caractères pour éliminer toute tentative d'injection XSS,
   * balises HTML, scripts malveillants, URLs javascript: et caractères de contrôle.
   */
  public static cleanText(input: unknown, maxLength: number = 255): string {
    if (typeof input !== 'string') return '';

    let cleaned = input
      // Supprimer les balises <script>...</script> et tout tag HTML
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      // Supprimer les protocoles d'exécution de code ou pseudo-protocoles
      .replace(/javascript:/gi, '')
      .replace(/data:\s*text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      // Supprimer les gestionnaires d'événements inline (ex: onload=, onerror=, onclick=)
      .replace(/\bon\w+\s*=/gi, '')
      // Supprimer les caractères de contrôle non imprimables (sauf tab et saut de ligne basiques si pertinents)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normaliser les espaces
      .trim();

    if (maxLength > 0 && cleaned.length > maxLength) {
      cleaned = cleaned.slice(0, maxLength);
    }

    return cleaned;
  }

  /**
   * Assainit et valide un montant financier en FCFA.
   * Empêche strictement les montants négatifs, NaN, Infinity, et dépassement de bornes.
   */
  public static cleanNumber(
    val: unknown,
    min: number = 0,
    max: number = Number.MAX_SAFE_INTEGER,
    fallback: number = 0
  ): number {
    let num: number;

    if (typeof val === 'number') {
      num = val;
    } else if (typeof val === 'string') {
      // Nettoyer les espaces, virgules remplacées par des points
      const normalized = val.replace(/\s/g, '').replace(',', '.');
      num = parseFloat(normalized);
    } else {
      return fallback;
    }

    if (isNaN(num) || !isFinite(num)) {
      return fallback;
    }

    // Encadrement strict entre min et max
    if (num < min) return min;
    if (num > max) return max;

    return Math.round(num * 100) / 100;
  }

  /**
   * Assainit une adresse email professionnelle.
   */
  public static cleanEmail(email: unknown): string {
    if (typeof email !== 'string') return '';
    return email
      .trim()
      .toLowerCase()
      .replace(/[^\w.@+-]/g, '')
      .slice(0, 100);
  }

  /**
   * Assainit un numéro de téléphone Mobile Money (+221, +225, +237, +229).
   * Conserve uniquement l'indicatif international (+), les chiffres et les espaces standards.
   */
  public static cleanPhone(phone: unknown): string {
    if (typeof phone !== 'string') return '';
    return phone
      .replace(/[^\d+ ]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 20);
  }

  /**
   * Assainit un matricule d'employé (ex: EMP-SN-402).
   */
  public static cleanMatricule(val: unknown): string {
    if (typeof val !== 'string') return '';
    return val
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, '')
      .slice(0, 25);
  }

  /**
   * Assainit le nom d'expéditeur SMS Mobile Money (Wave / Orange Money).
   * Règle Télécom stricte UEMOA/GSM 03.38 : Alphanumérique uniquement, max 11 caractères.
   */
  public static cleanSmsSender(sender: unknown): string {
    if (typeof sender !== 'string') return 'PAYLOCAL';
    const cleaned = sender
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 11);
    return cleaned || 'PAYLOCAL';
  }
}
