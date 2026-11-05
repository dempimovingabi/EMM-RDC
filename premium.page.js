// =========================================
// PREMIUM - PAGE PUBLIQUE (PAYWALL)
// =========================================

export const PremiumPage = {
  render() {
    const main = document.getElementById('app-main');
    if (!main) return;

    main.innerHTML = `
      <div style="padding-bottom: 20px;">
        <button onclick="window.router.navigate('dashboard')" style="margin-bottom: 16px; background: none; border: none; color: #0a6e2c; font-weight: bold; cursor: pointer;">
          ← Retour au tableau de bord
        </button>

        <!-- En-tête -->
        <div style="background: linear-gradient(135deg, #0a6e2c, #17a2b8); color: white; padding: 32px 20px; border-radius: 8px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <div style="font-size: 48px; margin-bottom: 8px;">⭐</div>
          <h2 style="margin: 0; font-size: 24px;">Passez à la version Premium</h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Débloquez les exports PDF, Word, Excel et les rapports avancés.</p>
        </div>

        <!-- Tarifs -->
        <h3 style="color: #333; margin-bottom: 16px;">Nos Tarifs</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
          
          <div style="background: white; border: 2px solid #ddd; border-radius: 8px; padding: 16px; text-align: center;">
            <h4 style="margin: 0 0 8px 0; color: #0a6e2c;">1 Mois</h4>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #333;">6 $</p>
          </div>

          <div style="background: white; border: 2px solid #17a2b8; border-radius: 8px; padding: 16px; text-align: center; position: relative;">
            <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #17a2b8; color: white; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: bold;">POPULAIRE</span>
            <h4 style="margin: 0 0 8px 0; color: #0a6e2c;">2 Mois</h4>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #333;">10 $</p>
          </div>

          <div style="background: white; border: 2px solid #ddd; border-radius: 8px; padding: 16px; text-align: center;">
            <h4 style="margin: 0 0 8px 0; color: #0a6e2c;">3 Mois</h4>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #333;">15 $</p>
          </div>

          <div style="background: white; border: 2px solid #ffc107; border-radius: 8px; padding: 16px; text-align: center;">
            <h4 style="margin: 0 0 8px 0; color: #0a6e2c;">Illimité</h4>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">À définir</p>
          </div>

        </div>

        <!-- Paiement Mobile Money -->
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="color: #0a6e2c; margin-top: 0;">Comment payer ?</h3>
          <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Envoyez le montant correspondant à l'un des numéros ci-dessous, puis envoyez la capture d'écran au Super Administrateur sur WhatsApp.</p>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            
            <!-- Airtel Money -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 12px; border-radius: 6px; border: 1px solid #eee;">
              <div>
                <span style="font-size: 12px; color: #666; display: block;">Airtel Money</span>
                <strong style="font-size: 16px; color: #dc3545;">+243 976 286 929</strong>
              </div>
              <button class="btn-copy" data-copy="+243976286929" style="padding: 8px 12px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">
                📋 Copier
              </button>
            </div>

            <!-- M-Pesa -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 12px; border-radius: 6px; border: 1px solid #eee;">
              <div>
                <span style="font-size: 12px; color: #666; display: block;">M-Pesa</span>
                <strong style="font-size: 16px; color: #dc3545;">+243 826 222 264</strong>
              </div>
              <button class="btn-copy" data-copy="+243826222264" style="padding: 8px 12px; background: #0a6e2c; color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">
                📋 Copier
              </button>
            </div>

          </div>

          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 13px; color: #666; margin-bottom: 8px;">Une fois le paiement effectué, contactez le développeur :</p>
            <button id="btn-contact-wa" style="padding: 12px 24px; background: #25D366; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; width: 100%;">
              📱 Contacter sur WhatsApp
            </button>
          </div>

        </div>
      </div>
    `;

    // --- LOGIQUE DE COPIE ---
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const textToCopy = e.target.getAttribute('data-copy');
        
        // Fonction de copie
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = e.target.innerHTML;
          e.target.innerHTML = '✅ Copié !';
          e.target.style.background = '#28a745';
          
          setTimeout(() => {
            e.target.innerHTML = originalText;
            e.target.style.background = '#0a6e2c';
          }, 2000);
        }).catch(err => {
          alert('Erreur lors de la copie : ' + err);
        });
      });
    });

    // --- LOGIQUE WHATSAPP ---
    document.getElementById('btn-contact-wa')?.addEventListener('click', () => {
      const msg = encodeURIComponent("Bonjour, je viens d'effectuer un paiement pour l'abonnement Premium EMM RD CONGO. Voici ma preuve de paiement.");
      window.open(`https://wa.me/243976286929?text=${msg}`, '_blank');
    });
  }
};