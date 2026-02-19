/**
 * UTILITAIRE DE GÉNÉRATION DE REFRESH TOKEN YOUTUBE
 * 
 * Ce script aide à obtenir un refresh token YouTube OAuth 2.0
 * nécessaire pour uploader des vidéos via l'API.
 * 
 * ÉTAPES D'UTILISATION :
 * 1. Configurer YOUTUBE_CLIENT_ID et YOUTUBE_CLIENT_SECRET dans .env
 * 2. Exécuter : node src/utils/generate-youtube-token.js
 * 3. Ouvrir l'URL affichée dans un navigateur
 * 4. Autoriser l'application
 * 5. Copier le code d'autorisation
 * 6. Le coller dans le terminal
 * 7. Copier le refresh_token dans .env
 */

import 'dotenv/config';
import readline from 'readline';
import { getAuthUrl, getTokensFromCode } from '../config/youtube.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const generateToken = async () => {
  try {
    console.log('\n🎬 GÉNÉRATION DE REFRESH TOKEN YOUTUBE\n');
    console.log('========================================\n');

    // Vérifier que les credentials sont configurés
    if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
      console.error('❌ ERREUR : YOUTUBE_CLIENT_ID et YOUTUBE_CLIENT_SECRET doivent être configurés dans .env');
      process.exit(1);
    }

    // Générer l'URL d'autorisation
    const authUrl = getAuthUrl();
    
    console.log('📋 ÉTAPE 1 : Ouvrez cette URL dans votre navigateur :\n');
    console.log(authUrl);
    console.log('\n');
    
    console.log('📋 ÉTAPE 2 : Autorisez l\'application et copiez le code d\'autorisation\n');

    // Demander le code d'autorisation
    rl.question('Collez le code d\'autorisation ici : ', async (code) => {
      try {
        console.log('\n⏳ Échange du code contre les tokens...\n');
        
        const tokens = await getTokensFromCode(code);
        
        console.log('✅ TOKENS OBTENUS AVEC SUCCÈS !\n');
        console.log('========================================\n');
        console.log('📝 Copiez ces informations dans votre fichier .env :\n');
        
        if (tokens.refresh_token) {
          console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
          console.log('\n⚠️  IMPORTANT : Conservez précieusement ce refresh_token !');
          console.log('   Il ne sera affiché qu\'une seule fois.\n');
        } else {
          console.log('⚠️  Aucun refresh_token reçu.');
          console.log('   Cela peut arriver si vous avez déjà autorisé cette application.');
          console.log('   Pour obtenir un nouveau refresh_token :');
          console.log('   1. Allez sur https://myaccount.google.com/permissions');
          console.log('   2. Révoquez l\'accès à votre application');
          console.log('   3. Relancez ce script\n');
        }
        
        console.log('\n📊 Autres informations (pour référence) :');
        console.log(`   Access Token : ${tokens.access_token?.substring(0, 20)}...`);
        console.log(`   Expire dans  : ${tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : 'N/A'}`);
        console.log(`   Scope        : ${tokens.scope || 'N/A'}`);
        console.log('\n========================================\n');
        
        rl.close();
        process.exit(0);
      } catch (error) {
        console.error('\n❌ ERREUR lors de l\'échange du code :', error.message);
        rl.close();
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ ERREUR :', error.message);
    rl.close();
    process.exit(1);
  }
};

generateToken();
