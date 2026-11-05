// =========================================
// PATRIMOINE - LISTE DES SITES
// =========================================

export const SitesList = {
  async render(container) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement des sites...</p>`;

    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'patrimoine_sites'));
      
      let rows = '';
      
      if (snapshot.empty) {
        rows = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">Aucun site enregistré.</td></tr>`;
      } else {
        snapshot.forEach(doc => {
          const data = doc.data();
          rows += `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 8px;">${data.nom || '-'}</td>
              <td style="padding: 12px 8px;">${data.type || '-'}</td>
              <td style="padding: 12px 8px;">${data.responsable || '-'}</td>
              <td style="padding: 12px 8px; text-align: center;">
                <button class="btn-delete-site" data-id="${doc.id}" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
              </td>
            </tr>
          `;
        });
      }

      container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #0a6e2c; margin: 0;">Sites de l'Église</h3>
            <button id="btn-nouveau-site" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 14px; cursor: pointer;">
              ➕ Nouveau Site
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #f5f7fa; border-bottom: 2px solid #ddd;">
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Nom</th>
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Type</th>
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Responsable</th>
                  <th style="padding: 12px 8px; text-align: center; color: #333;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Bouton Nouveau
      document.getElementById('btn-nouveau-site')?.addEventListener('click', () => {
        import('./site.form.js').then(m => m.SiteForm.render(container));
      });

      // Suppression
      document.querySelectorAll('.btn-delete-site').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("Voulez-vous vraiment supprimer ce site ?")) {
            const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
            const id = e.target.getAttribute('data-id');
            await deleteDoc(doc(FirebaseService.db, 'patrimoine_sites', id));
            SitesList.render(container); // Recharger la liste
          }
        });
      });

    } catch (error) {
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};