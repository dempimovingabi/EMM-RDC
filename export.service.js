// =========================================
// SERVICE D'EXPORTATION (WORD & EXCEL/CSV)
// =========================================

import { Toast } from '../ui/toast.js';

export const ExportService = {
  // Exporter une partie de la page HTML en fichier Word (.doc)
  exportToWord(elementId, filename) {
    try {
      Toast.info("Génération du fichier Word en cours...");
      const element = document.getElementById(elementId);
      
      if (!element) {
        Toast.error("Erreur : contenu introuvable.");
        return;
      }

      const content = element.innerHTML;
      const preHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Export Word</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12pt; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .no-print, button { display: none !important; }
          </style>
        </head>
        <body>`;
      const postHtml = "</body></html>";
      
      const html = preHtml + content + postHtml;
      const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
      
      this.downloadBlob(blob, `${filename}.doc`);
      Toast.success("Fichier Word généré ! Vérifiez vos téléchargements.");
    } catch (error) {
      console.error(error);
      Toast.error("Erreur lors de la génération du Word.");
    }
  },

  // Exporter un tableau HTML en fichier Excel (.xls)
  exportToExcel(tableId, filename) {
    try {
      Toast.info("Génération du fichier Excel en cours...");
      const table = document.getElementById(tableId);
      
      if (!table) {
        Toast.error("Erreur : tableau introuvable.");
        return;
      }

      // On crée un modèle HTML propre pour Excel
      const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Relevé</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body>
          ${table.outerHTML}
        </body>
        </html>
      `;
      
      const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
      
      this.downloadBlob(blob, `${filename}.xls`);
      Toast.success("Fichier Excel généré ! Vérifiez vos téléchargements.");
    } catch (error) {
      console.error(error);
      Toast.error("Erreur lors de la génération de l'Excel.");
    }
  },

  // Fonction utilitaire pour déclencher le téléchargement
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      a.click();
      document.body.removeChild(a);
      // On attend un peu avant de révoquer pour que le téléchargement s'initialise
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 100);
  }
};