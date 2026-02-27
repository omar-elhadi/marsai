import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const mailService = {
  sendMagicLink: async (email, token, firstName) => {
    try {
      const magicLink = `${process.env.FRONTEND_URL}/login/verify?token=${token}`;

      const mailOptions = {
        from: '"MARSAI Vidéo" <noreply@marsai.local>',
        to: email,
        subject: "🎬 Votre accès au jury MARSAI",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
            <h2 style="color: #4f46e5;">Bonjour ${firstName},</h2>
            <p>Vous avez été invité à rejoindre le jury du festival <strong>MARSAI</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour accéder directement à votre espace de vote :</p>
            
            <div style="margin: 35px 0; text-align: center;">
              <a href="${magicLink}" 
                 style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                 Accéder au Dashboard Jury
              </a>
            </div>
            <p style="font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Ce lien est personnel et valable 24h.
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email envoyé :", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Erreur SMTP :", error.message);
      throw new Error("Impossible d'envoyer l'email. Vérifiez MAIL_PASS.");
    }
  },

  /**
   * Email de confirmation envoyé au réalisateur après soumission de son film.
   * @param {string} email - Adresse du réalisateur
   * @param {string} firstName - Prénom
   * @param {string} submissionToken - Token UUID unique du film (pour suivi)
   * @param {string} filmTitle - Titre du film soumis
   */
  sendSubmissionConfirmation: async (email, firstName, submissionToken, filmTitle) => {
    try {
      const trackingUrl = `${process.env.FRONTEND_URL}/suivi?token=${submissionToken}`;

      const mailOptions = {
        from: '"MARSAI Festival" <noreply@marsai.local>',
        to: email,
        subject: "🎬 Votre film a bien été reçu — MARSAI Festival 2026",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
            <h2 style="color: #4f46e5;">Bonjour ${firstName},</h2>
            <p>Nous avons bien reçu la soumission de votre film <strong>"${filmTitle}"</strong>.</p>
            <p>Votre candidature est en cours d'examen par notre équipe. Vous serez contacté(e) par email pour toute décision ou demande de modification.</p>

            <div style="margin: 35px 0; padding: 16px; background: #f9fafb; border-left: 3px solid #4f46e5; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">Référence de votre soumission :</p>
              <p style="margin: 6px 0 0; font-family: monospace; font-size: 12px; color: #374151; word-break: break-all;">${submissionToken}</p>
            </div>

            <p style="font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Conservez cet email — il contient votre référence de suivi.<br>
              Festival MARSAI · 12-13 juin 2026 · Marseille
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Confirmation soumission envoyée :", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Erreur SMTP confirmation :", error.message);
      // On ne bloque pas la soumission si l'email échoue
      // Le film est déjà enregistré en base
    }
  },
};
