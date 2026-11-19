import { services, steps } from "./web/content/services";
export const domain = "https://sindev.tech";
export const routes = [
  "/",
  "/about",
  "/services",
  ...services.map((s) => "/" + s.slug),
  "/contact",
  "/privacy",
];
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
export function pageInfo(path: string) {
  if (path.startsWith("/admin"))
    return {
      title: "Private Project Studio | Sindev Technologies",
      heading: "Project studio.",
      description: "Owner-only project administration.",
    };
  const s = services.find((s) => "/" + s.slug === path);
  if (s)
    return {
      title: s.name + " | Sindev Technologies",
      heading: s.name,
      description: s.description,
    };
  const data: Record<string, string[]> = {
    "/": [
      "Websites, Branding & Automation | Sindev Technologies",
      "Big possibilities. Practical digital solutions.",
      "Sindev Technologies helps businesses globally with websites, branding, social media and practical automation. Based in Abuja, working remotely.",
    ],
    "/about": [
      "About Sindev Technologies | Global Digital Services",
      "Practical people. Digital possibilities.",
      "Meet Sindev Technologies, based in Abuja and working with businesses globally. Clear plans for websites, branding and useful workflows.",
    ],
    "/services": [
      "Digital Services for Businesses | Sindev Technologies",
      "The right digital tools. For your next move.",
      "Explore web development, Google Business Profile support, automation, branding, social media design and management.",
    ],
    "/contact": [
      "Request a Free Quote | Sindev Technologies",
      "What’s your next big idea?",
      "Tell Sindev Technologies about your project. Request a quote for web design, branding, automation or social media services.",
    ],
    "/privacy": [
      "Privacy Notice | Sindev Technologies",
      "Privacy notice.",
      "Read the draft privacy notice for Sindev Technologies, including enquiry handling, email links, administration and analytics.",
    ],
  };
  const d = data[path];
  return d
    ? { title: d[0], heading: d[1], description: d[2] }
    : {
        title: "Page unavailable | Sindev Technologies",
        heading: "This page isn’t here.",
        description: "Return to Sindev Technologies to explore our digital services.",
      };
}
export function renderInitial(path: string) {
  const info = pageInfo(path);
  const service = services.find((s) => "/" + s.slug === path);
  let content = "";
  if (path === "/" || path === "/services")
    content = services
      .map(
        (s) =>
          `<section><h2><a href="/${s.slug}">${escapeHtml(s.name)}</a></h2><p>${escapeHtml(s.description)}</p></section>`,
      )
      .join("");
  if (service)
    content = `<section><h2>What may be included</h2><ul>${service.includes.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul><p>${escapeHtml(service.note)}</p></section>`;
  if (path === "/" || service)
    content += `<section><h2>How a project works</h2>${steps.map(([t, c]) => `<h3>${escapeHtml(t)}</h3><p>${escapeHtml(c)}</p>`).join("")}</section>`;
  if (path === "/about")
    content =
      "<h2>Based in Abuja. Working globally.</h2><p>Sindev Technologies helps small businesses, startups and organisations with websites, local search, branding, social media and automation. We agree scope, costs, timeline, ownership and revisions before work begins.</p><h2>Meet the leadership</h2><h3>Muhammad Muhsin</h3><p>CEO</p><h3>Abdullahi Kudu</h3><p>Director of Projects</p>";
  if (path === "/contact")
    content =
      '<h2>Request a free quote</h2><p>The quote form opens your email app with a draft addressed to mmuhsin045@gmail.com. It does not send automatically. Enable JavaScript for the form, or email your project details directly.</p><a href="mailto:mmuhsin045@gmail.com">Email your enquiry</a>';
  if (path === "/privacy")
    content =
      "<p>Draft for business review. Updated 18 November 2026. Mailbox retention and provider practices must be confirmed before publication.</p><h2>Who we are</h2><p>Sindev Technologies is based in Abuja, Nigeria. Contact info@sindev.tech for privacy questions.</p><h2>Enquiries</h2><p>The form prepares a draft in your email app addressed to mmuhsin045@gmail.com. The website does not send or store enquiry content. Sent enquiries are processed by the mail services involved.</p><h2>Website services</h2><p>Runable hosting and built-in analytics process technical usage information. External WhatsApp and email services have their own policies. The final notice must confirm provider practices and retention.</p>";
  return `<header class="header wrap"><a href="/"><img src="/brand/logo.png" width="132" height="28" alt="Sindev"></a><nav><a href="/services">Services</a><a href="/about">About us</a><a href="/contact">Contact</a></nav></header><main class="wrap"><section class="page-hero"><h1>${escapeHtml(info.heading)}</h1><p>${escapeHtml(info.description)}</p><a class="button" href="/contact">Get a Free Quote ↗</a></section><div class="section">${content}</div></main><footer class="wrap section"><p>Sindev Technologies · Abuja, Nigeria · Working globally</p><a href="mailto:info@sindev.tech">info@sindev.tech</a> · <a href="/privacy">Privacy notice</a></footer>`;
}
export function seoHtml(
  html: string,
  path: string,
  initial?: string,
  override?: { title: string; description: string },
) {
  const info = override ? { ...pageInfo(path), ...override } : pageInfo(path);
  const canonical = domain + path;
  return html
    .replace(/<title>.*?<\/title>/, "<title>" + escapeHtml(info.title) + "</title>")
    .replace(
      /<!--sdv-head-start-->[\s\S]*?<!--sdv-head-end-->/,
      `<!--sdv-head-start--><meta name="description" content="${escapeHtml(info.description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(info.title)}"><meta property="og:description" content="${escapeHtml(info.description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website">${path.startsWith("/admin") ? '<meta name="robots" content="noindex,nofollow">' : ""}<!--sdv-head-end-->`,
    )
    .replace(
      /<!--sdv-content-start-->[\s\S]*?<!--sdv-content-end-->/,
      `<!--sdv-content-start-->${path.startsWith("/admin") ? "" : (initial ?? renderInitial(path))}<!--sdv-content-end-->`,
    );
}
