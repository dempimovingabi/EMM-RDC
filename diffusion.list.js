// =========================================
// FRÉQUENCES - LISTE DES SAISIES JOURNALIÈRES
// =========================================

import { ArchivesService } from '../../archives/archives.service.js';
import { Toast } from '../../../ui/toast.js';

export const DiffusionList = {
  async render(container) {
    // On affiche un petit chargement
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p style="color: #0a6e2c; font-weight: bold;">Chargement des données...</p>
      </div>
    `;

    try {
      const { FirebaseService } = await import('../../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      
      // On récupère les données de la collection
      const querySnapshot = await getDocs(collection(FirebaseService.db, 'freq_diff_jour'));
      
      let rows = '';
      
      if (querySnapshot.empty) {
        rows = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">Aucune donnée enregistrée pour le moment.</td></tr>`;
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          rows += `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 8px;">${data.date || '-'}</td>
              <td style="padding: 12px 8px; text-align: center;">${data.membres || 0}</td>
              <td style="padding: 12px 8px; text-align: center;">${data.sympathisants || 0}</td>
              <td style="padding: 12px 8px; text-align: center;">${data.nouveaux || 0}</td>
              <td style="padding: 12px 8px; text-align: center; white-space: nowrap;">
                <button class="btn-edit-freq" data-id="${doc.id}" style="background: none; border: none; cursor: pointer; font-size: 16px;">✏️</button>
                <button class="btn-archive-freq" data-id="${doc.id}" style="background: none; border: none; cursor: pointer; font-size: 16px;">📦</button>
                <button class="btn-delete-freq" data-id="${doc.id}" style="background: none; border: none; cursor: pointer; font-size: 16px;">🗑️</button>
              </td>
            </tr>
          `;
        });
      }

      container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #0a6e2c; margin: 0;">Relevé Journalier</h3>
            <button id="btn-nouvelle-saisie" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">
              ➕ Nouveau
            </button>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #f5f7fa; border-bottom: 2px solid #ddd;">
                  <th style="padding: 12px 8px; text-align: left; color: #333;">Date</th>
                  <th style="padding: 12px 8px; text-align: center; color: #333;">Membres</th>
                  <th style="padding: 12px 8px; text-align: center; color: #333;">Symp.</th>
                  <th style="padding: 12px 8px; text-align: center; color: #333;">Nouveaux</th>
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

      // --- LOGIQUE DES BOUTONS ---

      // 1. Bouton Nouveau
      document.getElementById('btn-nouvelle-saisie')?.addEventListener('click', () => {
        import('./form-journalier.js').then(m => {
          m.FormJournalier.render(container);
        });
      });

      // 2. Bouton Modifier
      document.querySelectorAll('.btn-edit-freq').forEach(btn => {
        btn.addEventListener('click', (e) => {
          alert('Fonction de modification à venir !');
        });
      });

      // 3. Bouton Supprimer (avec Firebase)
      document.querySelectorAll('.btn-delete-freq').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("Voulez-vous vraiment supprimer cette donnée ?")) {
            const id = e.target.getAttribute('data-id');
            try {
              const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
              await deleteDoc(doc(FirebaseService.db, 'freq_diff_jour', id));
              Toast.success('Donnée supprimée avec succès !');
              DiffusionList.render(container); // Recharger la liste
            } catch (error) {
              Toast.error('Erreur lors de la suppression.');
            }
          }
        });
      });

      // 4. Bouton Archiver (avec ArchivesService)
      document.querySelectorAll('.btn-archive-freq').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("Voulez-vous archiver cette donnée ? Elle sera déplacée vers la bibliothèque.")) {
            const id = e.target.getAttribute('data-id');
            const docSnap = querySnapshot.docs.find(d => d.id === id);
            
            if (docSnap) {
              try {
                await ArchivesService.archiver('freq_diff_jour', id, docSnap.data());
                Toast.success('Donnée archivée avec succès !');
                DiffusionList.render(container); // Recharger la liste
              } catch (err) {
                Toast.error('Erreur lors de l\'archivage.');
              }
            }
          }
        });
      });

    } catch (error) {
      console.error('Erreur:', error);
      container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
          <h3 style="color: #dc3545; margin-top: 0;">Erreur de chargement</h3>
          <p style="color: #333;">${error.message}</p>
        </div>
      `;
    }
  }
};