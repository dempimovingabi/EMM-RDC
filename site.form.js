// =========================================
// PATRIMOINE - FORMULAIRE SITE
// =========================================

export const SiteForm = {
  render(container) {
    container.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #0a6e2c; margin-top: 0;">Nouveau Site</h3>
        
        <form id="form-site" style="margin-top: 16px;">
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Nom du site *</label>
            <input type="text" id="site-nom" required placeholder="Ex: Siège de Kinshasa" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Type de site *</label>
            <select id="site-type" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
              <option value="">-- Choisir --</option>
              <option value="Jorhei Center">Jorhei Center</option>
              <option value="Unité religieuse">Unité religieuse</option>
              <option value="Foyer de Lumière">Foyer de Lumière</option>
              <option value="Réseau de Salut">Réseau de Salut</option>
            </select>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Responsable *</label>
            <input type="text" id="site-responsable" required placeholder="Nom du responsable" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="submit" id="btn-save-site" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
              💾 Enregistrer
            </button>
            <button type="button" id="btn-cancel-site" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
              Annuler
            </button>
          </div>

        </form>
      </div>
    `;

    document.getElementById('btn-cancel-site')?.addEventListener('click', () => {
      import('./sites.list.js').then(m => m.SitesList.render(container));
    });

    const form = document.getElementById('form-site');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-save-site');
      btn.textContent = "Enregistrement...";
      btn.disabled = true;

      try {
        const { FirebaseService } = await import('../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const { Store } = await import('../../core/store.js');
        
        await FirebaseService.init();

        const data = {
          nom: document.getElementById('site-nom').value,
          type: document.getElementById('site-type').value,
          responsable: document.getElementById('site-responsable').value,
          province: Store.getProvince(),
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(FirebaseService.db, 'patrimoine_sites'), data);
        
        alert('Site enregistré avec succès !');
        import('./sites.list.js').then(m => m.SitesList.render(container));
        
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur : ' + error.message);
        btn.textContent = "💾 Enregistrer";
        btn.disabled = false;
      }
    });
  }
};