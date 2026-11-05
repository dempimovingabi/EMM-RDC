// =========================================
// ADMINISTRATION - CLIENTS PREMIUM
// =========================================

export const ClientsPremiumView = {
  async render(container) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement des clients...</p>`;

    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'users'));
      
      let cartesUtilisateurs = '';
      
      if (snapshot.empty) {
        cartesUtilisateurs = `<p style="text-align: center; padding: 20px; color: #666;">Aucun utilisateur trouvé.</p>`;
      } else {
        snapshot.forEach(doc => {
          const data = doc.data();
          const isPremium = data.premium || false;
          const dateExp = data.premiumExpire ? new Date(data.premiumExpire).toLocaleDateString('fr-FR') : 'Illimité';
          
          const texteWhatsapp = isPremium 
            ? "Bonjour, votre compte EMM RD CONGO a été activé jusqu'au " + dateExp + ". Merci !"
            : "Bonjour, votre compte EMM RD CONGO est actuellement en version gratuite.";
            
          const msgWhatsapp = encodeURIComponent(texteWhatsapp);
          const tel = data.phone || ''; 

          cartesUtilisateurs += `
            <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              
              <!-- 1. L'email prend toute la largeur en haut -->
              <div style="margin-bottom: 8px;">
                <strong style="color: #333; font-size: 14px; word-wrap: break-word;">${data.email || 'Sans email'}</strong>
              </div>

              <!-- 2. La date d'expiration et le badge sur la même ligne juste en dessous -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 12px; color: #666;">Expire : ${isPremium ? dateExp : 'Compte Gratuit'}</span>
                <span style="padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; white-space: nowrap; background: ${isPremium ? '#d4edda' : '#f8d7da'}; color: ${isPremium ? '#155724' : '#721c24'};">
                  ${isPremium ? '⭐ Premium' : 'Gratuit'}
                </span>
              </div>

              <!-- 3. Les boutons d'action en bas -->
              <div style="display: flex; flex-wrap: wrap; gap: 6px; padding-top: 12px; border-top: 1px solid #eee;">
                <button class="btn-activer" data-id="${doc.id}" data-mois="1" style="flex: 1; min-width: 60px; padding: 6px; background: #17a2b8; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">+1 M</button>
                <button class="btn-activer" data-id="${doc.id}" data-mois="2" style="flex: 1; min-width: 60px; padding: 6px; background: #17a2b8; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">+2 M</button>
                <button class="btn-activer" data-id="${doc.id}" data-mois="3" style="flex: 1; min-width: 60px; padding: 6px; background: #17a2b8; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">+3 M</button>
                <button class="btn-activer" data-id="${doc.id}" data-mois="illimite" style="flex: 1; min-width: 60px; padding: 6px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">Illimité</button>
                
                <button class="btn-whatsapp" data-tel="${tel}" data-msg="${msgWhatsapp}" style="flex: 1; min-width: 80px; padding: 6px; background: #25D366; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">
                  📱 WhatsApp
                </button>
              </div>

            </div>
          `;
        });
      }

      container.innerHTML = `
        <div style="padding: 4px;">
          <h3 style="color: #0a6e2c; margin-top: 0; margin-bottom: 16px;">Gestion des Abonnements</h3>
          ${cartesUtilisateurs}
        </div>
      `;

      // --- LOGIQUE D'ACTIVATION ---
      document.querySelectorAll('.btn-activer').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const userId = e.target.getAttribute('data-id');
          const mois = e.target.getAttribute('data-mois');
          
          const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
          
          let newExpire = null;
          if (mois !== 'illimite') {
            const d = new Date();
            d.setMonth(d.getMonth() + parseInt(mois));
            newExpire = d.toISOString();
          }

          try {
            await updateDoc(doc(FirebaseService.db, 'users', userId), {
              premium: true,
              premiumExpire: newExpire
            });
            alert('Abonnement mis à jour avec succès !');
            ClientsPremiumView.render(container);
          } catch (err) {
            alert('Erreur : ' + err.message);
          }
        });
      });

      // --- LOGIQUE WHATSAPP ---
      document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tel = e.target.getAttribute('data-tel');
          const msg = e.target.getAttribute('data-msg');
          const telPropre = tel.replace(/[^0-9]/g, '');
          
          const url = telPropre ? `https://wa.me/${telPropre}?text=${msg}` : `https://wa.me/?text=${msg}`;
          window.open(url, '_blank');
        });
      });

    } catch (error) {
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};