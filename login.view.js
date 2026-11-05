// =========================================
// VUE : CONNEXION (LOGIN)
// =========================================

export const LoginView = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div class="login-container" style="max-width: 400px; margin: 40px auto; background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #0a6e2c; text-align: center; margin-bottom: 8px;">Connexion</h2>
        <p style="text-align: center; color: #666; margin-bottom: 24px; font-size: 14px;">Accédez à votre espace EMM RD CONGO</p>
        
        <form id="login-form">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px;">Email</label>
            <input type="email" id="login-email" required placeholder="votre@email.com" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
          </div>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px;">Mot de passe</label>
            <input type="password" id="login-password" required placeholder="••••••••" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
          </div>

          <button type="submit" id="login-btn" style="width: 100%; padding: 14px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer;">
            Se connecter
          </button>
        </form>

        <div style="text-align: center; margin-top: 16px;">
          <a href="#" id="forgot-password-link" style="color: #0a6e2c; font-size: 14px; text-decoration: none;">Mot de passe oublié ?</a>
        </div>
      </div>
    `;
  }
};