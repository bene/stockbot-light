import { serve } from "https://deno.land/std@0.126.0/http/server.ts";

async function startListening() {
  await serve(
    async (req: Request) => {
      const url = new URL(req.url);
      const storeName = url.pathname.substring(1).split("/")[0];
      let img: Uint8Array;
      try {
        img = await Deno.readFile(`./screenshots/${storeName}-latest.png`);
      } catch (_error) {
        return new Response(null, { status: 404 });
      }

      return new Response(img, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
        },
      });
    },
    { port: 3000 }
  );
}

export { startListening };
