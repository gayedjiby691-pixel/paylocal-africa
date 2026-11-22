# 🛡️ ARCHITECTURE DE SÉCURITÉ & CONFORMITÉ : PAYLOCAL

Ce document détaille les verrous techniques, les protocoles financiers et les standards de conformité bancaire intégrés à la plateforme **PayLocal**.

---

## 🔒 1. CLOISONNEMENT DES DONNÉES (MULTI-TENANT ISOLATION)

### Le Risque Majeur :
Dans un SaaS multi-entreprises, un bug applicatif ne doit **JAMAIS** permettre à l'entreprise A de voir les salaires ou employés de l'entreprise B.

### La Solution Implémentée :
* **PostgreSQL Row Level Security (RLS) :**
  * Activé sur toutes les tables sensibles (`employees`, `payslips`, `salary_advances`, `payout_batches`).
  * Chaque requête SQL filtre obligatoirement sur `organization_id = current_setting('app.current_organization_id')`.
  * Même si un attaquant injectait une requête SQL personnalisée, la base de données refuserait de renvoyer les lignes d'autres entreprises.
* Fichier DDL : [`database/security_rls_and_audit.sql`](file:///c:/Users/gayed/OneDrive/Documents/Nouveau%20projet/database/security_rls_and_audit.sql)

---

## 💸 2. SÉCURITÉ DES DÉBOURSEMENTS FINANCIERS (MOBILE MONEY)

### A. Protocole "Maker-Checker" (Double Validation Obligatoire)
* **Principe :** Séparation des pouvoirs.
  1. Le **Comptable / Gestionnaire RH (Maker)** saisit les primes, vérifie les absences et calcule la paie.
  2. Le **Directeur Général / DAF (Checker)** reçoit un récapitulatif signé et doit entrer un code de sécurité **OTP SMS** pour libérer les fonds.
* **Bénéfice :** Aucun employé malveillant ne peut effectuer un virement frauduleux seul.

### B. Verrou Anti-Doublon (Idempotency Manager)
* **Le Risque :** Lors d'un virement de 5 000 000 FCFA sur Wave, si une coupure 4G survient pendant la requête et que l'utilisateur reclique, l'entreprise risque de payer les salaires 2 fois.
* **La Solution :** Chaque lot génère une clé d'idempotence unique cryptographique (`IDEMP-PAYOUT-...`). Si l'API reçoit la même clé deux fois, elle renvoie le résultat du premier virement sans jamais ré-exécuter le transfert d'argent.
* Fichier : [`src/security/idempotency.ts`](file:///c:/Users/gayed/OneDrive/Documents/Nouveau%20projet/src/security/idempotency.ts)

### C. Signature Cryptographique des Webhooks (HMAC SHA-256)
* Chaque notification de succès reçue depuis les serveurs de **Wave** ou **Orange Money** est vérifiée via signature HMAC avec une clé secrète partagée.
* Les notifications contrefaites ou réémises après plus de 5 minutes (attaques par rejeu) sont immédiatement rejetées.
* Fichier : [`src/security/webhookVerifier.ts`](file:///c:/Users/gayed/OneDrive/Documents/Nouveau%20projet/src/security/webhookVerifier.ts)

---

## 📜 3. REGISTRE D'AUDIT IMMUABLE (AUDIT TRAIL)

* Chaque action critique est enregistrée dans une table d'audit `security_audit_logs` :
  * Qui a modifié un salaire ?
  * Qui a approuvé un acompte ?
  * Qui a lancé un déboursement ?
  * Depuis quelle adresse IP et à quelle seconde exacte ?
* **Règle d'immuabilité (WORM - Write Once, Read Many) :** Des règles SQL empêchent formellement tout `UPDATE` ou `DELETE` sur la table d'audit, même par les administrateurs.
* Fichier : [`src/security/auditLogger.ts`](file:///c:/Users/gayed/OneDrive/Documents/Nouveau%20projet/src/security/auditLogger.ts)

---

## 👁️ 4. PROTECTION DE LA CONFIDENTIALITÉ (MODE DISCRÉTION)

* Les gestionnaires RH travaillent souvent dans des bureaux partagés ou en open-space.
* Un **Mode Discrétion** intégrable en 1 clic permet de masquer immédiatement :
  * Les salaires bruts et nets (`•••••• FCFA`).
  * Les numéros de téléphone personnels Mobile Money (`+221 77 ••• •• 10`).
* Fichier : [`src/security/masking.ts`](file:///c:/Users/gayed/OneDrive/Documents/Nouveau%20projet/src/security/masking.ts)

---

## 🏛️ 5. CONFORMITÉ AUX NORMES LOCALES ET RÉGIONALES

1. **Zone UEMOA (BCEAO) :** Respect des directives relatives aux services de paiement dématérialisés et lutte contre le blanchiment (LCB-FT).
2. **Protection des Données Personnelles :** Conforme aux législations locales :
   * **CDP (Commission de Protection des Données Personnelles - Sénégal)**.
   * **ARTCI (Autorité de Régulation des Télécommunications - Côte d'Ivoire)**.
   * Chiffrement des identifiants nationaux (NINEA, CNI, Sécurité Sociale) au repos.
