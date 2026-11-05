// =========================================
// STORE - Mémoire de l'application
// =========================================

export const Store = {
  currentUser: null,
  userProfile: null,

  setUser(user) {
    this.currentUser = user;
  },

  setProfile(profile) {
    this.userProfile = profile;
    console.log('👤 Profil chargé :', profile);
  },

  getUserEmail() {
    return this.currentUser ? this.currentUser.email : '';
  },

  // Récupère la province de l'utilisateur (par défaut Kinshasa si non trouvée)
  getProvince() {
    return this.userProfile && this.userProfile.province ? this.userProfile.province : 'Kinshasa';
  },

  // Met à jour la province active (nouvelle fonction)
  setProvince(province) {
    if (this.userProfile) {
      this.userProfile.province = province;
      localStorage.setItem('emm_province', province);
    }
  },

  // Récupère l'ID de l'entité
  getEntityId() {
    return this.currentUser ? this.currentUser.uid : 'test-entity-1';
  },

  // Récupère le nom de l'entité
  getEntityName() {
    if (this.currentUser && this.currentUser.email) {
      return this.currentUser.email.split('@')[0];
    }
    return 'Entité Test';
  }
};