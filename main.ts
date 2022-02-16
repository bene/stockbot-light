import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";

import * as AMD from "./stores/AMD.ts";
import * as Nvidia from "./stores/Nvidia.ts";
import * as Discord from "./discord.ts";

import { sleep } from "./utils.ts";
import { startListening } from "./server.ts";
import { userAgent, interval, timeout } from "./environment.ts";

await Deno.mkdir("screenshots", { recursive: true });

const stores = [
  {
    name: "AMD",
    url: "https://www.amd.com/de/direct-buy/at",
    check: AMD.check,
  },
  {
    name: "Nvidia",
    url: "https://store.nvidia.com/de-de/geforce/store/?page=1&limit=9&locale=de-de&gpu=RTX%203070,RTX%203070%20Ti,RTX%203080,RTX%203060,RTX%203060%20Ti&manufacturer=NVIDIA",
    check: Nvidia.check,
  },
];
const browser = await puppeteer.launch();

async function main() {
  console.log(`[${new Date().toLocaleTimeString()}] Starting new run.`);

  await Promise.race([
    Promise.allSettled(
      stores.map(async ({ name, url, check }) => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(userAgent);
        await page.goto(url, {
          waitUntil: "networkidle2",
        });

        const content = await page.content();
        const match = check(content);

        if (match) {
          Discord.notify("RX 3000 Series", "AMD", url);
        }

        const screenshot = await page.screenshot({
          path: match
            ? `screenshots/${name}-${Date.now()}.png`
            : `screenshots/${name}-latest.png`,
          fullPage: true,
        });

        if (match) {
          Discord.sendImage(new Blob([screenshot as Uint8Array]));
        }

        await page.close();
      })
    ),
    new Promise((resolve) =>
      setTimeout(() => {
        console.log(`[${new Date().toLocaleTimeString()}] Timeout`);
        resolve(undefined);
      }, 1000 * timeout)
    ),
  ]);
  console.log(`[${new Date().toLocaleTimeString()}] Ending run.`);
}

Discord.sendRawMessage(
  `Now running.\n\nStores: ${stores.map((s) => s.name).join(", ")}`
);

async function loop() {
  while (true) {
    await main();
    await sleep(1000 * interval);
  }
}

await Promise.allSettled([startListening(), loop()]);
await browser.close();
