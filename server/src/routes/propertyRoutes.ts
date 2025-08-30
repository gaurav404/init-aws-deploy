import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import multer from "multer";
import { uploadFiles } from "../controllers/propertyController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:propertyId", (req, res) => {
    res.send("Hello World");
});

router.post("/upload", authMiddleware(['manager']), upload.array('images', 10), uploadFiles);

router.post("/", authMiddleware(['manager']), upload.array('images', 10), (req, res) => {
    res.send("Hello World");
});

export default router;