import "dotenv/config";
if (!process.env.JWT_SECRET) {
  console.error("❌ ERREUR : JWT_SECRET est manquant dans le fichier .env");
  process.exit(1);
}
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Ton Frontend
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Route de base (Juste pour vérifier que le serveur est en vie)
app.get("/", (req, res) => {
  res.send("🚀 API Marsai Festival en ligne");
});

// Démarrage
app.listen(PORT, () => {
  console.log(`✅ Serveur prêt sur http://localhost:${PORT}`);
});
