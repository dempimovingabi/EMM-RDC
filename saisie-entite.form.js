// =========================================
// DÉPOUILLEMENT - SAISIE DES OFFRANDES PAR ENTITÉ
// =========================================

export const SaisieEntiteForm = {
  async render(container, seanceId) {
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const { Store } = await import('../../core/store.js');
      
      await FirebaseService.init();
      
      const seanceRef = doc(FirebaseService.db, 'depouillements', seanceId);
      const seanceSnap = await getDoc(seanceRef);
      
      if (!seanceSnap.exists()) {
        container.innerHTML = `<p style="color: red;">Séance introuvable.</p>`;
        return;
      }
      
      const seance = seanceSnap.data();
      const nomEntite = Store.getEntityName() || "Entité Inconnue";

      const rubriques = [
        { id: 'init', titre: 'Initiation' },
        { id: 'sorei', titre: 'Sorei Saichi' },
        { id: 'kannon', titre: 'Kannon' },
        { id: 'photo', titre: 'Photo Sacrée' },
        { id: 'shinrei', titre: 'Shinrei Saichi' },
        { id: 'gosh', titre: 'Goshintai Familial' },
        { id: 'mita', titre: 'Mitamaya' }
      ];

      let htmlOffrandes = '';
      rubriques.forEach(rub => {
        htmlOffrandes += `
          <div style="border: 1px solid #ddd; border-radius: 6px; margin-bottom: 16px; overflow: hidden;">
            <div style="background: #e6f4ea; padding: 8px; font-weight: bold; color: #0a6e2c; border-bottom: 1px solid #ddd;">
              ${rub.titre}
            </div>
            
            <div style="padding: 8px; background: #fafafa; border-bottom: 1px solid #eee;">
              <input type="text" id="nom-${rub.id}" placeholder="Nom de la personne" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; margin-bottom: 8px; box-sizing: border-box;">
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 40px; gap: 8px;">
                <input type="number" id="fc-${rub.id}" min="0" placeholder="FC" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; box-sizing: border-box;">
                <input type="number" id="usd-${rub.id}" min="0" step="0.01" placeholder="USD" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; box-sizing: border-box;">
                <button type="button" class="btn-add-offrande" data-id="${rub.id}" style="background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px;">+</button>
              </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tbody id="list-${rub.id}"></tbody>
              <tfoot style="background: #f8f9fa; font-weight: bold;">
                <tr>
                  <td style="padding: 8px; text-align: right;">TOTAL</td>
                  <td style="padding: 8px; text-align: right; width: 80px;"><span id="total-fc-${rub.id}">0</span> FC</td>
                  <td style="padding: 8px; text-align: right; width: 80px;"><span id="total-usd-${rub.id}">0</span> $</td>
                  <td style="width: 60px;"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        `;
      });

      container.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: #0a6e2c; margin: 0;">Saisie des Offrandes</h3>
            <span style="background: #e6f4ea; color: #0a6e2c; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
              ${nomEntite} - Séance du ${seance.date}
            </span>
          </div>
          
          <form id="form-saisie-entite" style="margin-top: 16px;">
            
            <h4 style="color: #0a6e2c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">1. Montants Globaux</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div>
                <label style="font-size: 13px; color: #555;">Enveloppes (Nombre)</label>
                <input type="number" id="s-enveloppes-fc" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 13px; color: #555;">Construction (FC)</label>
                <input type="number" id="s-construction-fc" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 13px; color: #555;">Construction (USD)</label>
                <input type="number" id="s-construction-usd" min="0" step="0.01" placeholder="0.00" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 13px; color: #555;">Normales (FC)</label>
                <input type="number" id="s-normales-fc" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div>
                <label style="font-size: 13px; color: #555;">Normales (USD)</label>
                <input type="number" id="s-normales-usd" min="0" step="0.01" placeholder="0.00" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
            </div>

            <h4 style="color: #0a6e2c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">2. Détail des Offrandes Spécifiques</h4>
            ${htmlOffrandes}

            <h4 style="color: #0a6e2c; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 16px;">3. Dépense</h4>
            <div style="margin-bottom: 24px;">
              <label style="font-size: 13px; color: #555;">Transport (Dépense FC)</label>
              <input type="number" id="s-transport" min="0" placeholder="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>

            <div style="display: flex; gap: 12px; margin-top: 32px;">
              <button type="submit" id="btn-save-saisie" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                💾 Enregistrer la Saisie
              </button>
              <button type="button" id="btn-cancel-saisie" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
                Annuler
              </button>
            </div>

          </form>
        </div>
      `;

      // --- LOGIQUE D'AJOUT / MODIFICATION / SUPPRESSION ---
      const offrandesData = {}; 
      rubriques.forEach(r => offrandesData[r.id] = { details: [], totalFc: 0, totalUsd: 0 });

      // Fonction pour rafraichir l'affichage d'une rubrique
      const renderRubriqueTable = (rubId) => {
        const tbody = document.getElementById(`list-${rubId}`);
        tbody.innerHTML = '';
        let totalFc = 0;
        let totalUsd = 0;

        offrandesData[rubId].details.forEach((item, index) => {
          totalFc += item.fc;
          totalUsd += item.usd;

          const row = document.createElement('tr');
          row.style.borderBottom = "1px solid #eee";
          row.innerHTML = `
            <td style="padding: 6px 8px;">${item.nom}</td>
            <td style="padding: 6px 8px; text-align: right;">${item.fc > 0 ? item.fc : '-'}</td>
            <td style="padding: 6px 8px; text-align: right;">${item.usd > 0 ? item.usd : '-'}</td>
            <td style="padding: 6px 8px; text-align: center; white-space: nowrap;">
              <button type="button" class="btn-edit-row" data-id="${rubId}" data-index="${index}" style="background: none; border: none; cursor: pointer; font-size: 14px;">✏️</button>
              <button type="button" class="btn-delete-row" data-id="${rubId}" data-index="${index}" style="background: none; border: none; cursor: pointer; font-size: 14px;">🗑️</button>
            </td>
          `;
          tbody.appendChild(row);
        });

        document.getElementById(`total-fc-${rubId}`).textContent = totalFc;
        document.getElementById(`total-usd-${rubId}`).textContent = totalUsd;

        // Réattacher les événements de modification et suppression
        tbody.querySelectorAll('.btn-delete-row').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const idx = parseInt(e.target.getAttribute('data-index'));
            offrandesData[id].details.splice(idx, 1); // Supprime l'élément
            renderRubriqueTable(id); // Rafraichit le tableau
          });
        });

        tbody.querySelectorAll('.btn-edit-row').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const idx = parseInt(e.target.getAttribute('data-index'));
            const item = offrandesData[id].details[idx];
            
            // Remplir les champs du haut pour modification
            document.getElementById(`nom-${id}`).value = item.nom;
            document.getElementById(`fc-${id}`).value = item.fc;
            document.getElementById(`usd-${id}`).value = item.usd;

            // Supprimer l'ancienne ligne
            offrandesData[id].details.splice(idx, 1);
            renderRubriqueTable(id); // Rafraichit le tableau
          });
        });
      };

      // Écouteur pour le bouton Ajouter (+)
      document.querySelectorAll('.btn-add-offrande').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const rubId = e.target.getAttribute('data-id');
          const nom = document.getElementById(`nom-${rubId}`).value.trim();
          const fc = parseFloat(document.getElementById(`fc-${rubId}`).value) || 0;
          const usd = parseFloat(document.getElementById(`usd-${rubId}`).value) || 0;

          if (!nom) {
            alert('Veuillez saisir le nom.');
            return;
          }

          offrandesData[rubId].details.push({ nom, fc, usd });
          renderRubriqueTable(rubId);

          document.getElementById(`nom-${rubId}`).value = '';
          document.getElementById(`fc-${rubId}`).value = '';
          document.getElementById(`usd-${rubId}`).value = '';
        });
      });

      document.getElementById('btn-cancel-saisie')?.addEventListener('click', () => {
        import('./depouillement.page.js').then(m => m.DepouillementPage.render());
      });

      const form = document.getElementById('form-saisie-entite');
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('btn-save-saisie');
        btn.textContent = "Enregistrement...";
        btn.disabled = true;

        try {
          const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

          const offrandesFinales = {};
          rubriques.forEach(r => {
             offrandesFinales[r.id] = {
                fc: offrandesData[r.id].details.reduce((sum, item) => sum + item.fc, 0),
                usd: offrandesData[r.id].details.reduce((sum, item) => sum + item.usd, 0),
                details: offrandesData[r.id].details
             };
          });

          const data = {
            seanceId: seanceId,
            dateSeance: seance.date,
            entityId: Store.getEntityId(),
            entityName: nomEntite,
            enveloppes: { fc: parseFloat(document.getElementById('s-enveloppes-fc').value) || 0 },
            construction: {
              fc: parseFloat(document.getElementById('s-construction-fc').value) || 0,
              usd: parseFloat(document.getElementById('s-construction-usd').value) || 0
            },
            normales: {
              fc: parseFloat(document.getElementById('s-normales-fc').value) || 0,
              usd: parseFloat(document.getElementById('s-normales-usd').value) || 0
            },
            offrandes: offrandesFinales,
            transport: parseFloat(document.getElementById('s-transport').value) || 0,
            province: Store.getProvince(),
            createdAt: new Date().toISOString()
          };

          await addDoc(collection(FirebaseService.db, 'depouillement_lignes'), data);
          
          alert('Saisie enregistrée avec succès !');
          import('./depouillement.page.js').then(m => m.DepouillementPage.render());
          
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur : ' + error.message);
          btn.textContent = "💾 Enregistrer la Saisie";
          btn.disabled = false;
        }
      });

    } catch (error) {
      console.error('Erreur chargement séance:', error);
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};