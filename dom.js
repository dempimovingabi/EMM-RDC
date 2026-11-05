// =========================================
// UTILITAIRES DOM
// =========================================

// Raccourci pour document.querySelector
export const $ = (selector, context = document) => context.querySelector(selector);

// Raccourci pour document.querySelectorAll
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

// Créer un élément HTML
export const createEl = (tag, className = '', innerHTML = '') => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
};

// Ajouter un événement
export const on = (el, event, handler) => {
  if (el) el.addEventListener(event, handler);
};

// Masquer un élément
export const hide = (el) => {
  if (el) el.classList.add('hidden');
};

// Afficher un élément
export const show = (el) => {
  if (el) el.classList.remove('hidden');
};

// Vider un conteneur
export const clear = (el) => {
  if (el) el.innerHTML = '';
};