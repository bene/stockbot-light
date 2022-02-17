import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";

import * as AMD from "./stores/AMD.ts";
import * as NBB from "./stores/NBB.ts";
import * as Nvidia from "./stores/Nvidia.ts";
import * as Discord from "./discord.ts";

import { sleep, resolveRedirect } from "./utils.ts";
import { startListening } from "./server.ts";
import { getUserAgent, interval, timeout } from "./environment.ts";

await Deno.mkdir("screenshots", { recursive: true });

const userAgent = getUserAgent();
const stores = [
  {
    name: "AMD",
    url: "https://www.amd.com/de/direct-buy/at",
    check: AMD.check,
  },
  {
    name: "NBB",
    url: "https://www.notebooksbilliger.de/pc+hardware/grafikkarten/nvidia/geforce+rtx+3070+nvidia/page/1?sort=price&order=asc&availability=alle",
    check: NBB.check,
  },
  {
    name: "Nvidia",
    url: "https://store.nvidia.com/de-de/geforce/store/?page=1&limit=9&locale=de-de&gpu=RTX%203070,RTX%203070%20Ti,RTX%203080,RTX%203060,RTX%203060%20Ti&manufacturer=NVIDIA",
    check: Nvidia.check,
    waitForFunction: `document.querySelector("body").innerText.includes("Kühlungssystem")`,
  },
];

const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function main() {
  console.log(`[${new Date().toLocaleTimeString()}] Starting new run.`);

  await Promise.race([
    Promise.allSettled(
      stores.map(async ({ name, url, check, waitForFunction }) => {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(userAgent);
        await page.setJavaScriptEnabled(true);
        if (waitForFunction) {
          await page.goto(url);
          await page.waitForFunction(waitForFunction);
        } else {
          await page.goto(url, {
            waitUntil: "networkidle2",
          });
        }
        await page.waitForTimeout(2000);

        const content = await page.content();
        const purchaseLink = check(content, url);

        if (purchaseLink) {
          const link = await resolveRedirect(purchaseLink);
          Discord.notify("RX 3000 Series", name, link ?? purchaseLink);
        }

        const screenshot = await page.screenshot({
          path: purchaseLink
            ? `screenshots/${name}-${Date.now()}.png`
            : `screenshots/${name}-latest.png`,
          fullPage: true,
        });

        if (purchaseLink) {
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
  `StockBot now running on **${Deno.hostname()}**\n\nStores: ${stores
    .map((s) => s.name)
    .join(", ")}\nInterval: ${interval} seconds`
);

async function loop() {
  while (true) {
    await main();
    await sleep(1000 * interval);
  }
}

await Promise.allSettled([startListening(), loop()]);
await browser.close();
