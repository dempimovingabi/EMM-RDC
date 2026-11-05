// =========================================
// APP INITIALIZATION - EMM RD CONGO
// =========================================

import { $, hide, show } from '../utils/dom.js';
import { LoginView } from '../modules/auth/login.view.js';
import { AuthController } from '../modules/auth/auth.controller.js';
import { Router } from './router.js';
import { HeaderView } from '../ui/header.js';

export const App = {
  SPLASH_DURATION: 1500,
  currentUser: null,

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      this.boot();
    }
  },

  boot() {
    const splashScreen = $('#splash-screen');
    
    setTimeout(() => {
      if (splashScreen) {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
          splashScreen.remove();
          this.showApp();
        }, 500);
      } else {
        this.showApp();
      }
    }, this.SPLASH_DURATION);
  },

  showApp() {
    const appContainer = $('#app');
    if (appContainer) {
      show(appContainer);
    } else {
      console.error("Erreur : l'élément #app est introuvable !");
    }
    
    hide($('#app-header')); 
    this.showLogin();
  },

  showLogin() {
    // On s'assure que le conteneur principal existe
    const main = $('#app-main');
    if (!main) {
      console.error("Erreur : l'élément #app-main est introuvable !");
      return;
    }

    LoginView.render();
    
    const form = $('#login-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = $('#login-email').value;
        const password = $('#login-password').value;
        const btn = $('#login-btn');
        
        btn.textContent = "Connexion en cours...";
        btn.disabled = true;
        btn.style.opacity = "0.7";

        const result = await AuthController.login(email, password);

        if (result.success) {
          this.currentUser = result.user;
          
          show($('#app-header')); 
          HeaderView.render();
          
          Router.init(result.user.email);
        } else {
          alert(result.message);
          btn.textContent = "Se connecter";
          btn.disabled = false;
          btn.style.opacity = "1";
        }
      });
    }
  }
};