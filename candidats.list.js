// =========================================
// FINANCE - LISTE DES CANDIDATS
// =========================================

export const CandidatsList = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p style="color: #0a6e2c; font-weight: bold;">Chargement des candidats...</p>
      </div>
    `;

    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      // On récupère les candidats
      const q = query(collection(FirebaseService.db, 'candidats'));
      const querySnapshot = await getDocs(q);
      
      let rows = '';
      
      if (querySnapshot.empty) {
        rows = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">Aucun candidat enregistré pour le moment.</td></tr>`;
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          rows += `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 8px;">${data.nom || '-'}</td>
              <td style="padding: 12px 8px;">${data.motif || '-'}</td>
              <td style="padding: 12px 8px; text-align: right;">${data.montantPrevu || 0} $</td>
              <td style="padding: 12px 8px; text-align: center;">
                <span style="padding: 4px 8px; border-radius: 12px; font-size: 12px; background: ${data.statut === 'Terminé' ? '#d4edda' : '#fff3cd'}; color: ${data.statut === 'Terminé' ? '#155724' : '#856404'};">
                  ${data.statut || 'En cours'}
                </span>
              </td>
              <td style="padding: 12px 8px; text-align: center;">
                <button onclick="alert('Modification à venir')" style="background: none; border: none; cursor: pointer; font-size: 16px;">✏️</button>
                <button onclick="alert('Suppression à venir')" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
              </td>
            </tr>
          `;
        });
      }

      container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #0a6e2c; margin: 0;">Liste des Candidats</h3>
            <button id="btn-nouveau-candidat" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">
              ➕ Nouveau
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #f5f7fa; border-bottom: 2px solid #ddd;">
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Nom</th>
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Motif</th>
                  <th style="padding: 12px 8px; text-align: right; color: #333;">Montant</th>
                  <th style="padding: 12px 8px; text-align: center; color: #333;">Statut</th>
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

      // Bouton pour ajouter un candidat
      document.getElementById('btn-nouveau-candidat')?.addEventListener('click', () => {
        import('./candidat.form.js').then(m => {
          m.CandidatForm.render(container);
        });
      });

    } catch (error) {
      console.error('Erreur:', error);
      container.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">Erreur : ${error.message}</p>`;
    }
  }
};