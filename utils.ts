import { userAgent } from "./environment.ts";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveRedirect(link: string): Promise<string | null> {
  const res = await fetch(link, {
    redirect: "manual",
    headers: {
      "User-Agent": userAgent,
    },
  });

  const location = res.headers.get("Location");
  if (!location) {
    return link;
  } else {
    return await resolveRedirect(location);
  }
}

export { sleep, resolveRedirect };
