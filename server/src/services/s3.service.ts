import { logger } from "../utils/logger.js";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.SCALEWAY_REGION,
  endpoint: process.env.SCALEWAY_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SCALEWAY_ACCESS_KEY!,
    secretAccessKey: process.env.SCALEWAY_SECRET_KEY!,
  },
});

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
) => {
  const fileExtension = fileName.split(".").pop();
  const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
  const folder = process.env.SCALEWAY_FOLDER || "";
  const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

  const uploadParams = {
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "private" as const,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const url = `${process.env.SCALEWAY_ENDPOINT}/${process.env.SCALEWAY_BUCKET_NAME}/${key}`;
    return { url, key };
  } catch (error: unknown) {
    logger.error(error, "Erreur lors de l'upload vers S3:");
    throw new Error(
      `Échec de l'upload du fichier: ${(error as Error).message}`,
    );
  }
};

export const deleteFileFromS3 = async (key: string) => {
  const deleteParams = {
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
  } catch (error: unknown) {
    logger.error(error, "Erreur lors de la suppression du fichier S3:");
    throw new Error(
      `Échec de la suppression du fichier: ${(error as Error).message}`,
    );
  }
};

export const getPresignedUrl = async (key: string, expiresIn = 3600) => {
  if (!key) return null;
  const command = new GetObjectCommand({
    Bucket: process.env.SCALEWAY_BUCKET_NAME,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error: unknown) {
    logger.error(error, "Erreur lors de la génération de l'URL présignée:");
    throw new Error(
      `Échec de la génération de l'URL: ${(error as Error).message}`,
    );
  }
};
