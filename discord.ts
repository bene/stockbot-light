import { webhookURL } from "./environment.ts";

function notify(productName: string, storeName: string, url: string): void {
  fetch(webhookURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: "StockBot",
      embeds: [
        {
          color: "1879160",
          fields: [
            {
              name: "Store",
              value: storeName,
            },
            {
              name: "Product",
              value: productName,
            },
            {
              name: "Link",
              value: url,
            },
            {
              name: "Status",
              value: "IN STOCK",
            },
          ],
        },
      ],
    }),
  }).catch((_) => {
    console.log("Could not send notification via Discord.");
  });
}

function sendImage(image: Blob) {
  const data = new FormData();
  data.append("image", new File([image], "image.png", { type: "image/png" }));

  fetch(webhookURL, {
    method: "POST",
    body: data,
  }).catch((_) => {
    console.log("Could not send notification via Discord.");
  });
}

function sendRawMessage(message: string): void {
  fetch(webhookURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: "StockBot",
      embeds: [
        {
          color: "3447003",
          fields: [
            {
              name: "Info",
              value: message,
            },
          ],
        },
      ],
    }),
  }).catch((_) => {
    console.log("Could not send notification via Discord.");
  });
}

export { notify, sendRawMessage, sendImage };
