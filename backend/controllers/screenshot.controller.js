import puppeteer from "puppeteer";

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
                "--disable-dev-shm-usage",
                "--single-process",
                "--no-zygote",
            ],
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        // Capture screenshot as a Buffer
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        await browser.close();

        // Send screenshot as a response
        res.setHeader("Content-Type", "image/png");
        res.send(screenshotBuffer);

    } catch (error) {
        console.error("Error capturing screenshot:", error);
        res.status(500).json({ error: "Failed to capture screenshot" });
    }
};