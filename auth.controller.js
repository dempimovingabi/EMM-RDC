// =========================================
// CONTRÔLEUR : AUTHENTIFICATION
// =========================================

import { FirebaseService } from '../../services/firebase.service.js';
import { Store } from '../../core/store.js';
import { Toast } from '../../ui/toast.js';

export const AuthController = {
  async login(email, password) {
    try {
      await FirebaseService.init();
      
      const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      
      const userCredential = await signInWithEmailAndPassword(FirebaseService.auth, email, password);
      const user = userCredential.user;
      
      Store.setUser(user);

      // 🚨 SÉCURITÉ : On cherche d'abord par l'UID (le nom du document)
      const { doc, getDoc, collection, query, where, getDocs, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      const docRef = doc(FirebaseService.db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      let profileData = null;

      if (docSnap.exists()) {
        // Si on trouve le document par l'UID, c'est parfait
        profileData = docSnap.data();
      } else {
        // Sinon, on cherche par email (au cas où l'UID aurait changé)
        const q = query(collection(FirebaseService.db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          profileData = querySnapshot.docs[0].data();
        }
      }

      // Si on a trouvé un profil, on le charge dans la mémoire
      if (profileData) {
        Store.setProfile(profileData);
        console.log('✅ Profil chargé avec succès :', profileData);
      } else {
        // 🚨 SI AUCUN PROFIL N'EST TROUVÉ, ON LE CRÉE AUTOMATIQUEMENT !
        console.warn('⚠️ Profil introuvable. Création d\'un profil par défaut.');
        
        const newProfile = {
          email: email,
          role: 'utilisateur', // Par défaut, c'est un utilisateur simple
          province: 'Kinshasa',
          premium: false
        };
        
        // On sauvegarde ce nouveau profil dans Firebase
        await setDoc(docRef, newProfile);
        
        // On le charge dans la mémoire
        Store.setProfile(newProfile);
        
        Toast.warning("Profil recréé automatiquement. Contactez l'admin si vous n'avez pas vos droits.");
      }
      
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Erreur login:', error.code);
      let message = "Erreur de connexion.";
      if (error.code === 'auth/invalid-email') message = "Email invalide.";
      if (error.code === 'auth/user-not-found') message = "Utilisateur introuvable.";
      if (error.code === 'auth/wrong-password') message = "Mot de passe incorrect.";
      if (error.code === 'auth/invalid-credential') message = "Email ou mot de passe incorrect.";
      
      return { success: false, message };
    }
  },

  async resetPassword(email) {
    try {
      await FirebaseService.init();
      
      const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      
      await sendPasswordResetEmail(FirebaseService.auth, email);
      
      return { success: true };
    } catch (error) {
      console.error("Erreur reset password:", error);
      return { success: false, message: "Impossible d'envoyer l'email. Vérifiez l'adresse." };
    }
  }
};