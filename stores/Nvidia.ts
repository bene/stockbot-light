import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

function check(content: string): boolean {
  const doc = new DOMParser().parseFromString(content, "text/html");
  const elements = doc?.querySelectorAll(
    ".product-details-list-tile, .featured-container-xl"
  );

  if (!elements) {
    return false;
  }

  for (const element of elements) {
    const content = element.textContent;
    if (
      (!content.includes("DERZEIT NICHT VERFÜGBAR") &&
        !content.includes("OUT_OF_STOCK")) ||
      content.includes("JETZT KAUFEN")
    ) {
      return true;
    }
  }

  return false;
}

export { check };
