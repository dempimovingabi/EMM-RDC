// =========================================
// UI - CLOCHE DE NOTIFICATION
// =========================================

export const NotificationBell = {
  async init() {
    const btnNotif = document.getElementById('btn-header-notif');
    if (!btnNotif) return;

    // On vérifie s'il y a de nouvelles annonces pour afficher le badge
    await this.checkUnread();

    // Au clic sur la cloche, on affiche la liste
    btnNotif.addEventListener('click', () => {
      this.toggleDropdown();
    });
  },

  async checkUnread() {
    try {
      const { FirebaseService } = await import('../services/firebase.service.js');
      const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();
      const q = query(collection(FirebaseService.db, 'annonces'), orderBy('dateCreation', 'desc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return;

      // On récupère la date de la dernière annonce
      const latestDate = snapshot.docs[0].data().dateCreation;
      const lastRead = localStorage.getItem('emm_last_notif_read');

      // Si on n'a jamais lu, ou si la dernière annonce est plus récente que la dernière lecture
      if (!lastRead || new Date(latestDate) > new Date(lastRead)) {
        // On affiche le badge rouge
        const badge = document.getElementById('notif-badge');
        if (badge) badge.style.display = 'flex';
      }
    } catch (error) {
      console.error("Erreur vérification notifs:", error);
    }
  },

  async toggleDropdown() {
    // Si le menu est déjà ouvert, on le ferme
    const existingMenu = document.getElementById('notif-dropdown');
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    // On cache le badge rouge quand on clique
    const badge = document.getElementById('notif-badge');
    if (badge) badge.style.display = 'none';

    // Création du menu déroulant
    const menu = document.createElement('div');
    menu.id = 'notif-dropdown';
    menu.style = `
      position: absolute; top: 60px; right: 10px;
      width: 300px; max-height: 400px; overflow-y: auto;
      background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 2000; padding: 10px; box-sizing: border-box;
    `;
    
    menu.innerHTML = `<p style="text-align:center; color:#0a6e2c; font-size:14px; font-weight:bold;">Chargement...</p>`;
    document.body.appendChild(menu);

    try {
      const { FirebaseService } = await import('../services/firebase.service.js');
      const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      const q = query(collection(FirebaseService.db, 'annonces'), orderBy('dateCreation', 'desc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        menu.innerHTML = `<p style="text-align:center; color:#666; font-size:13px;">Aucune annonce pour le moment.</p>`;
        return;
      }

      let htmlAnnonces = '';
      let latestDate = new Date().toISOString(); // Par défaut, on prend maintenant

      snapshot.forEach((doc, index) => {
        const data = doc.data();
        if (index === 0) latestDate = data.dateCreation; // On garde la date de la plus récente

        htmlAnnonces += `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <strong style="font-size: 13px; color: #0a6e2c; display: block;">${data.titre}</strong>
            <p style="font-size: 12px; color: #444; margin: 4px 0 0 0;">${data.texte}</p>
            <span style="font-size: 10px; color: #999; margin-top: 4px; display: block;">${new Date(data.dateCreation).toLocaleDateString('fr-FR')}</span>
          </div>
        `;
      });

      menu.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding-bottom:8px; margin-bottom:8px;">
          <span style="font-weight:bold; color:#333; font-size:14px;">Notifications</span>
          <button onclick="document.getElementById('notif-dropdown').remove()" style="background:none; border:none; font-size:16px; cursor:pointer;">✖</button>
        </div>
        ${htmlAnnonces}
      `;

      // On sauvegarde le fait que l'utilisateur a lu les notifs
      localStorage.setItem('emm_last_notif_read', latestDate);

    } catch (error) {
      menu.innerHTML = `<p style="color:red; font-size:12px;">Erreur de chargement.</p>`;
    }
  }
};