let _userAgent: string;
const webhookURL =
  "https://discord.com/api/webhooks/933790326903173151/4DT5zcJu_Bm-4xByVCewzaoz20ExEfBX-bR1gVvBhly-RwXk5m1DgrEdzII_5uQj4zzF";

const interval = 5;
const timeout = 120;

function getUserAgent() {
  if (_userAgent) {
    return _userAgent;
  }

  const os = Deno.build.os;
  if (os === "linux") {
    _userAgent = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36`;
  } else if (os === "darwin") {
    _userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36`;
  } else {
    _userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36`;
  }

  return _userAgent;
}

export { getUserAgent, webhookURL, interval, timeout };
