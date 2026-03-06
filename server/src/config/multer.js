import multer from "multer";

// Configuration de multer pour stocker les fichiers en mémoire (buffer)
const storage = multer.memoryStorage();

// Filtre pour accepter uniquement les fichiers vidéo
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
    "video/x-matroska", // .mkv
    "video/webm",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format de fichier non supporté. Veuillez uploader un fichier vidéo (MP4, MOV, AVI, MKV, WEBM)."
      ),
      false
    );
  }
};

// Configuration de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB max
  },
});

export default upload;
