// =========================================
// FINANCE - LISTE DES VERSEMENTS
// =========================================

export const VersementsList = {
  async render(container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p style="color: #0a6e2c; font-weight: bold;">Chargement des versements...</p>
      </div>
    `;

    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      const querySnapshot = await getDocs(collection(FirebaseService.db, 'versements'));
      
      let rows = '';
      let totalUSD = 0;
      
      if (querySnapshot.empty) {
        rows = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">Aucun versement enregistré.</td></tr>`;
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.devise === 'USD') totalUSD += (data.montant || 0);
          
          rows += `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 8px;">${data.date || '-'}</td>
              <td style="padding: 12px 8px;">${data.candidatNom || 'Inconnu'}</td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold;">${data.montant} ${data.devise}</td>
              <td style="padding: 12px 8px; text-align: center;">${data.devise === 'FC' ? data.taux : '-'}</td>
              <td style="padding: 12px 8px; text-align: center;">
                <button onclick="alert('Détails à venir')" style="background: none; border: none; cursor: pointer; font-size: 16px;">👁️</button>
                <button onclick="alert('Suppression à venir')" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
              </td>
            </tr>
          `;
        });
      }

      container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          
          <!-- Total -->
          <div style="background: #e6f4ea; padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #0a6e2c; font-weight: bold;">Total encaissé (USD)</span>
            <span style="color: #0a6e2c; font-weight: bold; font-size: 20px;">${totalUSD.toFixed(2)} $</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #0a6e2c; margin: 0;">Historique des Versements</h3>
            <button id="btn-nouveau-versement" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">
              ➕ Nouveau
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #f5f7fa; border-bottom: 2px solid #ddd;">
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Date</th>
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Candidat</th>
                  <th style="padding: 12px 8px; text-align: right; color: #333;">Montant</th>
                  <th style="padding: 12px 8px; text-align: center; color: #333;">Taux</th>
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

      document.getElementById('btn-nouveau-versement')?.addEventListener('click', () => {
        import('./versement.form.js').then(m => m.VersementForm.render(container));
      });

    } catch (error) {
      console.error('Erreur:', error);
      container.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">Erreur : ${error.message}</p>`;
    }
  }
};