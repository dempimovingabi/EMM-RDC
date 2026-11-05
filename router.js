// =========================================
// ROUTEUR - Navigation entre les pages
// =========================================

import { DashboardView } from '../modules/dashboard/dashboard.view.js';
import { FrequencesPage } from '../modules/frequences/frequences.page.js';
import { FinancePage } from '../modules/finance/finance.page.js';
import { DepouillementPage } from '../modules/depouillement/depouillement.page.js';
import { PatrimoinePage } from '../modules/patrimoine/patrimoine.page.js';
import { AdministrationPage } from '../modules/administration/administration.page.js';
import { PremiumPage } from '../modules/premium/premium.page.js';
import { ArchivesPage } from '../modules/archives/archives.page.js'; // Si tu l'as créé

export const Router = {
  currentPage: 'dashboard',
  userEmail: '',

  init(email) {
    this.userEmail = email;
    this.navigate('dashboard');
  },

  navigate(pageId) {
    this.currentPage = pageId;
    const main = document.getElementById('app-main');
    if (!main) return;

    switch (pageId) {
      case 'dashboard':
        DashboardView.render(this.userEmail);
        break;
      case 'frequences':
        FrequencesPage.render();
        break;
      case 'finance':
        FinancePage.render();
        break;
      case 'depouillement':
        DepouillementPage.render();
        break;
      case 'patrimoine':
        PatrimoinePage.render();
        break;
      case 'administration':
        AdministrationPage.render();
        break;
      case 'premium':
        PremiumPage.render();
        break;
      case 'archives':
        ArchivesPage.render();
        break;
      default:
        this.renderConstruction(main, 'Page inconnue', '❓');
    }
  },

  renderConstruction(container, title, icon) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 64px; margin-bottom: 16px;">${icon}</div>
        <h2 style="color: #0a6e2c; margin-bottom: 8px;">Module ${title}</h2>
        <p style="color: #666; margin-bottom: 24px;">Cette page est en cours de construction.</p>
        <button onclick="window.router.navigate('dashboard')" style="padding: 10px 20px; background: #0a6e2c; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ← Retour au tableau de bord
        </button>
      </div>
    `;
  }
};

// On l'attache à window pour que les boutons HTML puissent y accéder
window.router = Router;