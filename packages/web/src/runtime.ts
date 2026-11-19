import app from "./api";
import { db } from "./api/database";
import { projects } from "./api/database/schema";
import { eq } from "drizzle-orm";
import { domain, routes, seoHtml, escapeHtml } from "./seo";
const dist = `${import.meta.dirname}/../dist`;
const server = Bun.serve({
  port: Number(process.env.PORT ?? 4200),
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) return app.fetch(request);
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (path === "/robots.txt")
      return new Response(
        `User-agent: *\nDisallow: /admin\nDisallow: /api\nSitemap: ${domain}/sitemap.xml\n`,
        { headers: { "Content-Type": "text/plain" } },
      );
    if (path === "/sitemap.xml") {
      const published = await db
        .select({ slug: projects.slug })
        .from(projects)
        .where(eq(projects.published, true));
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[
          ...routes,
          ...published.map((p) => "/projects/" + p.slug),
        ]
          .filter((p) => p != "/privacy")
          .map((p) => `<url><loc>${domain}${p}</loc></url>`)
          .join("")}</urlset>`,
        { headers: { "Content-Type": "application/xml" } },
      );
    }
    let decoded: string;
    try {
      decoded = decodeURIComponent(path);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }
    if (decoded.split("/").includes("..") || decoded.includes("\\"))
      return new Response("Invalid path", { status: 400 });
    const file = Bun.file(dist + decoded);
    if (path !== "/" && (await file.exists())) return new Response(file);
    let status = 200;
    let initial: string | undefined;
    let override: { title: string; description: string } | undefined;
    if (path.startsWith("/projects/")) {
      const row = (
        await db
          .select()
          .from(projects)
          .where(eq(projects.slug, path.slice(10)))
      )[0];
      if (!row?.published) status = 404;
      else {
        override = {
          title: row.title + " | Sindev Technologies",
          description: row.summary.slice(0, 160),
        };
        initial = `<main class="page-hero wrap"><a href="/projects">← Projects</a><h1>${escapeHtml(row.title)}</h1><p>${escapeHtml(row.services)}</p><p>${escapeHtml(row.summary)}</p>${row.results ? "<h2>Results</h2><p>" + escapeHtml(row.results) + "</p>" : ""}</main>`;
      }
    } else if (path === "/projects") {
      const rows = await db.select().from(projects).where(eq(projects.published, true));
      override = {
        title: "Projects | Sindev Technologies",
        description: "Approved project examples from Sindev Technologies.",
      };
      initial = `<main class="page-hero wrap"><h1>Projects with purpose.</h1>${rows.map((p) => `<h2><a href="/projects/${p.slug}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.summary)}</p>`).join("")}</main>`;
    } else if (!routes.includes(path) && !path.startsWith("/admin")) status = 404;
    const html = await Bun.file(dist + "/index.html").text();
    return new Response(seoHtml(html, path, initial, override), {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  },
});
console.log(`Sindev server listening on http://localhost:${server.port}`);
