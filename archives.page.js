// =========================================
// MODULE : ARCHIVES (BIBLIOTHÈQUE)
// =========================================

import { ArchivesService } from './archives.service.js';
import { Toast } from '../../ui/toast.js';

export const ArchivesPage = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div style="padding-bottom: 20px;">
        <button onclick="window.router.navigate('dashboard')" style="margin-bottom: 16px; background: none; border: none; color: #0a6e2c; font-weight: bold; cursor: pointer;">
          ← Retour au tableau de bord
        </button>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
          <h2 style="color: #0a6e2c; margin: 0;">Bibliothèque d'Archives</h2>
          <p style="color: #666; margin: 8px 0 0 0;">Classement hiérarchique des données archivées</p>
        </div>

        <div style="margin-bottom: 20px;">
          <input type="text" id="archive-search" placeholder="🔍 Rechercher (ex: Kinshasa, 2026, Fréquences)..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
        </div>

        <div id="archives-container" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="text-align: center; color: #0a6e2c; padding: 20px;">Chargement de la bibliothèque...</p>
        </div>
      </div>
    `;

    this.loadArchives();

    document.getElementById('archive-search')?.addEventListener('input', (e) => {
      this.filterArchives(e.target.value);
    });
  },

  async loadArchives() {
    const container = document.getElementById('archives-container');
    
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs, doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      await FirebaseService.init();
      
      const snapshot = await getDocs(collection(FirebaseService.db, 'archives'));
      
      if (snapshot.empty) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">📂</div>
            <h3 style="color: #666; margin-bottom: 8px;">Aucune archive pour le moment</h3>
            <p style="color: #999; font-size: 14px;">Les données que vous archiverez apparaîtront ici.</p>
          </div>
        `;
        return;
      }

      let groupedArchives = {};
      const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const moisNom = moisNoms[parseInt(data.mois)] || 'Inconnu';
        
        const keyEntite = data.entite;
        const keyModule = data.module;
        const keyAnnee = data.annee;
        const keyMois = moisNom;

        if (!groupedArchives[keyEntite]) groupedArchives[keyEntite] = {};
        if (!groupedArchives[keyEntite][keyModule]) groupedArchives[keyEntite][keyModule] = {};
        if (!groupedArchives[keyEntite][keyModule][keyAnnee]) groupedArchives[keyEntite][keyModule][keyAnnee] = {};
        if (!groupedArchives[keyEntite][keyModule][keyAnnee][keyMois]) groupedArchives[keyEntite][keyModule][keyAnnee][keyMois] = [];

        groupedArchives[keyEntite][keyModule][keyAnnee][keyMois].push({ id: docSnap.id, ...data });
      });

      let html = '';

      for (const entite in groupedArchives) {
        html += `<div class="archive-group" style="margin-bottom: 24px;">`;
        html += `<h3 style="color: #0a6e2c; border-bottom: 2px solid #0a6e2c; padding-bottom: 8px;">🏢 ${entite}</h3>`;
        
        for (const module in groupedArchives[entite]) {
          html += `<div style="margin-left: 16px; margin-top: 12px;">`;
          html += `<h4 style="color: #17a2b8; margin: 0 0 8px 0;">📁 ${module}</h4>`;
          
          for (const annee in groupedArchives[entite][module]) {
            html += `<div style="margin-left: 16px;">`;
            html += `<strong style="color: #333;">Année ${annee}</strong>`;
            
            for (const mois in groupedArchives[entite][module][annee]) {
              html += `<div style="margin-left: 16px; margin-top: 8px; background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #eee;">`;
              html += `<span style="font-size: 13px; font-weight: bold; color: #555;">Mois de ${mois}</span>`;
              html += `<ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px;">`;
              
              groupedArchives[entite][module][annee][mois].forEach(archive => {
                // 🚨 AMÉLIORATION : On définit un titre clair selon le type de donnée
                let titreDonnee = "Donnée archivée";
                const d = archive.originalData;
                
                if (archive.collectionSource === 'freq_diff_jour') {
                  titreDonnee = `Saisie journalière du ${d.date || 'date inconnue'}`;
                } else if (archive.collectionSource === 'depouillements') {
                  titreDonnee = `Séance de dépouillement - Phase ${d.phase || ''} (${d.date || ''})`;
                } else if (archive.collectionSource === 'candidats') {
                  titreDonnee = `Candidat : ${d.nom || ''} (${d.motif || ''})`;
                } else if (archive.collectionSource === 'versements') {
                  titreDonnee = `Versement de ${d.montant || 0} ${d.devise || ''} le ${d.date || ''}`;
                } else if (d.date) {
                  titreDonnee = `Donnée du ${d.date}`;
                }

                html += `
                  <li style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #ddd;">
                    <div style="font-weight: 500; color: #333; margin-bottom: 4px;">📄 ${titreDonnee}</div>
                    <div style="font-size: 11px; color: #888; margin-bottom: 6px;">Archivé le ${new Date(archive.archivedAt).toLocaleDateString('fr-FR')}</div>
                    
                    <button class="btn-restaurer" data-id="${archive.id}" style="background: #17a2b8; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">↩️ Restaurer</button>
                    <button class="btn-supprimer-archive" data-id="${archive.id}" style="background: #dc3545; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 4px;">🗑️ Supprimer</button>
                  </li>
                `;
              });
              
              html += `</ul></div>`;
            }
            html += `</div>`;
          }
          html += `</div>`;
        }
        html += `</div>`;
      }

      container.innerHTML = html;

      // --- LOGIQUE DES BOUTONS ---
      document.querySelectorAll('.btn-supprimer-archive').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("Supprimer DÉFINITIVEMENT cette archive ? Cette action est irréversible.")) {
            const id = e.target.getAttribute('data-id');
            await deleteDoc(doc(FirebaseService.db, 'archives', id));
            Toast.success('Archive supprimée.');
            ArchivesPage.loadArchives();
          }
        });
      });

      document.querySelectorAll('.btn-restaurer').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          if (confirm("Restaurer cette donnée dans son module d'origine ?")) {
            const id = e.target.getAttribute('data-id');
            const snap = await getDocs(collection(FirebaseService.db, 'archives'));
            const archiveData = snap.docs.find(d => d.id === id).data();
            
            try {
              await ArchivesService.restaurer(id, archiveData);
              Toast.success('Donnée restaurée avec succès !');
              ArchivesPage.loadArchives();
            } catch (err) {
              Toast.error('Erreur lors de la restauration.');
            }
          }
        });
      });

    } catch (error) {
      container.innerHTML = `<p style="color: red; padding: 20px;">Erreur : ${error.message}</p>`;
    }
  },

  filterArchives(searchTerm) {
    const groups = document.querySelectorAll('.archive-group');
    const term = searchTerm.toLowerCase();
    
    groups.forEach(group => {
      const text = group.innerText.toLowerCase();
      if (text.includes(term)) {
        group.style.display = 'block';
      } else {
        group.style.display = 'none';
      }
    });
  }
};