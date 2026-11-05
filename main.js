// =========================================
// POINT D'ENTRÉE PRINCIPAL
// =========================================

import { App } from './core/app.js';

// Démarrage de l'application
App.init();

// Gestion du mode hors-ligne (Bannière orange)
const offlineBanner = document.getElementById('offline-banner');

window.addEventListener('offline', () => {
  if (offlineBanner) offlineBanner.classList.remove('hidden');
});

window.addEventListener('online', () => {
  if (offlineBanner) offlineBanner.classList.add('hidden');
});