import express from "express";
import { chromium } from "playwright";
import cors from "cors";
import fs from "fs";
import path from "path";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.get("/screenshot", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle" });

        const screenshotPath = path.join(__dirname, "screenshot.png");
        await page.screenshot({ path: screenshotPath, fullPage: true });

        await browser.close();

        // Ensure response is only sent once
        if (!res.headersSent) {
            return res.sendFile(screenshotPath, (err) => {
                if (err) console.error("Error sending file:", err);
                fs.unlink(screenshotPath, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting file:", unlinkErr);
                });
            });
        }

    } catch (error) {
        console.error("Error capturing screenshot:", error);

        // Prevent duplicate error responses
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});


app.get('/', (req, res) => {
    res.send('API Working');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
