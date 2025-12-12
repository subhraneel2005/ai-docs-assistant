export const getMetadata = () => {
  const getMeta = (selector: string) =>
    document.querySelector(selector)?.getAttribute("content") || null

  return {
    url: window.location.href,
    title: document.title || getMeta('meta[property="og:title"]'),
    description:
      getMeta('meta[name="description"]') ||
      getMeta('meta[property="og:description"]'),
    image:
      getMeta('meta[property="og:image"]') ||
      getMeta('meta[name="twitter:image"]'),
    canonical:
      document.querySelector("link[rel='canonical']")?.getAttribute("href") ||
      null
  }
}
