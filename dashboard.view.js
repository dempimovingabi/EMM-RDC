// =========================================
// VUE : TABLEAU DE BORD (DASHBOARD)
// =========================================

import { DashboardStats } from './dashboard.stats.js';
import { Permissions } from '../../core/permissions.js';

export const DashboardView = {
  render(userEmail) {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div class="dashboard-container">
        <div style="background: #0a6e2c; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 8px 0; font-size: 24px;">Tableau de Bord</h2>
          <p style="margin: 0; opacity: 0.9;">Bienvenue, ${userEmail}</p>
        </div>

        <!-- Cartes KPI -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">Entités actives</p>
            <p id="kpi-entites" style="color: #0a6e2c; font-size: 28px; font-weight: bold; margin: 0;">...</p>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">Présences du mois</p>
            <p id="kpi-presences" style="color: #0a6e2c; font-size: 28px; font-weight: bold; margin: 0;">...</p>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">Versements (USD)</p>
            <p id="kpi-versements" style="color: #0a6e2c; font-size: 28px; font-weight: bold; margin: 0;">...</p>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="color: #666; font-size: 14px; margin: 0 0 8px 0;">Candidats en cours</p>
            <p id="kpi-candidats" style="color: #0a6e2c; font-size: 28px; font-weight: bold; margin: 0;">...</p>
          </div>
        </div>

        <!-- Graphiques -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h4 style="color: #333; margin-top: 0; font-size: 14px;">Répartition des Présences</h4>
            <div style="position: relative; height: 200px;">
              <canvas id="chart-presences"></canvas>
            </div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h4 style="color: #333; margin-top: 0; font-size: 14px;">Entrées vs Sorties (3 mois)</h4>
            <div style="position: relative; height: 200px;">
              <canvas id="chart-finances"></canvas>
            </div>
          </div>
        </div>

        <!-- Bannière Premium -->
        <div style="background: linear-gradient(135deg, #17a2b8, #0a6e2c); padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; color: white;">
          <div>
            <h4 style="margin: 0 0 4px 0; font-size: 16px;">Passez à Premium !</h4>
            <p style="margin: 0; font-size: 13px; opacity: 0.9;">Débloquez les exports PDF et les rapports avancés.</p>
          </div>
          <button onclick="if(window.router) window.router.navigate('premium')" style="padding: 10px 16px; background: white; color: #0a6e2c; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 14px;">
            Découvrir
          </button>
        </div>

        <!-- Accès rapides -->
        <h3 style="color: #333; margin-bottom: 16px;">Accès rapides</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
          
          <button onclick="if(window.router) window.router.navigate('frequences')" style="padding: 16px; background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
            <span style="font-size: 24px;">📊</span><br>
            <span style="font-size: 14px; margin-top: 8px; display: inline-block; font-weight: 500;">Fréquences</span>
          </button>
          
          <button onclick="if(window.router) window.router.navigate('finance')" style="padding: 16px; background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
            <span style="font-size: 24px;">💰</span><br>
            <span style="font-size: 14px; margin-top: 8px; display: inline-block; font-weight: 500;">Finance</span>
          </button>
          
          <button onclick="if(window.router) window.router.navigate('depouillement')" style="padding: 16px; background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
            <span style="font-size: 24px;">📦</span><br>
            <span style="font-size: 14px; margin-top: 8px; display: inline-block; font-weight: 500;">Dépouillement</span>
          </button>

          <button onclick="if(window.router) window.router.navigate('patrimoine')" style="padding: 16px; background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
            <span style="font-size: 24px;">🏠</span><br>
            <span style="font-size: 14px; margin-top: 8px; display: inline-block; font-weight: 500;">Patrimoine</span>
          </button>

          ${Permissions.canSeeAdministration() ? `
            <button onclick="if(window.router) window.router.navigate('administration')" style="padding: 16px; background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
              <span style="font-size: 24px;">⚙️</span><br>
              <span style="font-size: 14px; margin-top: 8px; display: inline-block; font-weight: 500;">Administration</span>
            </button>
          ` : ''}

          <button onclick="if(window.router) window.router.navigate('archives')" style="padding: 16px; background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
            <span style="font-size: 24px;">📂</span><br>
            <span style="font-size: 14px; margin-top: 8px; display: inline-block; font-weight: 500;">Archives</span>
          </button>

        </div>

        <!-- Bouton Déconnexion -->
        <div style="text-align: center; margin-top: 32px;">
          <button id="btn-dashboard-logout" style="background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    `;

    // On charge les statistiques
    this.loadStats();

    // --- LOGIQUE DE DÉCONNEXION ---
    document.getElementById('btn-dashboard-logout')?.addEventListener('click', async () => {
      if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        try {
          const { FirebaseService } = await import('../../services/firebase.service.js');
          const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
          await FirebaseService.init();
          await signOut(FirebaseService.auth);
          window.location.reload();
        } catch (error) {
          console.error("Erreur déconnexion:", error);
          window.location.reload();
        }
      }
    });
  },

  async loadStats() {
    try {
      const stats = await DashboardStats.getStats();
      
      const elEntites = document.getElementById('kpi-entites');
      const elPresences = document.getElementById('kpi-presences');
      const elVersements = document.getElementById('kpi-versements');
      const elCandidats = document.getElementById('kpi-candidats');

      if (elEntites) elEntites.textContent = stats.entites;
      if (elPresences) elPresences.textContent = stats.presences;
      if (elVersements) elVersements.textContent = stats.versements + ' $';
      if (elCandidats) elCandidats.textContent = stats.candidats;

      // On dessine les graphiques avec les vraies données
      this.renderCharts(stats.chartData);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
      if (document.getElementById('kpi-entites')) document.getElementById('kpi-entites').textContent = "0";
      if (document.getElementById('kpi-presences')) document.getElementById('kpi-presences').textContent = "0";
      if (document.getElementById('kpi-versements')) document.getElementById('kpi-versements').textContent = "0 $";
      if (document.getElementById('kpi-candidats')) document.getElementById('kpi-candidats').textContent = "0";
    }
  },

  renderCharts(chartData) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js non chargé');
      return;
    }

    // Sécurité si chartData est indéfini
    const dataMembres = chartData?.membres || 0;
    const dataSympathisants = chartData?.sympathisants || 0;
    const dataNouveaux = chartData?.nouveaux || 0;

    // 1. Graphique Camembert
    const ctxPie = document.getElementById('chart-presences');
    if (ctxPie) {
      // Détruire l'ancien graphique s'il existe
      if (Chart.getChart(ctxPie)) {
        Chart.getChart(ctxPie).destroy();
      }

      new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: ['Membres', 'Sympathisants', 'Nouveaux'],
          datasets: [{
            data: [dataMembres, dataSympathisants, dataNouveaux],
            backgroundColor: ['#0a6e2c', '#17a2b8', '#fd7e14'],
            borderWidth: 0
          }]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // 2. Graphique Barres
    const ctxBar = document.getElementById('chart-finances');
    if (ctxBar) {
      if (Chart.getChart(ctxBar)) {
        Chart.getChart(ctxBar).destroy();
      }

      new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Mois -2', 'Mois -1', 'Ce mois'],
          datasets: [
            { label: 'Entrées', data: [150, 200, 300], backgroundColor: '#0a6e2c', borderRadius: 4 },
            { label: 'Sorties', data: [50, 80, 100], backgroundColor: '#dc3545', borderRadius: 4 }
          ]
        },
        options: { 
          responsive: true, 
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }
};