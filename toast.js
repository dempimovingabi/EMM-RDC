// =========================================
// UI - NOTIFICATIONS TOAST
// =========================================

export const Toast = {
  // Types disponibles : 'success', 'error', 'warning', 'info'
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Création de l'élément toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icône selon le type
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    // Ajout au conteneur
    container.appendChild(toast);

    // Disparition automatique après la durée spécifiée
    setTimeout(() => {
      toast.classList.add('hide');
      // On attend la fin de l'animation pour supprimer l'élément
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  warning(msg) { this.show(msg, 'warning'); }
};

// On l'attache à window pour pouvoir l'appeler depuis n'importe où (ex: onclick)
window.Toast = Toast;