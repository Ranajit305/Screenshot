import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export const captureScreenshot = async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    // Validate URL format
    try {
        new URL(url);
    } catch (err) {
        return res.status(400).json({ error: "Invalid URL format" });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",  // Important for Render.com
                "--single-process"          // May help in memory-constrained environments
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH // For Render.com
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Increased timeout and added error handling for navigation
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000  // 60 seconds timeout
        });

        // Generate unique filename to prevent conflicts
        const timestamp = Date.now();
        const screenshotPath = path.join("/tmp", `screenshot-${timestamp}.png`);  // Using /tmp directory

        await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            type: "png"
        });

        // Stream the file instead of using res.download
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", `attachment; filename="screenshot-${timestamp}.png"`);

        const fileStream = fs.createReadStream(screenshotPath);
        fileStream.pipe(res);

        fileStream.on("end", () => {
            // Delete file after streaming completes
            fs.unlink(screenshotPath, (err) => {
                if (err) console.error("Error deleting screenshot:", err);
            });
        });

    } catch (error) {
        console.error("Error capturing screenshot:", error);
        res.status(500).json({
            error: "Failed to capture screenshot",
            details: error.message
        });
    } finally {
        if (browser) await browser.close();
    }
};