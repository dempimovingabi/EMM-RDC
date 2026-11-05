// =========================================
// FINANCE - FORMULAIRE CANDIDAT
// =========================================

import { MOTIFS_CANDIDATS } from '../../config/constants.js';

export const CandidatForm = {
  render(container) {
    // On génère les options pour le menu déroulant des motifs
    const optionsMotifs = MOTIFS_CANDIDATS.map(m => `<option value="${m}">${m}</option>`).join('');

    container.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #0a6e2c; margin-top: 0;">Nouveau Candidat</h3>
        
        <form id="form-candidat" style="margin-top: 16px;">
          
          <!-- Nom -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Nom complet *</label>
            <input type="text" id="cand-nom" required placeholder="Ex: Jean Mukendi" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
          </div>

          <!-- Motif & Montant -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Motif *</label>
              <select id="cand-motif" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                <option value="">-- Choisir --</option>
                ${optionsMotifs}
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Montant prévu ($) *</label>
              <input type="number" id="cand-montant" min="0" step="0.01" required placeholder="0.00" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            </div>
          </div>

          <!-- Photo -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Photo (optionnel)</label>
            <input type="file" id="cand-photo" accept="image/*" capture="environment" style="width: 100%; padding: 8px; border: 1px dashed #ddd; border-radius: 4px; font-size: 14px;">
            <p style="font-size: 12px; color: #999; margin-top: 4px;">Prends une photo ou choisis depuis la galerie.</p>
          </div>

          <!-- Signature Numérique -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Signature Numérique *</label>
            
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <div style="flex: 1;">
                <label style="font-size: 12px; color: #666;">Couleur :</label>
                <input type="color" id="sig-color" value="#000000" style="width: 100%; height: 36px; padding: 2px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
              </div>
              <div style="flex: 1;">
                <label style="font-size: 12px; color: #666;">Taille :</label>
                <select id="sig-width" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                  <option value="2">Fine</option>
                  <option value="4" selected>Moyenne</option>
                  <option value="6">Épaisse</option>
                </select>
              </div>
              <div style="display: flex; align-items: flex-end;">
                <button type="button" id="btn-clear-sig" style="padding: 8px 12px; background: #f5f7fa; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  🗑️ Effacer
                </button>
              </div>
            </div>

            <canvas id="signature-pad" width="300" height="150" style="border: 1px solid #ddd; border-radius: 4px; width: 100%; background: #fafafa; touch-action: none; cursor: crosshair;"></canvas>
            <p style="font-size: 12px; color: #999; margin-top: 4px;">Signez dans le cadre avec votre doigt.</p>
          </div>

          <!-- Boutons -->
          <div style="display: flex; gap: 12px;">
            <button type="submit" id="btn-save-cand" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              💾 Enregistrer
            </button>
            <button type="button" id="btn-cancel-cand" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 16px;">
              Annuler
            </button>
          </div>

        </form>
      </div>
    `;

    // --- GESTION DE LA SIGNATURE NUMÉRIQUE ---
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasSigned = false;

    // Ajustement de la taille du canvas pour qu'il soit net
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 150;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const startDrawing = (e) => {
      e.preventDefault();
      isDrawing = true;
      hasSigned = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.strokeStyle = document.getElementById('sig-color').value;
      ctx.lineWidth = document.getElementById('sig-width').value;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing = false;
      ctx.beginPath();
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    // Effacer la signature
    document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSigned = false;
    });

    // --- ANNULATION ---
    document.getElementById('btn-cancel-cand')?.addEventListener('click', () => {
      import('./candidats.list.js').then(m => m.CandidatsList.render(container));
    });

    // --- ENREGISTREMENT ---
    const form = document.getElementById('form-candidat');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!hasSigned) {
        alert('Veuillez signer dans le cadre avant d\'enregistrer.');
        return;
      }

      const btn = document.getElementById('btn-save-cand');
      btn.textContent = "Enregistrement...";
      btn.disabled = true;

      try {
        const { FirebaseService } = await import('../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const { Store } = await import('../../core/store.js');
        
        await FirebaseService.init();

        // Récupération de la signature en base64
        const signatureData = canvas.toDataURL('image/png');

        // Préparation des données
        const data = {
          nom: document.getElementById('cand-nom').value,
          motif: document.getElementById('cand-motif').value,
          montantPrevu: parseFloat(document.getElementById('cand-montant').value) || 0,
          signature: signatureData,
          province: Store.getProvince(),
          entityId: Store.getEntityId(),
          statut: 'En cours',
          createdAt: new Date().toISOString()
        };

        // Sauvegarde dans Firestore
        await addDoc(collection(FirebaseService.db, 'candidats'), data);
        
        alert('Candidat enregistré avec succès !');
        import('./candidats.list.js').then(m => m.CandidatsList.render(container));
        
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur : ' + error.message);
        btn.textContent = "💾 Enregistrer";
        btn.disabled = false;
      }
    });
  }
};