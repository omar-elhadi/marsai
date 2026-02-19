/**
 * SCRIPT DE TEST AUTHENTIFICATION YOUTUBE
 *
 * Teste si l'authentification OAuth fonctionne correctement
 * Usage: node src/utils/test-youtube-auth.js
 */

import "dotenv/config";
import {
  getYouTubeAuthClient,
  getAuthenticatedYouTubeClient,
} from "../config/youtube.js";

async function testYouTubeAuth() {
  console.log("\n🔍 TEST D'AUTHENTIFICATION YOUTUBE");
  console.log("===================================\n");

  try {
    // 1. Vérification des variables d'environnement
    console.log("📋 Étape 1 : Vérification des variables d'environnement");
    console.log(
      `   YOUTUBE_CLIENT_ID: ${process.env.YOUTUBE_CLIENT_ID ? "✅ Défini" : "❌ Manquant"}`,
    );
    console.log(
      `   YOUTUBE_CLIENT_SECRET: ${process.env.YOUTUBE_CLIENT_SECRET ? "✅ Défini" : "❌ Manquant"}`,
    );
    console.log(
      `   YOUTUBE_REFRESH_TOKEN: ${process.env.YOUTUBE_REFRESH_TOKEN ? "✅ Défini" : "❌ Manquant"}`,
    );

    if (
      !process.env.YOUTUBE_CLIENT_ID ||
      !process.env.YOUTUBE_CLIENT_SECRET ||
      !process.env.YOUTUBE_REFRESH_TOKEN
    ) {
      console.log("\n❌ Variables d'environnement manquantes\n");
      process.exit(1);
    }

    console.log("\n✅ Toutes les variables sont définies\n");

    // 2. Test de création du client OAuth
    console.log("📋 Étape 2 : Création du client OAuth");
    const oauth2Client = getYouTubeAuthClient();
    console.log("✅ Client OAuth créé\n");

    // 3. Test de refresh du token
    console.log("📋 Étape 3 : Test de refresh du token d'accès");
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      console.log("✅ Token d'accès rafraîchi avec succès");
      console.log(
        `   Access Token: ${credentials.access_token ? credentials.access_token.substring(0, 20) + "..." : "N/A"}`,
      );
      console.log(
        `   Expiry Date: ${credentials.expiry_date ? new Date(credentials.expiry_date).toLocaleString() : "N/A"}`,
      );
      console.log(`   Token Type: ${credentials.token_type}\n`);
    } catch (refreshError) {
      console.log("❌ Erreur lors du refresh du token:");
      console.log(`   ${refreshError.message}\n`);

      if (refreshError.message.includes("invalid_grant")) {
        console.log("💡 SOLUTION:");
        console.log(
          "   Le refresh token n'est plus valide. Vous devez le régénérer:",
        );
        console.log("   1. Exécutez: node src/utils/generate-youtube-token.js");
        console.log("   2. Suivez les instructions");
        console.log("   3. Remplacez YOUTUBE_REFRESH_TOKEN dans .env\n");
      }

      process.exit(1);
    }

    // 4. Test d'appel API simple
    console.log("📋 Étape 4 : Test d'appel à l'API YouTube");
    const youtube = getAuthenticatedYouTubeClient(oauth2Client);

    try {
      const response = await youtube.channels.list({
        part: ["snippet", "contentDetails", "statistics"],
        mine: true,
      });

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        console.log("✅ Connexion à l'API YouTube réussie");
        console.log(`   Chaîne YouTube: ${channel.snippet.title}`);
        console.log(`   Channel ID: ${channel.id}`);
        console.log(
          `   Abonnés: ${channel.statistics.subscriberCount || "N/A"}\n`,
        );
      } else {
        console.log("⚠️  Aucune chaîne YouTube associée à ce compte\n");
      }
    } catch (apiError) {
      console.log("❌ Erreur lors de l'appel à l'API:");
      console.log(`   ${apiError.message}\n`);

      if (apiError.code === 403) {
        console.log("💡 SOLUTION:");
        console.log("   Vérifiez que l'API YouTube Data v3 est bien activée:");
        console.log(
          "   https://console.cloud.google.com/apis/library/youtube.googleapis.com\n",
        );
      }

      process.exit(1);
    }

    // 5. Succès total
    console.log("✅ TOUS LES TESTS SONT PASSÉS");
    console.log("🎉 L'authentification YouTube fonctionne correctement !\n");
  } catch (error) {
    console.error("❌ ERREUR INATTENDUE:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Exécution
testYouTubeAuth();
