// =========================================
// MODULE : ADMINISTRATION
// =========================================

import { AnnoncesList } from './annonces.list.js';
import { MonCompteView } from './mon-compte.view.js';
import { ClientsPremiumView } from './clients-premium.view.js';

export const AdministrationPage = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div style="padding-bottom: 20px;">
        <button onclick="window.router.navigate('dashboard')" style="margin-bottom: 16px; background: none; border: none; color: #0a6e2c; font-weight: bold; cursor: pointer;">
          ← Retour au tableau de bord
        </button>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
          <h2 style="color: #0a6e2c; margin: 0;">Administration</h2>
          <p style="color: #666; margin: 8px 0 0 0;">Gestion des annonces et des comptes</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          <button id="btn-tab-annonces" style="padding: 10px 20px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            📢 Annonces
          </button>
          <button id="btn-tab-compte" style="padding: 10px 20px; background: white; color: #666; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-weight: bold;">
            👤 Mon Compte
          </button>
          <button id="btn-tab-premium" style="padding: 10px 20px; background: white; color: #666; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-weight: bold;">
            ⭐ Clients Premium
          </button>
        </div>

        <div id="admin-content"></div>
      </div>
    `;

    document.getElementById('btn-tab-annonces')?.addEventListener('click', (e) => this.setActiveTab(e.target, 'annonces'));
    document.getElementById('btn-tab-compte')?.addEventListener('click', (e) => this.setActiveTab(e.target, 'compte'));
    document.getElementById('btn-tab-premium')?.addEventListener('click', (e) => this.setActiveTab(e.target, 'premium'));

    this.showTabContent('annonces');
  },

  setActiveTab(btn, tabName) {
    ['annonces', 'compte', 'premium'].forEach(t => {
      const b = document.getElementById(`btn-tab-${t}`);
      if (b) {
        b.style.background = 'white';
        b.style.color = '#666';
        b.style.border = '1px solid #ddd';
      }
    });
    btn.style.background = '#0a6e2c';
    btn.style.color = 'white';
    btn.style.border = 'none';

    this.showTabContent(tabName);
  },

  showTabContent(tabName) {
    const content = document.getElementById('admin-content');
    
    if (tabName === 'annonces') {
      AnnoncesList.render(content);
    } else if (tabName === 'compte') {
      MonCompteView.render(content);
    } else if (tabName === 'premium') {
      // C'est cette ligne qui manquait pour afficher le tableau
      ClientsPremiumView.render(content); 
    }
  }
};