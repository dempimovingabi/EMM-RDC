// =========================================
// PATRIMOINE - FORMULAIRE RÉPARATION
// =========================================

export const ReparationForm = {
  async render(container) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement des biens...</p>`;

    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'patrimoine_biens'));
      
      if (snapshot.empty) {
        container.innerHTML = `
          <div style="background: white; padding: 24px; border-radius: 8px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
            <h3 style="color: #dc3545; margin-bottom: 8px;">Aucun bien enregistré</h3>
            <p style="color: #666; margin-bottom: 24px;">Vous devez d'abord créer un bien avant de pouvoir enregistrer une réparation.</p>
            <button id="btn-aller-biens" style="padding: 12px 24px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
              ➕ Créer un bien maintenant
            </button>
          </div>
        `;
        document.getElementById('btn-aller-biens')?.addEventListener('click', () => {
          import('./bien.form.js').then(m => m.BienForm.render(container));
        });
        return;
      }

      let optionsBiens = '<option value="">-- Choisir un bien --</option>';
      snapshot.forEach(doc => {
        optionsBiens += `<option value="${doc.id}" data-nom="${doc.data().designation}">${doc.data().designation}</option>`;
      });

      const today = new Date().toISOString().split('T')[0];

      container.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #0a6e2c; margin-top: 0;">Nouvelle Réparation</h3>
          
          <form id="form-reparation" style="margin-top: 16px;">
            
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Bien concerné *</label>
              <select id="rep-bien" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                ${optionsBiens}
              </select>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Date de la réparation *</label>
              <input type="date" id="rep-date" value="${today}" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Description *</label>
              <textarea id="rep-description" required placeholder="Ex: Remplacement des pieds cassés" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; resize: vertical; min-height: 80px;"></textarea>
            </div>

            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Coût (FC) *</label>
              <input type="number" id="rep-cout" required min="0" placeholder="Ex: 5000" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
            </div>

            <div style="display: flex; gap: 12px;">
              <button type="submit" id="btn-save-rep" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                💾 Enregistrer
              </button>
              <button type="button" id="btn-cancel-rep" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
                Annuler
              </button>
            </div>

          </form>
        </div>
      `;

      document.getElementById('btn-cancel-rep')?.addEventListener('click', () => {
        import('./reparations.list.js').then(m => m.ReparationsList.render(container));
      });

      const form = document.getElementById('form-reparation');
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('btn-save-rep');
        btn.textContent = "Enregistrement...";
        btn.disabled = true;

        try {
          const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
          const { Store } = await import('../../core/store.js');

          const bienSelect = document.getElementById('rep-bien');
          const bienNom = bienSelect.options[bienSelect.selectedIndex].getAttribute('data-nom');

          const data = {
            bienId: bienSelect.value,
            bienNom: bienNom,
            date: document.getElementById('rep-date').value,
            description: document.getElementById('rep-description').value,
            cout: parseFloat(document.getElementById('rep-cout').value) || 0,
            province: Store.getProvince(),
            createdAt: new Date().toISOString()
          };

          await addDoc(collection(FirebaseService.db, 'patrimoine_reparations'), data);
          
          alert('Réparation enregistrée avec succès !');
          import('./reparations.list.js').then(m => m.ReparationsList.render(container));
          
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur : ' + error.message);
          btn.textContent = "💾 Enregistrer";
          btn.disabled = false;
        }
      });

    } catch (error) {
      console.error('Erreur chargement biens:', error);
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};