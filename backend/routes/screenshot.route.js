import express from "express";
import { captureScreenshot } from "../controllers/screenshot.controller.js";

const router = express.Router();

// Fixed route definition - removed any potential malformed parameters
router.get("/", captureScreenshot);  // Changed from "/screenshot" to "/"

export default router;