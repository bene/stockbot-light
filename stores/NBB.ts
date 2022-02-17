function check(content: string, url: string): string | null {
  if (content.includes("549,00")) {
    return url;
  }
  return null;
}

export { check };
