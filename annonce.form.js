// =========================================
// ADMINISTRATION - FORMULAIRE ANNONCE
// =========================================

export const AnnonceForm = {
  render(container) {
    container.innerHTML = `
      <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #0a6e2c; margin-top: 0;">Publier une annonce</h3>
        
        <form id="form-annonce" style="margin-top: 16px;">
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Titre de l'annonce *</label>
            <input type="text" id="annonce-titre" required placeholder="Ex: Réunion spéciale" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Message *</label>
            <textarea id="annonce-texte" required placeholder="Écrivez votre message ici..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box; resize: vertical; min-height: 120px;"></textarea>
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="submit" id="btn-save-annonce" style="flex: 1; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
              📢 Publier
            </button>
            <button type="button" id="btn-cancel-annonce" style="flex: 1; padding: 14px; background: #f5f7fa; color: #666; border: 1px solid #ddd; border-radius: 4px; font-weight: bold; cursor: pointer;">
              Annuler
            </button>
          </div>

        </form>
      </div>
    `;

    document.getElementById('btn-cancel-annonce')?.addEventListener('click', () => {
      import('./annonces.list.js').then(m => m.AnnoncesList.render(container));
    });

    const form = document.getElementById('form-annonce');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-save-annonce');
      btn.textContent = "Publication...";
      btn.disabled = true;

      try {
        const { FirebaseService } = await import('../../services/firebase.service.js');
        const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
        const { Store } = await import('../../core/store.js');
        
        await FirebaseService.init();

        const data = {
          titre: document.getElementById('annonce-titre').value,
          texte: document.getElementById('annonce-texte').value,
          auteur: Store.getUserEmail(),
          dateCreation: new Date().toISOString(),
          archived: false
        };

        await addDoc(collection(FirebaseService.db, 'annonces'), data);
        
        alert('Annonce publiée avec succès !');
        import('./annonces.list.js').then(m => m.AnnoncesList.render(container));
        
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur : ' + error.message);
        btn.textContent = "📢 Publier";
        btn.disabled = false;
      }
    });
  }
};