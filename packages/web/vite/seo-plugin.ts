import type { Plugin } from "vite";
import { seoHtml } from "../src/seo";
export default function seoPlugin(): Plugin {
  return {
    name: "sindev-seo",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        return seoHtml(html, (ctx.originalUrl || "/").split("?")[0]);
      },
    },
  };
}
