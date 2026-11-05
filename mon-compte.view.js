// =========================================
// ADMINISTRATION - MON COMPTE
// =========================================

import { Store } from '../../core/store.js';

export const MonCompteView = {
  async render(container) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement du profil...</p>`;
    
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { doc, getDoc, collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      const user = Store.currentUser;
      if (!user) {
         container.innerHTML = `<p style="color:red;">Erreur : Utilisateur non connecté.</p>`;
         return;
      }

      // On va chercher le document "users"
      let profile = {};
      let docSnap = await getDoc(doc(FirebaseService.db, 'users', user.uid));
      
      if (docSnap.exists()) {
        profile = docSnap.data();
      } else {
        const q = query(collection(FirebaseService.db, 'users'), where('email', '==', user.email));
        const qSnap = await getDocs(q);
        if(!qSnap.empty) {
           profile = qSnap.docs[0].data();
        }
      }

      const userEmail = user.email || 'Non renseigné';
      
      // 🛠️ NETTOYAGE : On enlève les espaces et on met en minuscule pour être sûr
      const roleBrut = profile.role || 'utilisateur';
      const role = roleBrut.trim().toLowerCase();
      
      const province = profile.province || 'Non renseignée';
      const isPremium = profile.premium || false;

      let roleAffiche = 'Utilisateur (Entité)';
      if (role === 'super_admin') roleAffiche = 'Super Administrateur';
      if (role === 'admin_provincial') roleAffiche = 'Administrateur Provincial';

      container.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #0a6e2c; margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 12px;">Mon Profil</h3>
          
          <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
            
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 60px; height: 60px; background: #e6f4ea; color: #0a6e2c; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">
                ${userEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 16px; color: #333;">${userEmail}</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">${roleAffiche}</p>
                <!-- Texte de debug pour voir ce que Firebase renvoie exactement -->
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #aaa;">(Valeur lue dans DB : "${roleBrut}")</p>
              </div>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 8px 0;">

            <div>
              <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase;">Province</p>
              <p style="margin: 4px 0 0 0; font-weight: 500; color: #333;">📍 ${province}</p>
            </div>

            <div>
              <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase;">Statut du compte</p>
              <p style="margin: 4px 0 0 0; font-weight: 500; color: ${isPremium ? '#28a745' : '#dc3545'};">
                ${isPremium ? '⭐ Premium Actif' : 'Compte Gratuit'}
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 8px;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                ℹ️ Pour modifier vos informations (email, mot de passe), veuillez contacter le Super Administrateur ou utiliser la fonction "Mot de passe oublié" sur l'écran de connexion.
              </p>
            </div>

          </div>
        </div>
      `;
    } catch(e) {
       container.innerHTML = `<p style="color:red;">Erreur : ${e.message}</p>`;
    }
  }
};