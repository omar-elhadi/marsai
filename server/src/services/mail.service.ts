import he from "he";
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

  /**
   * Email envoyé au réalisateur quand l'admin demande des modifications.
   * @param {string} email          - Adresse du réalisateur
   * @param {string} firstName      - Prénom
   * @param {string} filmTitle      - Titre du film concerné
   * @param {string} token          - Token d'édition 7j (Submitter.loginToken)
   * @param {string} message        - Message de l'admin expliquant les modifications
   */
  sendModificationRequest: async (email, firstName, filmTitle, token, message) => {
    try {
      const editUrl = `${process.env.FRONTEND_URL}/edit-film/${token}`;

      const mailOptions = {
        from: '"MARSAI Festival" <noreply@marsai.local>',
        to: email,
        subject: `🎬 Modifications demandées pour "${filmTitle}" — MARSAI Festival 2026`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
            <h2 style="color: #d97706;">Bonjour ${firstName},</h2>
            <p>Notre équipe a examiné votre film <strong>"${filmTitle}"</strong> et souhaite que vous apportiez quelques modifications avant validation.</p>

            <div style="margin: 24px 0; padding: 16px; background: #fffbeb; border-left: 3px solid #d97706; border-radius: 4px;">
              <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e;">Message de l'équipe :</p>
              <p style="margin: 0; color: #374151; line-height: 1.6;">${message}</p>
            </div>

            <p>Cliquez sur le bouton ci-dessous pour accéder à votre formulaire d'édition :</p>

            <div style="margin: 35px 0; text-align: center;">
              <a href="${editUrl}"
                 style="background-color: #d97706; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                 Modifier mon film
              </a>
            </div>

            <p style="font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Ce lien est personnel et valable <strong>7 jours</strong>.<br>
              Festival MARSAI · 12-13 juin 2026 · Marseille
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email modification envoyé :", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Erreur SMTP modification :", error.message);
      // On ne bloque pas le workflow si l'email échoue
    }
  },
};
