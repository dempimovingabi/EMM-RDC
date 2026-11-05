// =========================================
// DÉPOUILLEMENT - FORMULAIRE DE SÉANCE
// =========================================

export const SeanceForm = {
  render(container) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <h3 style="color: #0a6e2c; margin-top: 0;">Nouvelle Séance de Dépouillement</h3>
      
      <form id="form-seance" style="margin-top: 16px;">
        
        <!-- Année, Mois, Date, Phase -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Année *</label>
            <input type="number" id="seance-annee" value="${currentYear}" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Mois *</label>
            <select id="seance-mois" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="1" ${currentMonth === 1 ? 'selected' : ''}>Janvier</option>
              <option value="2" ${currentMonth === 2 ? 'selected' : ''}>Février</option>
              <option value="3" ${currentMonth === 3 ? 'selected' : ''}>Mars</option>
              <option value="4" ${currentMonth === 4 ? 'selected' : ''}>Avril</option>
              <option value="5" ${currentMonth === 5 ? 'selected' : ''}>Mai</option>
              <option value="6" ${currentMonth === 6 ? 'selected' : ''}>Juin</option>
              <option value="7" ${currentMonth === 7 ? 'selected' : ''}>Juillet</option>
              <option value="8" ${currentMonth === 8 ? 'selected' : ''}>Août</option>
              <option value="9" ${currentMonth === 9 ? 'selected' : ''}>Septembre</option>
              <option value="10" ${currentMonth === 10 ? 'selected' : ''}>Octobre</option>
              <option value="11" ${currentMonth === 11 ? 'selected' : ''}>Novembre</option>
              <option value="12" ${currentMonth === 12 ? 'selected' : ''}>Décembre</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Phase *</label>
            <select id="seance-phase" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Date de la séance *</label>
          <input type="date" id="seance-date" value="${today}" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
        </div>

        <!-- Informations de l'entité -->
        <div style="background: #fafafa; padding: 16px; border-radius: 6px; border: 1px solid #eee; margin-bottom: 24px;">
          <h4 style="margin-top: 0; color: #0a6e2c; font-size: 14px;">Informations de l'entité</h4>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Type d'entité *</label>
            <select id="seance-type-entite" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="">-- Choisir --</option>
              <option value="Jorhei Center">Jorhei Center</option>
              <option value="Unité religieuse">Unité religieuse</option>
              <option value="Foyer de Lumière">Foyer de Lumière</option>
              <option value="Réseau de Salut">Réseau de Salut</option>
            </select>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Nom de l'entité *</label>
            <input type="text" id="seance-nom-entite" required placeholder="Ex: J.C Biancky" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          </div>

          <!-- NOUVEAU CHAMP RESPONSABLE -->
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 13px;">Responsable *</label>
            <input type="text" id="seance-responsable" required placeholder="Ex: Jean Mukendi" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
        </div>

        <!-- Boutons -->
        <div style="display: flex; gap: 12px;">
          <button type="submit" id="btn-save-seance" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
            💾 Créer la séance
          </button>
          <button type="button" id="btn-cancel-seance" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Annuler
          </button>
        </div>

      </form>
    `;

    // Annulation
    document.getElementById('btn-cancel-seance')?.addEventListener('click', () => {
      import('./depouillement.page.js').then(m => m.DepouillementPage.render());
    });

    // Enregistrement
    const form = document.getElementById('form-seance');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-save-seance');
      btn.textContent = "Création...";
      btn.disabled = true;

      try {
        const { FirebaseService } = await import('../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const { Store } = await import('../../core/store.js');
        
        await FirebaseService.init();

        const data = {
          annee: parseInt(document.getElementById('seance-annee').value),
          mois: parseInt(document.getElementById('seance-mois').value),
          phase: document.getElementById('seance-phase').value,
          date: document.getElementById('seance-date').value,
          typeEntite: document.getElementById('seance-type-entite').value,
          nomEntite: document.getElementById('seance-nom-entite').value,
          responsable: document.getElementById('seance-responsable').value, // <-- Nouveau champ
          province: Store.getProvince(),
          statut: 'Ouverte',
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(FirebaseService.db, 'depouillements'), data);
        
        alert('Séance créée avec succès !');
        import('./depouillement.page.js').then(m => m.DepouillementPage.render());
        
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur : ' + error.message);
        btn.textContent = "💾 Créer la séance";
        btn.disabled = false;
      }
    });
  }
};