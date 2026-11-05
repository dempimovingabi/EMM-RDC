// =========================================
// MODULE : FRÉQUENCES
// =========================================

import { FormJournalier } from './diffusion/form-journalier.js';
import { FormMensuel } from './diffusion/form-mensuel.js';
import { DiffusionList } from './diffusion/diffusion.list.js';

export const FrequencesPage = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div style="padding-bottom: 20px;">
        <!-- Bouton Retour -->
        <button onclick="window.router.navigate('dashboard')" style="margin-bottom: 16px; background: none; border: none; color: #0a6e2c; font-weight: bold; cursor: pointer;">
          ← Retour au tableau de bord
        </button>

        <!-- En-tête -->
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
          <h2 style="color: #0a6e2c; margin: 0;">Module Fréquences</h2>
          <p style="color: #666; margin: 8px 0 0 0;">Gestion des présences et des rapports</p>
        </div>

        <!-- Onglets -->
        <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
          <button id="tab-diffusion" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid #0a6e2c; color: #0a6e2c; font-weight: bold; cursor: pointer;">
            A. Diffusion
          </button>
          <button id="tab-numerique" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid transparent; color: #666; font-weight: bold; cursor: pointer;">
            B. Numérique
          </button>
        </div>

        <!-- Contenu -->
        <div id="frequences-content">
          <!-- Le contenu sera injecté ici par le contrôleur -->
        </div>
      </div>
    `;

    // Gestion des clics sur les onglets
    document.getElementById('tab-diffusion')?.addEventListener('click', () => {
      this.switchTab('diffusion');
    });
    document.getElementById('tab-numerique')?.addEventListener('click', () => {
      this.switchTab('numerique');
    });

    // Affichage par défaut de l'onglet Diffusion
    this.switchTab('diffusion');
  },

  switchTab(tabName) {
    const content = document.getElementById('frequences-content');
    const tabDiff = document.getElementById('tab-diffusion');
    const tabNum = document.getElementById('tab-numerique');

    // Mise à jour des styles des onglets
    if (tabName === 'diffusion') {
      tabDiff.style.borderBottom = '2px solid #0a6e2c';
      tabDiff.style.color = '#0a6e2c';
      tabNum.style.borderBottom = '2px solid transparent';
      tabNum.style.color = '#666';
    } else {
      tabNum.style.borderBottom = '2px solid #0a6e2c';
      tabNum.style.color = '#0a6e2c';
      tabDiff.style.borderBottom = '2px solid transparent';
      tabDiff.style.color = '#666';
    }

    // Injection du contenu
    if (tabName === 'diffusion') {
      this.renderDiffusion(content);
    } else {
      this.renderNumerique(content);
    }
  },

  renderDiffusion(container) {
    container.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #333; margin-top: 0;">Rapport de Diffusion</h3>
        <p style="color: #666;">Ici, tu pourras enregistrer la fréquence journalière et le bilan mensuel.</p>
        
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;">
          <button id="btn-saisie-journaliere" style="padding: 12px 20px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            ➕ Saisie Journalière
          </button>
          <button id="btn-liste-journaliere" style="padding: 12px 20px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            📋 Voir la liste
          </button>
          <button id="btn-bilan-mensuel" style="padding: 12px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            📅 Bilan Mensuel
          </button>
        </div>
      </div>
    `;

    // Écouteur pour le formulaire journalier
    document.getElementById('btn-saisie-journaliere')?.addEventListener('click', () => {
      FormJournalier.render(container);
    });

    // Écouteur pour la liste
    document.getElementById('btn-liste-journaliere')?.addEventListener('click', () => {
      DiffusionList.render(container);
    });

    // Écouteur pour le bilan mensuel
    document.getElementById('btn-bilan-mensuel')?.addEventListener('click', () => {
      FormMensuel.render(container);
    });
  },

  renderNumerique(container) {
    container.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #333; margin-top: 0;">Rapport Numérique</h3>
        <p style="color: #666;">Ici, tu pourras saisir les données numériques mensuelles (Membres, Fréquentation, Activités...).</p>
        
        <button onclick="alert('Formulaire numérique à venir !')" style="margin-top: 16px; padding: 12px 20px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          ➕ Nouvelle Saisie Numérique
        </button>
      </div>
    `;
  }
};