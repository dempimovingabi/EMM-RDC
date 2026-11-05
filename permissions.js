// =========================================
// PERMISSIONS & RÔLES
// =========================================

import { Store } from './store.js';

export const Permissions = {
  isSuperAdmin() {
    const role = Store.userProfile?.role?.trim().toLowerCase();
    return role === 'super_admin';
  },
  
  isAdminProvincial() {
    const role = Store.userProfile?.role?.trim().toLowerCase();
    return role === 'admin_provincial';
  },

  isPremium() {
    if (this.isSuperAdmin()) return true; // Le Super Admin est toujours Premium
    return Store.userProfile?.premium === true;
  },

  canSeeAdministration() {
    return this.isSuperAdmin() || this.isAdminProvincial();
  }
};