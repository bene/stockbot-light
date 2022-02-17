import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

function check(content: string): string | null {
  const doc = new DOMParser().parseFromString(content, "text/html");
  const elements = doc?.querySelectorAll("div.buy > div:nth-child(1)");

  if (!elements) {
    return null;
  }

  for (const element of elements) {
    const content = element.textContent;
    const data = JSON.parse(content);

    if (data.length !== 0) {
      const link = data[0].directPurchaseLink ?? data[0].purchaseLink;

      if (link) {
        return link;
      }
    }
  }

  return null;
}

export { check };
