// =========================================
// FINANCE - FORMULAIRE VERSEMENT
// =========================================

export const VersementForm = {
  async render(container) {
    // On charge d'abord la liste des candidats pour le menu déroulant
    let optionsCandidats = '<option value="">-- Choisir un candidat --</option>';
    
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'candidats'));
      snapshot.forEach(doc => {
        const data = doc.data();
        optionsCandidats += `<option value="${doc.id}" data-nom="${data.nom}">${data.nom} - ${data.motif}</option>`;
      });
    } catch (err) {
      console.error('Erreur chargement candidats:', err);
    }

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #0a6e2c; margin-top: 0;">Nouveau Versement</h3>
        
        <form id="form-versement" style="margin-top: 16px;">
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Candidat *</label>
            <select id="vers-candidat" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
              ${optionsCandidats}
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Date *</label>
            <input type="date" id="vers-date" value="${today}" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Devise *</label>
              <select id="vers-devise" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                <option value="USD">USD ($)</option>
                <option value="FC">FC (Franc Congolais)</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Montant *</label>
              <input type="number" id="vers-montant" min="0" step="0.01" required placeholder="0.00" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            </div>
          </div>

          <!-- Taux de change (visible seulement si FC) -->
          <div id="div-taux" style="margin-bottom: 24px; display: none;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Taux de change (1 USD = ? FC) *</label>
            <input type="number" id="vers-taux" min="0" step="0.01" placeholder="Ex: 2800" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="submit" id="btn-save-vers" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              💾 Enregistrer
            </button>
            <button type="button" id="btn-cancel-vers" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              Annuler
            </button>
          </div>

        </form>
      </div>
    `;

    // Gestion de l'affichage du taux de change
    document.getElementById('vers-devise')?.addEventListener('change', (e) => {
      const divTaux = document.getElementById('div-taux');
      divTaux.style.display = e.target.value === 'FC' ? 'block' : 'none';
    });

    // Annulation
    document.getElementById('btn-cancel-vers')?.addEventListener('click', () => {
      import('./versements.list.js').then(m => m.VersementsList.render(container));
    });

    // Enregistrement
    const form = document.getElementById('form-versement');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-save-vers');
      btn.textContent = "Enregistrement...";
      btn.disabled = true;

      try {
        const { FirebaseService } = await import('../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const { Store } = await import('../../core/store.js');
        
        await FirebaseService.init();

        const selectCandidat = document.getElementById('vers-candidat');
        const candidatNom = selectCandidat.options[selectCandidat.selectedIndex].getAttribute('data-nom');

        const data = {
          candidatId: selectCandidat.value,
          candidatNom: candidatNom,
          date: document.getElementById('vers-date').value,
          devise: document.getElementById('vers-devise').value,
          montant: parseFloat(document.getElementById('vers-montant').value) || 0,
          taux: document.getElementById('vers-devise').value === 'FC' ? (parseFloat(document.getElementById('vers-taux').value) || 0) : null,
          province: Store.getProvince(),
          entityId: Store.getEntityId(),
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(FirebaseService.db, 'versements'), data);
        
        alert('Versement enregistré avec succès !');
        import('./versements.list.js').then(m => m.VersementsList.render(container));
        
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur : ' + error.message);
        btn.textContent = "💾 Enregistrer";
        btn.disabled = false;
      }
    });
  }
};