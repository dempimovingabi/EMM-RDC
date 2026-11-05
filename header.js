// =========================================
// HEADER GLOBAL
// =========================================

import { Store } from '../core/store.js';
import { PROVINCES_RDC } from '../config/constants.js';
import { NotificationBell } from './notification-bell.js';

export const HeaderView = {
  render() {
    const header = document.getElementById('app-header');
    if (!header) return;

    let optionsProvinces = '';
    const currentProv = Store.getProvince();
    
    PROVINCES_RDC.forEach(p => {
      const selected = p === currentProv ? 'selected' : '';
      optionsProvinces += `<option value="${p}" ${selected}>${p}</option>`;
    });

    const isPremium = Store.userProfile?.premium || false;

    header.innerHTML = `
      <div class="header-brand">
        <img src="assets/img/logo.png" alt="Logo" style="height: 32px; width: 32px; object-fit: contain; border-radius: 4px; background: white;">
        <span class="header-title">EMM RDC</span>
      </div>

      <div class="header-actions" style="position: relative;">
        <select id="header-province-select" class="header-province">
          ${optionsProvinces}
        </select>

        <button id="btn-header-notif" class="header-btn">
          🔔
          <span id="notif-badge" class="badge-notif" style="display: none;">!</span>
        </button>

        ${!isPremium ? `
          <button id="btn-header-premium" class="header-btn" style="color: #ffc107; font-size: 22px;">⭐</button>
        ` : ''}

        <button id="btn-header-logout" class="header-btn">🚪</button>
      </div>
    `;

    // Initialisation de la cloche
    NotificationBell.init();

    document.getElementById('header-province-select')?.addEventListener('change', (e) => {
      Store.setProvince(e.target.value);
    });

    document.getElementById('btn-header-premium')?.addEventListener('click', () => {
      window.router.navigate('premium');
    });

    document.getElementById('btn-header-logout')?.addEventListener('click', async () => {
      if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        try {
          const { FirebaseService } = await import('../services/firebase.service.js');
          const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
          await FirebaseService.init();
          await signOut(FirebaseService.auth);
          window.location.reload();
        } catch (error) {
          window.location.reload();
        }
      }
    });
  }
};