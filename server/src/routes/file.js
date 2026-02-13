import express from "express";
import multer from "multer";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";

const router = express.Router();

// Configuration de multer pour gérer les uploads en mémoire (pas de stockage local)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// POST /api/file - Téléversement d'un fichier vers S3
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const folder = process.env.SCALEWAY_FOLDER || "";
    const timestamp = Date.now();
    const fileName = `${timestamp}-${req.file.originalname}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: process.env.SCALEWAY_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    // URL d'accès direct au fichier
    const fileUrl = `${process.env.SCALEWAY_ENDPOINT}/${process.env.SCALEWAY_BUCKET_NAME}/${key}`;

    res.status(201).json({
      message: "File uploaded successfully",
      key,
      url: fileUrl,
      fileName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// GET /api/file - Génération d'une URL pré-signée pour accéder à un fichier S3
router.get("/", async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const command = new GetObjectCommand({
      Bucket: process.env.SCALEWAY_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: "Erreur génération URL" });
  }
});

export default router;
