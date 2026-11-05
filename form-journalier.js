// =========================================
// FRÉQUENCES - SAISIE JOURNALIÈRE (DIFFUSION)
// =========================================

import { Toast } from '../../../ui/toast.js';
import { Store } from '../../../core/store.js';

export const FormJournalier = {
  render(container) {
    // On récupère la date du jour par défaut
    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #0a6e2c; margin-top: 0;">Nouvelle saisie journalière</h3>
        
        <form id="form-frequence-jour" style="margin-top: 16px;">
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Date *</label>
            <input type="date" id="freq-date" value="${today}" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Membres</label>
              <input type="number" id="freq-membres" min="0" placeholder="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Sympathisants</label>
              <input type="number" id="freq-sympathisants" min="0" placeholder="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Nouveaux venus</label>
            <input type="number" id="freq-nouveaux" min="0" placeholder="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="submit" id="btn-save-jour" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              💾 Enregistrer
            </button>
            <button type="button" id="btn-cancel-jour" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              Annuler
            </button>
          </div>

        </form>
      </div>
    `;

    // Gestion de l'annulation
    document.getElementById('btn-cancel-jour')?.addEventListener('click', () => {
      // On retourne à la page Fréquences
      import('../frequences.page.js').then(m => m.FrequencesPage.render());
    });

    // Gestion de l'enregistrement
    const form = document.getElementById('form-frequence-jour');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-save-jour');
      btn.textContent = "Enregistrement...";
      btn.disabled = true;

      // Récupération et validation des données
      const dateVal = document.getElementById('freq-date').value;
      const membres = parseInt(document.getElementById('freq-membres').value) || 0;
      const sympathisants = parseInt(document.getElementById('freq-sympathisants').value) || 0;
      const nouveaux = parseInt(document.getElementById('freq-nouveaux').value) || 0;

      if (!dateVal) {
        Toast.warning('Veuillez sélectionner une date.');
        btn.textContent = "💾 Enregistrer";
        btn.disabled = false;
        return;
      }

      const data = {
        date: dateVal,
        membres: membres,
        sympathisants: sympathisants,
        nouveaux: nouveaux,
        province: Store.getProvince(),      // Récupéré automatiquement du Store
        entityId: Store.getEntityId(),      // Récupéré automatiquement du Store
        entityName: Store.getEntityName(),  // On ajoute le nom pour les rapports
        type: 'journalier',
        createdAt: new Date().toISOString()
      };

      try {
        // Importation dynamique de Firebase
        const { FirebaseService } = await import('../../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        
        // Initialisation
        await FirebaseService.init();
        
        // Ajout du document dans la collection 'freq_diff_jour'
        const docRef = await addDoc(collection(FirebaseService.db, 'freq_diff_jour'), data);
        
        console.log('✅ Document enregistré avec ID:', docRef.id);
        
        // Notification de succès (Toast)
        Toast.success('Données enregistrées avec succès !');
        
        // On remet le bouton à son état normal avant de rediriger
        btn.textContent = "💾 Enregistrer";
        btn.disabled = false;

        // Retour à la page Fréquences après un petit délai pour voir le toast
        setTimeout(() => {
          import('../frequences.page.js').then(m => m.FrequencesPage.render());
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        Toast.error('Erreur lors de l\'enregistrement : ' + error.message);
        btn.textContent = "💾 Enregistrer";
        btn.disabled = false;
      }
    });
  }
};