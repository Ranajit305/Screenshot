import puppeteer from "puppeteer";

export const captureScreenshot = async (req, res) => {
    const url = req.params.url;
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
                "--disable-dev-shm-usage",
                "--single-process"
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath()
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 30000
        });

        const screenshotBuffer = await page.screenshot({ fullPage: true });
        res.setHeader("Content-Type", "image/png");
        res.send(screenshotBuffer);

    } catch (error) {
        console.error("Error capturing screenshot:", error);
        res.status(500).json({
            error: "Failed to capture screenshot",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (browser) await browser.close();
    }
};