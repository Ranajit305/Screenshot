import express from "express";
import { captureScreenshot } from "../controllers/screenshot.controller.js";

const router = express.Router();

router.get("/screenshot", captureScreenshot);

export default router;