// =========================================
// UI - DIALOGUE D'IMPRESSION (PDF)
// =========================================

import { Permissions } from '../core/permissions.js';
import { Toast } from './toast.js';

export const PrintDialog = {
  open() {
    // 🚨 BLOQUAGE PREMIUM 🚨
    if (!Permissions.isPremium()) {
      Toast.warning("L'impression PDF est réservée aux membres Premium.");
      // On redirige vers la page Premium après 1.5 seconde
      setTimeout(() => {
        if (window.router) window.router.navigate('premium');
      }, 1500);
      return; // On arrête l'exécution ici, la modale ne s'ouvre pas
    }

    // Supprimer une ancienne modale si elle existe
    const oldModal = document.getElementById('print-modal');
    if (oldModal) oldModal.remove();

    // Liste des 12 polices demandées dans le cahier des charges
    const polices = [
      'Arial', 'Times New Roman', 'Courier New', 'Georgia', 
      'Verdana', 'Tahoma', 'Trebuchet MS', 'Comic Sans MS', 
      'Impact', 'Lucida Console', 'Palatino Linotype', 'Garamond'
    ];

    let optionsPolices = '';
    polices.forEach(p => {
      optionsPolices += `<option value="${p}">${p}</option>`;
    });

    // Génération des tailles de 10 à 28
    let optionsTailles = '';
    for (let i = 10; i <= 28; i++) {
      // On met 14 par défaut
      optionsTailles += `<option value="${i}" ${i === 14 ? 'selected' : ''}>${i}</option>`;
    }

    // On crée la modale
    const modal = document.createElement('div');
    modal.id = 'print-modal';
    modal.style = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.6); z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
    `;

    modal.innerHTML = `
      <div style="background: white; width: 100%; max-width: 400px; border-radius: 8px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <h3 style="color: #0a6e2c; margin-top: 0;">🖨️ Paramètres d'impression</h3>
        
        <!-- Choix de la taille -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 14px; font-weight: bold; margin-bottom: 8px;">Taille de police</label>
          <select id="print-size" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            ${optionsTailles}
          </select>
        </div>

        <!-- Choix de la police -->
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 14px; font-weight: bold; margin-bottom: 8px;">Famille de police</label>
          <select id="print-font" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            ${optionsPolices}
          </select>
        </div>

        <!-- Aperçu -->
        <div style="border: 1px dashed #ccc; padding: 12px; border-radius: 4px; margin-bottom: 20px; background: #fafafa; overflow: hidden;">
          <p style="margin: 0; font-size: 12px; color: #666; margin-bottom: 8px;">Aperçu :</p>
          <p id="print-preview" style="margin: 0; font-family: Arial; font-size: 14px; word-wrap: break-word;">Voici un exemple de texte pour votre impression.</p>
        </div>

        <!-- Boutons -->
        <div style="display: flex; gap: 12px;">
          <button id="btn-do-print" style="flex: 1; padding: 12px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Confirmer
          </button>
          <button id="btn-cancel-print" style="flex: 1; padding: 12px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
            Annuler
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Éléments à écouter
    const sizeSelect = document.getElementById('print-size');
    const fontSelect = document.getElementById('print-font');
    const preview = document.getElementById('print-preview');

    // Mise à jour de l'aperçu en temps réel
    const updatePreview = () => {
      preview.style.fontSize = sizeSelect.value + 'px';
      preview.style.fontFamily = fontSelect.value;
    };

    sizeSelect.addEventListener('change', updatePreview);
    fontSelect.addEventListener('change', updatePreview);

    // Annuler
    document.getElementById('btn-cancel-print').addEventListener('click', () => {
      modal.remove();
    });

    // Confirmer et imprimer
    document.getElementById('btn-do-print').addEventListener('click', () => {
      // On applique les styles au document entier pour l'impression
      document.documentElement.style.setProperty('--print-font-size', sizeSelect.value + 'px');
      document.documentElement.style.setProperty('--print-font-family', fontSelect.value);

      // On ferme la modale
      modal.remove();

      // On lance l'impression native du navigateur
      setTimeout(() => {
        window.print();
      }, 100);
    });
  }
};

// On l'attache à window pour que les boutons HTML puissent l'appeler
window.PrintDialog = PrintDialog;