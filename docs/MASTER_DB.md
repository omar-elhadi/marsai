# 📄 MASTER_DATABASE.md

## 1. Vision Générale

L'architecture de données de **MARSAI-1festival** est conçue pour supporter un workflow de festival de cinéma international assisté par IA. Elle repose sur trois piliers fondamentaux :

- **Intégrité Artistique** : Suivi rigoureux des œuvres et des auteurs.
    
- **Transparence Technique** : Déclaration explicite du "AI Stack".
    
- **Curation par le Jury** : Système de notation et de commentaires multidimensionnels.
    

---

## 2. Dictionnaire des Entités & Responsabilités

### A. Utilisateurs & Gouvernance (`users`)

- **Rôles** : `ADMIN` (Gestion globale par Bruno Smadja) et `JURY` (Évaluation par les experts).
    
- **Attributs clés** :
    
    - `bio` : Valorisation de l'expertise du juré pour l'affichage public.
        
    - `loginToken` : Système d'accès sécurisé _passwordless_ pour une expérience utilisateur fluide.
        

### B. Auteurs & Soumissions (`submitters`, `films`)

- **Submitter** : Identité humaine derrière l'œuvre (Bio, Instagram, Portfolio).
    
- **Film** : Cœur du système, centralisant les métadonnées et les médias.
    
    - **Transparence** : Le champ `aiStack` détaille les outils (ex: Flux, Runway, Midjourney).
        
    - **Fichiers** : Architecture _Dual-storage_ (Source S3/Minio pour la projection haute qualité + YouTube pour la consultation fluide du jury).
        
    - **Workflow** : Statuts évolutifs permettant un suivi précis (`PENDING`, `SELECTION`, `FINALIST`, `REJECTED`, `TO_MODIFY`).
        

### C. Traçabilité & Critique (`film_versions`, `votes`, `review_comments`)

- **FilmVersion** : Archive automatique. Toute modification suite à un retour jury crée un "snapshot" immuable (V1, V2, etc.).
    
- **Vote** : Décision binaire (`APPROVE`/`REJECT`) associée à une note quantitative ($0$ à $10$).
    
- **ReviewComment** : Fil de discussion granulaire avec gestion de la confidentialité :
    
    - `isInternal: true` : Notes de délibération secrètes entre jurés et admin.
        
    - `isInternal: false` : Feedback constructif transmis directement à l'artiste.
        

---

## 3. Scénarios de Test (Basés sur le Seed Master)

La base de données est pré-peuplée via le script de _Seed_ pour valider les cas d'usage critiques :

|**Scénario**|**Données de Test (Seed)**|**Fonctionnalité Validée**|
|---|---|---|
|**Le Grand Prix**|_Sahel Digital_ (Amine Diop)|Cycle complet : Versions V1/V2, Notes maximales, Attribution d'Award.|
|**Le Débat Jury**|_Glitch in Marseille_|Arbitrage Admin : Conflit entre Kubrick (Reject/Sévère) et Varda (Approve/Poétique).|
|**Itération Technique**|_Deep Sea_|Workflow `TO_MODIFY` : Suivi d'une demande de correction technique.|
|**Confidentialité**|_Ukiyo-e Dreams_|Double commentaire : Feedback public (style) + note interne (technique/flickering).|
|**Curation Sélective**|_Commercial AI Video_|Gestion des refus (`REJECTED`) pour protection de la ligne éditoriale.|

---

## 4. Évolutivité (Roadmap)

La structure actuelle est dite "Future-Proof" :

- **Events** : Le modèle `User` est prêt à être lié à une future table `Bookings` sans rupture de schéma.
    
- **Public Vote** : Un rôle `USER_PUBLIC` peut être intégré nativement pour un "Prix du Public".
    
- **Performances** : Des index optimisés sur `status`, `country` et `averageRating` garantissent la fluidité du Dashboard, même avec un volume important de films.
    

> **Note Technique** : L'intégrité référentielle est assurée par des contraintes `ON DELETE CASCADE`. La suppression d'un élément parent nettoie proprement les dépendances (versions, commentaires, votes).