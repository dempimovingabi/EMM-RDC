// =========================================
// MODULE : PATRIMOINE
// =========================================

import { SitesList } from './sites.list.js';
import { BiensList } from './biens.list.js';
import { ReparationsList } from './reparations.list.js';

export const PatrimoinePage = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div style="padding-bottom: 20px;">
        <button onclick="window.router.navigate('dashboard')" style="margin-bottom: 16px; background: none; border: none; color: #0a6e2c; font-weight: bold; cursor: pointer;">
          ← Retour au tableau de bord
        </button>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
          <h2 style="color: #0a6e2c; margin: 0;">Module Patrimoine</h2>
          <p style="color: #666; margin: 8px 0 0 0;">Gestion des sites, biens et réparations</p>
        </div>

        <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
          <button id="tab-sites" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid #0a6e2c; color: #0a6e2c; font-weight: bold; cursor: pointer;">🏠 Sites</button>
          <button id="tab-biens" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid transparent; color: #666; font-weight: bold; cursor: pointer;">📦 Biens</button>
          <button id="tab-reparations" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid transparent; color: #666; font-weight: bold; cursor: pointer;">🔧 Réparations</button>
        </div>

        <div id="patrimoine-content"></div>
      </div>
    `;

    document.getElementById('tab-sites')?.addEventListener('click', () => this.switchTab('sites'));
    document.getElementById('tab-biens')?.addEventListener('click', () => this.switchTab('biens'));
    document.getElementById('tab-reparations')?.addEventListener('click', () => this.switchTab('reparations'));

    this.switchTab('sites');
  },

  switchTab(tabName) {
    const content = document.getElementById('patrimoine-content');
    
    ['sites', 'biens', 'reparations'].forEach(t => {
      const btn = document.getElementById(`tab-${t}`);
      if (btn) {
        btn.style.borderBottom = t === tabName ? '2px solid #0a6e2c' : '2px solid transparent';
        btn.style.color = t === tabName ? '#0a6e2c' : '#666';
      }
    });

    if (tabName === 'sites') {
      SitesList.render(content);
    } else if (tabName === 'biens') {
      BiensList.render(content);
    } else if (tabName === 'reparations') {
      ReparationsList.render(content); // <-- On charge la liste des réparations
    }
  }
};