// =========================================
// PATRIMOINE - FORMULAIRE BIEN
// =========================================

export const BienForm = {
  async render(container) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement des sites...</p>`;

    try {
      // On charge les sites pour le menu déroulant
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'patrimoine_sites'));
      let optionsSites = '<option value="">-- Choisir un site --</option>';
      snapshot.forEach(doc => {
        optionsSites += `<option value="${doc.id}" data-nom="${doc.data().nom}">${doc.data().nom}</option>`;
      });

      container.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #0a6e2c; margin-top: 0;">Nouveau Bien</h3>
          
          <form id="form-bien" style="margin-top: 16px;">
            
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Désignation *</label>
              <input type="text" id="bien-designation" required placeholder="Ex: Chaises en plastique" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Site d'appartenance *</label>
              <select id="bien-site" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                ${optionsSites}
              </select>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Quantité totale *</label>
              <input type="number" id="bien-quantite" required min="1" placeholder="Ex: 10" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
            </div>

            <h4 style="color: #0a6e2c; font-size: 14px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Détail des états</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
              <div>
                <label style="font-size: 12px; color: #555;">Neuf</label>
                <input type="number" id="etat-neuf" min="0" value="0" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 12px; color: #555;">Passable</label>
                <input type="number" id="etat-passable" min="0" value="0" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 12px; color: #555;">Mauvais</label>
                <input type="number" id="etat-mauvais" min="0" value="0" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 12px; color: #555;">Cassé</label>
                <input type="number" id="etat-casse" min="0" value="0" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <button type="submit" id="btn-save-bien" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                💾 Enregistrer
              </button>
              <button type="button" id="btn-cancel-bien" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
                Annuler
              </button>
            </div>

          </form>
        </div>
      `;

      document.getElementById('btn-cancel-bien')?.addEventListener('click', () => {
        import('./biens.list.js').then(m => m.BiensList.render(container));
      });

      const form = document.getElementById('form-bien');
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('btn-save-bien');
        btn.textContent = "Enregistrement...";
        btn.disabled = true;

        try {
          const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
          const { Store } = await import('../../core/store.js');

          const siteSelect = document.getElementById('bien-site');
          const siteNom = siteSelect.options[siteSelect.selectedIndex].getAttribute('data-nom');

          const data = {
            designation: document.getElementById('bien-designation').value,
            siteId: siteSelect.value,
            siteNom: siteNom,
            quantite: parseInt(document.getElementById('bien-quantite').value) || 0,
            etats: {
              neuf: parseInt(document.getElementById('etat-neuf').value) || 0,
              passable: parseInt(document.getElementById('etat-passable').value) || 0,
              mauvais: parseInt(document.getElementById('etat-mauvais').value) || 0,
              casse: parseInt(document.getElementById('etat-casse').value) || 0
            },
            province: Store.getProvince(),
            createdAt: new Date().toISOString()
          };

          await addDoc(collection(FirebaseService.db, 'patrimoine_biens'), data);
          
          alert('Bien enregistré avec succès !');
          import('./biens.list.js').then(m => m.BiensList.render(container));
          
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur : ' + error.message);
          btn.textContent = "💾 Enregistrer";
          btn.disabled = false;
        }
      });

    } catch (error) {
      console.error('Erreur chargement sites:', error);
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};