// =========================================
// DÉPOUILLEMENT - RELEVÉ GLOBAL
// =========================================

import { ExportService } from '../../../services/export.service.js';
import { PrintDialog } from '../../../ui/print-dialog.js';

export const ReleveGlobalSeance = {
  async render(container, seanceId) {
    container.innerHTML = `<p style="text-align: center; padding: 20px; color: #0a6e2c;">Calcul du relevé global...</p>`;

    try {
      const { FirebaseService } = await import('../../../services/firebase.service.js');
      const { collection, query, where, getDocs, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();

      const seanceSnap = await getDoc(doc(FirebaseService.db, 'depouillements', seanceId));
      const seance = seanceSnap.data();

      const q = query(collection(FirebaseService.db, 'depouillement_lignes'), where('seanceId', '==', seanceId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        container.innerHTML = `<div style="background: white; padding: 20px; border-radius: 8px;"><p style="color: #666;">Aucune saisie pour cette séance.</p></div>`;
        return;
      }

      let entites = {};
      snapshot.forEach(doc => {
        const d = doc.data();
        const id = d.entityId || 'Entité inconnue';
        const nom = d.entityName || id.substring(0, 8);

        if (!entites[id]) {
          entites[id] = {
            nom: nom, enveloppes: 0,
            constructionFc: 0, constructionUsd: 0,
            normalesFc: 0, normalesUsd: 0,
            offrandes: {
              init: {fc:0, usd:0, details:[]}, sorei: {fc:0, usd:0, details:[]}, kannon: {fc:0, usd:0, details:[]}, 
              photo: {fc:0, usd:0, details:[]}, shinrei: {fc:0, usd:0, details:[]}, gosh: {fc:0, usd:0, details:[]}, mita: {fc:0, usd:0, details:[]}
            },
            transport: 0
          };
        }

        entites[id].enveloppes += d.enveloppes?.fc || 0;
        entites[id].constructionFc += d.construction?.fc || 0;
        entites[id].constructionUsd += d.construction?.usd || 0;
        entites[id].normalesFc += d.normales?.fc || 0;
        entites[id].normalesUsd += d.normales?.usd || 0;
        entites[id].transport += d.transport || 0;

        if (d.offrandes) {
          Object.keys(d.offrandes).forEach(key => {
            if (entites[id].offrandes[key]) {
              entites[id].offrandes[key].fc += d.offrandes[key].fc || 0;
              entites[id].offrandes[key].usd += d.offrandes[key].usd || 0;
              if (d.offrandes[key].details) {
                entites[id].offrandes[key].details.push(...d.offrandes[key].details);
              }
            }
          });
        }
      });

      let htmlEntites = '';
      let grandTotalSoldeFc = 0;
      let grandTotalSoldeUsd = 0;

      Object.keys(entites).forEach((id, index) => {
        const e = entites[id];
        
        let totalOffrandesFc = 0;
        let totalOffrandesUsd = 0;
        
        Object.values(e.offrandes).forEach(o => {
          totalOffrandesFc += (o.fc || 0);
          totalOffrandesUsd += (o.usd || 0);
        });
        
        const totalFc = e.constructionFc + e.normalesFc + totalOffrandesFc;
        const totalUsd = e.constructionUsd + e.normalesUsd + totalOffrandesUsd;
        
        const soldeFc = totalFc - e.transport;
        const soldeUsd = totalUsd; 

        grandTotalSoldeFc += soldeFc;
        grandTotalSoldeUsd += soldeUsd;

        htmlEntites += `
          <div style="border: 2px solid #0a6e2c; border-radius: 4px; margin-bottom: 24px; overflow: hidden; background: white;">
            <div style="background: #0a6e2c; color: white; padding: 8px; text-align: center; font-weight: bold;">
              ${e.nom}
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="background: #e6f4ea;">
                <td style="padding: 6px 8px; border: 1px solid #ddd;">ENVELOPPES (Nombre)</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;" colspan="2">${e.enveloppes}</td>
              </tr>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">CONSTRUCTIONS</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.constructionFc}</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.constructionUsd}</td>
              </tr>
              <tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">NORMALES</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.normalesFc}</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.normalesUsd}</td>
              </tr>
              <tr style="background: #fff3cd; font-weight: bold;">
                <td style="padding: 6px 8px; border: 1px solid #ddd;">TOTALE RECETTES</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${totalFc}</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${totalUsd}</td>
              </tr>
              
              <tr style="background: #d4edda; font-weight: bold;">
                <td style="padding: 6px 8px; border: 1px solid #ddd;" colspan="3">OFFRANDES SPÉCIFIQUES</td>
              </tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Initiation</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.init.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.init.usd}</td></tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Sorei Saichi</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.sorei.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.sorei.usd}</td></tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Kannon</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.kannon.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.kannon.usd}</td></tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Photo Sacrée</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.photo.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.photo.usd}</td></tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Shinrei Saichi</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.shinrei.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.shinrei.usd}</td></tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Goshintai</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.gosh.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.gosh.usd}</td></tr>
              <tr><td style="padding: 6px 8px; border: 1px solid #ddd;">Mitamaya</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.mita.fc}</td><td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">${e.offrandes.mita.usd}</td></tr>

              <tr style="background: #d1ecf1; font-weight: bold; color: #0c5460;">
                <td style="padding: 6px 8px; border: 1px solid #ddd;">TRANSPORT (Dépense)</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">- ${e.transport}</td>
                <td style="padding: 6px 8px; border: 1px solid #ddd; text-align: right;">-</td>
              </tr>
              <tr style="background: #d4edda; font-weight: bold; color: #155724; font-size: 14px;">
                <td style="padding: 8px; border: 1px solid #ddd;">SOLDE ENTITÉ</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${soldeFc} FC</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${soldeUsd} $</td>
              </tr>
            </table>
          </div>
        `;
      });

      container.innerHTML = `
        <div style="background: #f5f7fa; padding: 24px; border-radius: 8px;">
          
          <!-- BARRE D'OUTILS (Cachée à l'impression) -->
          <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 8px;">
            <h3 style="color: #0a6e2c; margin: 0;">Relevé du Dépouillement</h3>
            <div style="display: flex; gap: 8px;">
              <button id="btn-print-releve" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                🖨️ PDF
              </button>
              <button id="btn-export-word" style="padding: 8px 16px; background: #2b579a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                📝 Word
              </button>
              <button id="btn-export-excel" style="padding: 8px 16px; background: #217346; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;">
                📊 Excel
              </button>
            </div>
          </div>

          <!-- CONTENU À EXPORTER -->
          <div id="contenu-a-exporter" style="background: white; padding: 16px; border-radius: 8px;">
            <div style="background: #0a6e2c; color: white; padding: 12px; border-radius: 4px; margin-bottom: 24px; text-align: center;">
              <strong>RAPPORT DÉPOUILLEMENT</strong> - Séance du ${seance.date} - Phase ${seance.phase}
            </div>

            ${htmlEntites}

            <table id="tableau-totaux" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="background: #0a6e2c; color: white;">
                <td style="padding: 16px; font-weight: bold; border: 1px solid #0a6e2c;">TOTAL SOLDE (Toutes entités)</td>
                <td style="text-align: right; padding: 16px; font-weight: bold; border: 1px solid #0a6e2c;">${grandTotalSoldeFc} FC</td>
                <td style="text-align: right; padding: 16px; font-weight: bold; border: 1px solid #0a6e2c;">${grandTotalSoldeUsd} $</td>
              </tr>
            </table>
          </div>

          <!-- SECTION DÉPENSES GÉNÉRALES (Pas exportée) -->
          <div class="no-print" style="border: 2px solid #dc3545; border-radius: 4px; margin-top: 24px; margin-bottom: 24px; overflow: hidden;">
            <div style="background: #dc3545; color: white; padding: 8px; text-align: center; font-weight: bold;">
              DÉPENSES GÉNÉRALES (FC)
            </div>
            <div style="padding: 16px; background: white;">
              <div id="liste-depenses" style="margin-bottom: 16px;"></div>
              
              <div style="display: flex; gap: 8px; align-items: flex-end; margin-bottom: 16px; flex-wrap: wrap;">
                <div style="flex: 2; min-width: 150px;">
                  <label style="font-size: 12px; color: #555;">Motif</label>
                  <input type="text" id="dep-motif" placeholder="Ex: Loyer Kinshasa" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="flex: 1; min-width: 100px;">
                  <label style="font-size: 12px; color: #555;">Montant (FC)</label>
                  <input type="number" id="dep-montant" min="0" placeholder="0" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <button id="btn-add-depense" style="padding: 8px 16px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                  ➕ Ajouter
                </button>
              </div>

              <button id="btn-calc-depenses" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; width: 100%;">
                Calculer le Solde Final
              </button>
            </div>
          </div>

          <!-- SOLDE À TRANSFÉRER -->
          <div id="solde-final-container" style="background: #004085; color: white; padding: 16px; border-radius: 4px; display: none;">
             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 14px;">Total Dépenses Générales :</span>
                <span id="display-total-depenses" style="font-weight: bold; color: #ffc107;">0 FC</span>
             </div>
             <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 8px;">
                <strong style="font-size: 16px;">SOLDE À TRANSFÉRER À LA BANQUE</strong>
                <div style="text-align: right;">
                  <span id="display-solde-final-fc" style="font-size: 20px; font-weight: bold; display: block;">${grandTotalSoldeFc} FC</span>
                  <span id="display-solde-final-usd" style="font-size: 16px; font-weight: bold;">${grandTotalSoldeUsd} $</span>
                </div>
             </div>
          </div>

        </div>
      `;

      // --- LOGIQUE DÉPENSES DYNAMIQUES ---
      let depensesArray = [];
      const listeDepenses = document.getElementById('liste-depenses');

      document.getElementById('btn-add-depense')?.addEventListener('click', () => {
        const motif = document.getElementById('dep-motif').value;
        const montant = parseFloat(document.getElementById('dep-montant').value) || 0;

        if (!motif || montant <= 0) {
          alert('Veuillez saisir un motif et un montant valide.');
          return;
        }

        depensesArray.push({ motif, montant });

        const div = document.createElement('div');
        div.style = "display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #eee; font-size: 14px;";
        div.innerHTML = `<span>${motif}</span><strong>${montant} FC</strong>`;
        listeDepenses.appendChild(div);

        document.getElementById('dep-motif').value = '';
        document.getElementById('dep-montant').value = '';
      });

      document.getElementById('btn-calc-depenses')?.addEventListener('click', () => {
        const totalDepenses = depensesArray.reduce((sum, item) => sum + item.montant, 0);
        const soldeFinalFc = grandTotalSoldeFc - totalDepenses;

        const soldeContainer = document.getElementById('solde-final-container');
        if (soldeContainer) {
          soldeContainer.style.display = 'block';
          document.getElementById('display-total-depenses').textContent = totalDepenses + ' FC';
          document.getElementById('display-solde-final-fc').textContent = soldeFinalFc + ' FC';
          document.getElementById('display-solde-final-usd').textContent = grandTotalSoldeUsd + ' $';
        }
      });

      // --- LOGIQUE D'IMPRESSION ET D'EXPORTATION (Bien placés à l'intérieur) ---
      document.getElementById('btn-print-releve')?.addEventListener('click', () => {
        PrintDialog.open();
      });

      document.getElementById('btn-export-word')?.addEventListener('click', () => {
        ExportService.exportToWord('contenu-a-exporter', `Releve_Depouillement_${seance.date}`);
      });

      document.getElementById('btn-export-excel')?.addEventListener('click', () => {
        ExportService.exportToExcel('tableau-totaux', `Releve_Depouillement_${seance.date}`);
      });

    } catch (error) {
      container.innerHTML = `<p style="color: red;">Erreur : ${error.message}</p>`;
    }
  }
};