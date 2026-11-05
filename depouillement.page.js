// =========================================
// MODULE : DÉPOUILLEMENT
// =========================================

import { SaisieEntiteForm } from './saisie-entite.form.js';
import { ReleveGlobalSeance } from './rapports/releve-global-seance.js';

export const DepouillementPage = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div style="padding-bottom: 20px;">
        <button onclick="window.router.navigate('dashboard')" style="margin-bottom: 16px; background: none; border: none; color: #0a6e2c; font-weight: bold; cursor: pointer;">
          ← Retour au tableau de bord
        </button>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
          <h2 style="color: #0a6e2c; margin: 0;">Module Dépouillement</h2>
          <p style="color: #666; margin: 8px 0 0 0;">Gestion des séances et des offrandes</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          <button id="btn-nouvelle-seance" style="padding: 12px 20px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            ➕ Nouvelle Séance
          </button>
          <button id="btn-historique" style="padding: 12px 20px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            📋 Historique des séances
          </button>
        </div>

        <div id="depouillement-content" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="text-align: center; color: #666; padding: 40px 0;">
            Sélectionnez une action ci-dessus pour commencer.
          </p>
        </div>
      </div>
    `;

    document.getElementById('btn-nouvelle-seance')?.addEventListener('click', () => {
      import('./seance.form.js').then(m => {
        m.SeanceForm.render(document.getElementById('depouillement-content'));
      });
    });

    document.getElementById('btn-historique')?.addEventListener('click', async () => {
      const content = document.getElementById('depouillement-content');
      content.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Chargement de l'historique...</p>`;

      try {
        const { FirebaseService } = await import('../../services/firebase.service.js');
        const { collection, getDocs, doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        await FirebaseService.init();
        
        const snapshot = await getDocs(collection(FirebaseService.db, 'depouillements'));
        
        let html = `<h3 style="color: #0a6e2c;">Séances enregistrées</h3>`;
        
        if (snapshot.empty) {
          html += `<p style="color: #666; text-align: center; padding: 20px;">Aucune séance enregistrée.</p>`;
        } else {
          html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
          snapshot.forEach(docSnap => {
            const s = docSnap.data();
            const nomAffiche = s.nomEntite ? s.nomEntite : `Séance du ${s.date}`;
            
            html += `
              <div style="border: 1px solid #eee; padding: 12px; border-radius: 8px; background: #fafafa;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div>
                    <strong style="color: #333; font-size: 15px;">${nomAffiche}</strong><br>
                    <span style="font-size: 12px; color: #666;">Date : ${s.date} | Phase : ${s.phase}</span>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn-edit-seance" data-id="${docSnap.id}" style="background: none; border: none; font-size: 16px; cursor: pointer;">✏️</button>
                    <button class="btn-delete-seance" data-id="${docSnap.id}" style="background: none; border: none; font-size: 16px; cursor: pointer;">🗑️</button>
                  </div>
                </div>
                
                <div style="display: flex; gap: 6px; margin-top: 8px;">
                  <button class="btn-saisir-off" data-id="${docSnap.id}" style="flex: 1; padding: 8px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer;">
                    Saisir
                  </button>
                  <button class="btn-releve" data-id="${docSnap.id}" style="flex: 1; padding: 8px; background: #17a2b8; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 12px; cursor: pointer;">
                    📋 Relevé
                  </button>
                </div>
              </div>
            `;
          });
          html += `</div>`;
        }

        content.innerHTML = html;

        // Événements Saisir
        document.querySelectorAll('.btn-saisir-off').forEach(btn => {
          btn.addEventListener('click', (e) => {
            SaisieEntiteForm.render(content, e.target.getAttribute('data-id'));
          });
        });

        // Événements Relevé
        document.querySelectorAll('.btn-releve').forEach(btn => {
          btn.addEventListener('click', (e) => {
            ReleveGlobalSeance.render(content, e.target.getAttribute('data-id'));
          });
        });

        // Événements Supprimer Séance
        document.querySelectorAll('.btn-delete-seance').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            if (confirm("Voulez-vous vraiment supprimer cette séance et toutes ses données ?")) {
              const id = e.target.getAttribute('data-id');
              await deleteDoc(doc(FirebaseService.db, 'depouillements', id));
              document.getElementById('btn-historique').click(); // Recharge la liste
            }
          });
        });

        // Événements Modifier Séance
        document.querySelectorAll('.btn-edit-seance').forEach(btn => {
          btn.addEventListener('click', (e) => {
            alert("La modification de la séance sera disponible dans la prochaine mise à jour.");
            // On pourrait rediriger vers SeanceForm avec l'ID pour le pré-remplir
          });
        });

      } catch (err) {
        content.innerHTML = `<p style="color: red;">Erreur : ${err.message}</p>`;
      }
    });
  }
};