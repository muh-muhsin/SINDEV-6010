export function setMetadata(title: string, description: string, path: string) {
  document.title = title;
  for (const [selector, attribute, value] of [
    ['meta[name="description"]', "content", description],
    ['meta[property="og:title"]', "content", title],
    ['meta[property="og:description"]', "content", description],
    ['meta[property="og:url"]', "content", "https://sindev.tech" + path],
    ['link[rel="canonical"]', "href", "https://sindev.tech" + path],
  ]) {
    const node = document.querySelector(selector);
    node?.setAttribute(attribute, value);
  }
}
