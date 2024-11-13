import express from "express";
import foldersRoutes from "./folders.js";
import filesRoutes from "./files.js";

const router = express.Router();

console.log("router in")
router.use("/folders", foldersRoutes);
router.use("/files", filesRoutes);

export default router;