// =========================================
// MODULE : FINANCE
// =========================================

export const FinancePage = {
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
          <h2 style="color: #0a6e2c; margin: 0;">Module Finance</h2>
          <p style="color: #666; margin: 8px 0 0 0;">Gestion des candidats et des versements</p>
        </div>

        <!-- Onglets -->
        <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
          <button id="tab-candidats" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid #0a6e2c; color: #0a6e2c; font-weight: bold; cursor: pointer;">
            👤 Candidats
          </button>
          <button id="tab-versements" style="flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid transparent; color: #666; font-weight: bold; cursor: pointer;">
            💵 Versements
          </button>
        </div>

        <!-- Contenu -->
        <div id="finance-content"></div>
      </div>
    `;

    // Gestion des clics sur les onglets
    document.getElementById('tab-candidats')?.addEventListener('click', () => {
      this.switchTab('candidats');
    });
    document.getElementById('tab-versements')?.addEventListener('click', () => {
      this.switchTab('versements');
    });

    // Affichage par défaut
    this.switchTab('candidats');
  },

  switchTab(tabName) {
    const content = document.getElementById('finance-content');
    const tabCand = document.getElementById('tab-candidats');
    const tabVers = document.getElementById('tab-versements');

    if (tabName === 'candidats') {
      tabCand.style.borderBottom = '2px solid #0a6e2c';
      tabCand.style.color = '#0a6e2c';
      tabVers.style.borderBottom = '2px solid transparent';
      tabVers.style.color = '#666';
      
      // On charge la liste des candidats
      import('./candidats.list.js').then(m => m.CandidatsList.render(content));
    } else {
      tabVers.style.borderBottom = '2px solid #0a6e2c';
      tabVers.style.color = '#0a6e2c';
      tabCand.style.borderBottom = '2px solid transparent';
      tabCand.style.color = '#666';
      
      // On charge la liste des versements
      import('./versements.list.js').then(m => m.VersementsList.render(content));
    }
  }
};