import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:4321";
const OUT = resolve(process.cwd(), "qa/screenshots");

const routes = [
  { name: "01-home", path: "/" },
  { name: "02-about", path: "/about" },
  { name: "03-trips", path: "/trips" },
  { name: "04-faq", path: "/faq" },
  { name: "05-gallery", path: "/gallery" },
  { name: "06-contact", path: "/contact" },
];

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 800 },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const vp of viewports) {
    await mkdir(`${OUT}/${vp.name}`, { recursive: true });
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    const consoleIssues = [];
    page.on("pageerror", (err) => consoleIssues.push(`[pageerror] ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        consoleIssues.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    for (const route of routes) {
      const url = `${BASE}${route.path}`;
      const issuesAtStart = consoleIssues.length;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(800); // let fonts settle
        const file = `${OUT}/${vp.name}/${route.name}.png`;
        await page.screenshot({ path: file, fullPage: true });
        const newIssues = consoleIssues.slice(issuesAtStart);
        const ok = newIssues.length === 0 ? "OK" : `WARN(${newIssues.length})`;
        console.log(`${vp.name.padEnd(7)}  ${route.path.padEnd(10)}  ${ok}  → ${file}`);
        for (const issue of newIssues) console.log(`           ${issue}`);
      } catch (err) {
        console.error(`${vp.name.padEnd(7)}  ${route.path.padEnd(10)}  FAIL: ${err.message}`);
      }
    }

    await context.close();
  }
  await browser.close();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
