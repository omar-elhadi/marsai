import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.SCALEWAY_REGION,
  endpoint: process.env.SCALEWAY_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
  },
});

/**
 * Upload un fichier vers Scaleway S3
 * @param {Buffer} fileBuffer - Le contenu du fichier
 * @param {string} fileName - Le nom original du fichier
 * @param {string} mimeType - Le type MIME du fichier
 * @returns {Promise<{url: string, key: string}>} - L'URL publique et la clé S3
 */
export const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  // Génère un nom unique pour éviter les collisions
  const fileExtension = fileName.split(".").pop();
  const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
  const folder = process.env.SCALEWAY_FOLDER || "";
  const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

  const uploadParams = {
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    // ACL public-read pour rendre le fichier accessible publiquement
    ACL: "public-read",
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construit l'URL publique du fichier
    const url = `${process.env.SCALEWAY_ENDPOINT}/${process.env.SCALEWAY_BUCKET_NAME}/${key}`;

    return { url, key };
  } catch (error) {
    console.error("Erreur lors de l'upload vers S3:", error);
    throw new Error(`Échec de l'upload du fichier: ${error.message}`);
  }
};

/**
 * Supprime un fichier de Scaleway S3
 * @param {string} key - La clé S3 du fichier à supprimer
 * @returns {Promise<void>}
 */
export const deleteFileFromS3 = async (key) => {
  const deleteParams = {
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier S3:", error);
    throw new Error(`Échec de la suppression du fichier: ${error.message}`);
  }
};

export default {
  uploadFileToS3,
  deleteFileFromS3,
};
