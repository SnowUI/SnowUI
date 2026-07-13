import { chromium } from "playwright";

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on("pageerror", (err) => {
        console.error("PAGE ERROR:", err.message);
    });

    page.on("console", (msg) => {
        if (msg.type() === "error") {
            console.error("CONSOLE ERROR:", msg.text());
        }
    });

    await page.goto("http://localhost:5173/?page=demo&file=ImageViewer-Demo");

    await new Promise((resolve) => setTimeout(resolve, 3000));
    await browser.close();
})();
