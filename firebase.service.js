// =========================================
// SERVICE FIREBASE - Initialisation
// =========================================

import { firebaseConfig } from '../config/firebase.config.js';

// On utilise les modules Firebase via CDN (imports dynamiques)
export const FirebaseService = {
  app: null,
  auth: null,
  db: null,
  storage: null,

  async init() {
    if (this.app) return this; // Déjà initialisé

    try {
      // Importation dynamique des modules Firebase depuis le CDN
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const { getStorage } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js');

      // Initialisation
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);

      console.log('🔥 Firebase initialisé avec succès');
      return this;
    } catch (error) {
      console.error('❌ Erreur initialisation Firebase:', error);
      throw error;
    }
  }
};