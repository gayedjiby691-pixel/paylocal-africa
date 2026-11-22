// ==============================================================================
// PAYLOCAL - Sécurité : Masquage & Protection des Données Personnelles (CDP/RGPD)
// ==============================================================================

export class DataMasking {
  /**
   * Masque un numéro de téléphone Mobile Money pour affichage public / open space
   * Ex: "+221 77 654 32 10" -> "+221 77 ••• •• 10"
   */
  public static maskPhone(phone: string): string {
    if (!phone || phone.length < 8) return '••••••••';
    const clean = phone.trim();
    const parts = clean.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ••• •• ${parts[parts.length - 1]}`;
    }
    return clean.slice(0, 6) + '••••' + clean.slice(-2);
  }

  /**
   * Masque les montants salariaux (Mode Discrétion / Écran partagé)
   */
  public static maskMoney(formattedMoney: string, isPrivacyActive: boolean): string {
    if (!isPrivacyActive) return formattedMoney;
    return '•••••• FCFA';
  }

  /**
   * Masque un matricule ou identifiant national
   */
  public static maskId(id: string): string {
    if (!id || id.length <= 4) return '••••';
    return id.slice(0, 3) + '••••' + id.slice(-2);
  }
}
