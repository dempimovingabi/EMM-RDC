// =========================================
// FRÉQUENCES - BILAN MENSUEL (DIFFUSION)
// =========================================

export const FormMensuel = {
  render(container) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    container.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #0a6e2c; margin-top: 0;">Bilan Mensuel - Diffusion</h3>
        
        <form id="form-frequence-mois" style="margin-top: 16px;">
          
          <!-- Mois et Année -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Mois</label>
              <select id="mois-mensuel" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
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
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Année</label>
              <input type="number" id="annee-mensuel" value="${currentYear}" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            </div>
          </div>

          <!-- Section Fréquentation -->
          <h4 style="color: #0a6e2c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">1. Fréquentation Culte</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 24px;">
            <div>
              <label style="font-size: 13px; color: #555;">Membres</label>
              <input type="number" id="mensuel-culte-membres" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Sympathisants</label>
              <input type="number" id="mensuel-culte-sympathisants" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Nouveaux venus</label>
              <input type="number" id="mensuel-culte-nouveaux" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <!-- Section Activités -->
          <h4 style="color: #0a6e2c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">2. Activités</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px;">
            <div>
              <label style="font-size: 13px; color: #555;">Foyers accompagnés</label>
              <input type="number" id="act-foyers" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Goshintai</label>
              <input type="number" id="act-goshintai" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Fleurs distribuées</label>
              <input type="number" id="act-fleurs" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Potagers</label>
              <input type="number" id="act-potagers" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Maisons ouvertes</label>
              <input type="number" id="act-maisons" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="font-size: 13px; color: #555;">Témoignages</label>
              <input type="number" id="act-temoignages" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <!-- Boutons -->
          <div style="display: flex; gap: 12px; margin-top: 32px;">
            <button type="submit" id="btn-save-mois" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              💾 Enregistrer le Bilan
            </button>
            <button type="button" id="btn-cancel-mois" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              Annuler
            </button>
          </div>

        </form>
      </div>
    `;

    // Gestion de l'annulation
    document.getElementById('btn-cancel-mois')?.addEventListener('click', () => {
      import('../frequences.page.js').then(m => m.FrequencesPage.render());
    });

    // Gestion de l'enregistrement
    const form = document.getElementById('form-frequence-mois');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-save-mois');
      btn.textContent = "Enregistrement...";
      btn.disabled = true;

      // Récupération des données
      const data = {
        mois: parseInt(document.getElementById('mois-mensuel').value),
        annee: parseInt(document.getElementById('annee-mensuel').value),
        culte: {
          membres: parseInt(document.getElementById('mensuel-culte-membres').value) || 0,
          sympathisants: parseInt(document.getElementById('mensuel-culte-sympathisants').value) || 0,
          nouveaux: parseInt(document.getElementById('mensuel-culte-nouveaux').value) || 0
        },
        activites: {
          foyers: parseInt(document.getElementById('act-foyers').value) || 0,
          goshintai: parseInt(document.getElementById('act-goshintai').value) || 0,
          fleurs: parseInt(document.getElementById('act-fleurs').value) || 0,
          potagers: parseInt(document.getElementById('act-potagers').value) || 0,
          maisons: parseInt(document.getElementById('act-maisons').value) || 0,
          temoignages: parseInt(document.getElementById('act-temoignages').value) || 0
        },
        province: 'Kinshasa',
        entityId: 'test-entity-1',
        type: 'mensuel',
        createdAt: new Date().toISOString()
      };

      try {
        const { FirebaseService } = await import('../../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        
        await FirebaseService.init();
        await addDoc(collection(FirebaseService.db, 'freq_diff_mois'), data);
        
        alert('Bilan mensuel enregistré avec succès !');
        import('../frequences.page.js').then(m => m.FrequencesPage.render());
        
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur : ' + error.message);
        btn.textContent = "💾 Enregistrer le Bilan";
        btn.disabled = false;
      }
    });
  }
};