// =========================================
// CONSTANTES GLOBALES - EMM RD CONGO
// =========================================

// Les différents rôles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_PROVINCIAL: 'admin_provincial',
  UTILISATEUR: 'utilisateur'
};

// Les entités
export const TYPES_ENTITE = {
  JORHEI_CENTER: 'Jorhei Center',
  UNITE_RELIGIEUSE: 'Unité religieuse',
  FOYER_LUMIERE: 'Foyer de lumière'
};

// Les provinces de la RDC (liste non exhaustive, à compléter)
export const PROVINCES_RDC = [
  'Kinshasa', 'Kongo-Central', 'Kwango', 'Kwilu', 'Mai-Ndombe', 
  'Kasaï', 'Kasaï-Central', 'Kasaï-Oriental', 'Lomami', 'Sankuru',
  'Maniema', 'Sud-Kivu', 'Nord-Kivu', 'Ituri', 'Haut-Uélé', 'Tshopo', 'Bas-Uélé',
  'Nord-Ubangi', 'Mongala', 'Sud-Ubangi', 'Équateur', 'Tshuapa',
  'Tanganyika', 'Haut-Lomami', 'Lualaba', 'Haut-Katanga'
];

// Les tarifs Premium (en USD)
export const TARIFS_PREMIUM = {
  UN_MOIS: 6,
  DEUX_MOIS: 10,
  TROIS_MOIS: 15,
  ILLIMITE: 'À définir'
};

// Les numéros Mobile Money
export const MOBILE_MONEY = {
  AIRTEL: '+243 976 286 929',
  MPESA: '+243 826 222 264'
};

// Motifs des candidats Finance
export const MOTIFS_CANDIDATS = [
  'Initiation', 'Ré-initiation', 'Goshintai', 'Shoku', 
  'Kannon', 'Mitamaya', 'Sorei', 'Photo'
];

// Mois de l'année
export const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Clé de stockage local
export const STORAGE_KEYS = {
  USER: 'emm_user',
  PROVINCE: 'emm_province_active',
  PRINT_SETTINGS: 'emm_print_settings'
};