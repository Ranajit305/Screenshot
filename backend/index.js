import express from "express";
import { chromium } from "playwright";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/screenshot", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle" });

        const screenshotPath = path.join(process.cwd(), "screenshot.png");
        await page.screenshot({ path: screenshotPath, fullPage: true });

        await browser.close();

        res.download(screenshotPath, "screenshot.png", (err) => {
            if (err) console.error("Download error:", err);
            fs.unlink(screenshotPath, (unlinkErr) => {
                if (unlinkErr) console.error("Error deleting file:", unlinkErr);
            });
        });
    } catch (error) {
        console.error("Error capturing screenshot:", error);
        res.status(500).json({ error: "Failed to capture screenshot" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
