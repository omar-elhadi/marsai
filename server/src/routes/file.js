import express from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: "Erreur génération URL" });
  }
});

export default router;
