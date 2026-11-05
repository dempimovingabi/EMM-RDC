// =========================================
// ARCHIVES - SERVICE DE GESTION
// =========================================

export const ArchivesService = {
  async archiver(collectionSource, docId, data) {
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { doc, setDoc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();

      // On essaie de récupérer le meilleur nom d'entité possible
      const nomEntite = data.nomEntite || data.entityName || data.siteNom || 'Entité Inconnue';

      const archiveData = {
        collectionSource: collectionSource,
        originalId: docId,
        entite: nomEntite,
        module: collectionSource === 'freq_diff_jour' ? 'Fréquences' : (collectionSource === 'depouillements' ? 'Dépouillement' : 'Autre'),
        annee: data.date ? new Date(data.date).getFullYear().toString() : (data.annee ? data.annee.toString() : new Date().getFullYear().toString()),
        mois: data.date ? new Date(data.date).getMonth().toString() : (data.mois ? data.mois.toString() : new Date().getMonth().toString()),
        originalData: data,
        archivedAt: new Date().toISOString()
      };

      await setDoc(doc(FirebaseService.db, 'archives', docId), archiveData);
      await deleteDoc(doc(FirebaseService.db, collectionSource, docId));
      
      return true;
    } catch (error) {
      console.error("Erreur archivage:", error);
      throw error;
    }
  },

  async restaurer(archiveId, archiveData) {
    try {
      const { FirebaseService } = await import('../../services/firebase.service.js');
      const { doc, setDoc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await FirebaseService.init();

      await setDoc(doc(FirebaseService.db, archiveData.collectionSource, archiveData.originalId), archiveData.originalData);
      await deleteDoc(doc(FirebaseService.db, 'archives', archiveId));
      
      return true;
    } catch (error) {
      console.error("Erreur restauration:", error);
      throw error;
    }
  }
};