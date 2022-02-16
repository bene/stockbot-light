import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

function check(content: string): boolean {
  const doc = new DOMParser().parseFromString(content, "text/html");
  const elements = doc?.querySelectorAll(
    "#block-amd-content > div > div > div > div > div > div > article"
  );

  if (!elements) {
    return false;
  }

  const targets = [
    "RX 6700",
    "RX 6700 XT",
    "RX 6800",
    "RX 6800 XT",
    "RX 6900",
    "RX 6900 XT",
  ];

  for (const element of elements) {
    if (targets.some((target) => element.textContent.includes(target))) {
      if (
        !element.textContent.includes("Vergriffen") ||
        element.textContent.includes("Add to cart")
      ) {
        return true;
      }
    }
  }

  return false;
}

export { check };
