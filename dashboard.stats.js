// =========================================
// DASHBOARD - CALCUL DES STATISTIQUES
// =========================================

export const DashboardStats = {
  async getStats() {
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();

      // 1. KPIs de base
      let totalPresences = 0;
      let totalMembres = 0;
      let totalSympathisants = 0;
      let totalNouveaux = 0;

      // On récupère les présences journalières
      const presencesSnap = await getDocs(collection(FirebaseService.db, 'freq_diff_jour'));
      presencesSnap.forEach(doc => {
        const d = doc.data();
        totalMembres += (d.membres || 0);
        totalSympathisants += (d.sympathisants || 0);
        totalNouveaux += (d.nouveaux || 0);
      });
      totalPresences = totalMembres + totalSympathisants + totalNouveaux;

      // 2. Somme des versements en USD
      let totalVersements = 0;
      const versementsSnap = await getDocs(collection(FirebaseService.db, 'versements'));
      versementsSnap.forEach(doc => {
        const data = doc.data();
        if (data.devise === 'USD') {
          totalVersements += (data.montant || 0);
        } else if (data.devise === 'FC' && data.taux > 0) {
          totalVersements += (data.montant / data.taux);
        }
      });

      // 3. Compter les candidats "En cours"
      let candidatsEnCours = 0;
      const candidatsSnap = await getDocs(collection(FirebaseService.db, 'candidats'));
      candidatsSnap.forEach(doc => {
        if (doc.data().statut === 'En cours') {
          candidatsEnCours++;
        }
      });

      return {
        entites: 1, 
        presences: totalPresences,
        versements: totalVersements.toFixed(2),
        candidats: candidatsEnCours,
        // On renvoie aussi les données pour les graphiques
        chartData: {
          membres: totalMembres,
          sympathisants: totalSympathisants,
          nouveaux: totalNouveaux
        }
      };

    } catch (error) {
      console.error('Erreur stats:', error);
      return { 
        entites: 0, presences: 0, versements: '0.00', candidats: 0,
        chartData: { membres: 0, sympathisants: 0, nouveaux: 0 }
      };
    }
  }
};