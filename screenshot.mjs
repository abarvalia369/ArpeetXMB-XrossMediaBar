// screenshot.mjs — screenshot a localhost URL into ./temporary screenshots/
// Usage: node screenshot.mjs http://localhost:3000
//        node screenshot.mjs http://localhost:3000 hero   (adds a label suffix)
// Files auto-increment (screenshot-1.png, screenshot-2.png, ...) and are never overwritten.
import puppeteer from "puppeteer";
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] ? `-${process.argv[3]}` : "";
const OUT_DIR = "temporary screenshots";

if (url.startsWith("file://")) {
  console.error("Refusing to screenshot a file:// URL — serve on localhost first (npm run dev).");
  process.exit(1);
}

// Find the next free screenshot-N number so nothing is overwritten.
async function nextIndex() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = await readdir(OUT_DIR);
  let max = 0;
  for (const f of files) {
    const m = f.match(/^screenshot-(\d+)/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

const n = await nextIndex();
const outPath = join(OUT_DIR, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath}`);
} catch (err) {
  console.error("Screenshot failed:", err.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
