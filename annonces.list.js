// =========================================
// ADMINISTRATION - LISTE DES ANNONCES
// =========================================

export const AnnoncesList = {
  async render(container) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement des annonces...</p>`;

    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'annonces'));
      
      let htmlAnnonces = '';
      
      if (snapshot.empty) {
        htmlAnnonces = `<p style="text-align: center; padding: 20px; color: #666;">Aucune annonce publiée pour le moment.</p>`;
      } else {
        htmlAnnonces = `<div style="display: flex; flex-direction: column; gap: 12px;">`;
        snapshot.forEach(doc => {
          const data = doc.data();
          htmlAnnonces += `
            <div style="border: 1px solid #eee; padding: 16px; border-radius: 8px; background: #fafafa;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h4 style="margin: 0; color: #0a6e2c; font-size: 16px;">${data.titre || 'Sans titre'}</h4>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-delete-annonce" data-id="${doc.id}" style="background: none; border: none; font-size: 16px; cursor: pointer;">🗑️</button>
                </div>
              </div>
              <p style="margin: 0 0 8px 0; color: #444; font-size: 14px; white-space: pre-wrap;">${data.texte || ''}</p>
              <span style="font-size: 12px; color: #999;">Publié le ${new Date(data.dateCreation).toLocaleDateString('fr-FR')} par ${data.auteur || 'Admin'}</span>
            </div>
          `;
        });
        htmlAnnonces += `</div>`;
      }

      container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #0a6e2c; margin: 0;">Annonces</h3>
            <button id="btn-nouvelle-annonce" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 14px; cursor: pointer;">
              ➕ Publier
            </button>
          </div>
          ${htmlAnnonces}
        </div>
      `;

      document.getElementById('btn-nouvelle-annonce')?.addEventListener('click', () => {
        import('./annonce.form.js').then(m => m.AnnonceForm.render(container));
      });

      document.querySelectorAll('.btn-delete-annonce').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
            const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            const id = e.target.getAttribute('data-id');
            await deleteDoc(doc(FirebaseService.db, 'annonces', id));
            AnnoncesList.render(container);
          }
        });
      });

    } catch (error) {
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};