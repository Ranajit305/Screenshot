import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export const captureScreenshot = async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage"
            ],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const screenshotPath = path.join(process.cwd(), "screenshot.png");
        await page.screenshot({ path: screenshotPath, fullPage: true });

        await browser.close();

        res.download(screenshotPath, "screenshot.png", (err) => {
            if (err) {
                console.error("Download error:", err);
            } else {
                // Delete the file after 5 seconds
                setTimeout(() => {
                    fs.unlink(screenshotPath, (unlinkErr) => {
                        if (unlinkErr) console.error("Error deleting file:", unlinkErr);
                    });
                }, 5000);
            }
        });
    } catch (error) {
        console.error("Error capturing screenshot:", error);
        res.status(500).json({ error: "Failed to capture screenshot" });
    }
};
