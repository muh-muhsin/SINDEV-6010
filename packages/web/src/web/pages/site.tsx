import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Globe2,
  Layers,
  Workflow,
  Check,
  Plus,
  Minus,
  Mail,
  MapPin,
} from "lucide-react";
import { services, steps } from "../content/services";
import Admin from "./admin";
import { Projects } from "./projects";
import { pageInfo } from "../../seo";
import { setMetadata } from "../lib/metadata";

export const Quote = ({ text = "Get a Free Quote", service = "" }) => (
  <Link
    className="button"
    href={"/contact" + (service ? "?service=" + encodeURIComponent(service) : "")}
  >
    {text}
    <ArrowUpRight size={17} />
  </Link>
);
function Header() {
  const [open, setOpen] = useState(false);
  const [path] = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [path]);
  return (
    <header className="header wrap">
      <Link href="/" aria-label="Sindev home">
        <img src="/brand/logo.png" width="132" height="28" alt="Sindev" />
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "open" : ""}>
        <Link href="/" className={path === "/" ? "active" : ""}>
          Home
        </Link>
        <Link href="/services" className={path.includes("service") ? "active" : ""}>
          Services
        </Link>
        <Link href="/about" className={path === "/about" ? "active" : ""}>
          About us
        </Link>
        <Link href="/contact">Contact</Link>
        <Quote />
      </nav>
    </header>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-cta">
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h2>
              Good ideas deserve
              <br />a great next step.
            </h2>
          </div>
          <Quote text="Let’s talk about your project" />
        </div>
        <div className="footer-main">
          <div>
            <Link href="/" className="footer-wordmark">
              sindev<span>↗</span>
            </Link>
            <p>
              Practical digital support.
              <br />
              Built around your business.
            </p>
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            <Link href="/services">Our services</Link>
            <Link href="/about">About Sindev</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
          <div>
            <span className="eyebrow">SAY HELLO</span>
            <a href="mailto:info@sindev.tech">
              info@sindev.tech <ArrowUpRight size={16} />
            </a>
            <a href="https://wa.me/17798888705" target="_blank" rel="noreferrer">
              WhatsApp <ArrowUpRight size={16} />
            </a>
            <p>Based in Abuja. Working globally.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sindev Technologies</span>
          <Link href="/privacy">Privacy notice</Link>
          <span>Thoughtful by design.</span>
        </div>
      </div>
    </footer>
  );
}
function VisualStrip() {
  return (
    <div
      className="visual-overflow"
      aria-label="Illustrations of our digital services, not client projects"
    >
      <div className="visual-strip">
        <div className="visual-card visual-brand">
          <div className="mini-top">
            IDENTITY / 01 <span>↗</span>
          </div>
          <div className="giant-s">S.</div>
          <div className="mini-bottom">MAKE YOUR MARK.</div>
        </div>
        <div className="visual-card visual-web">
          <div className="mini-top">
            WEB EXPERIENCES / 02 <span>● ● ●</span>
          </div>
          <div className="mock-window">
            <div className="mock-nav">
              your business <span>menu ↗</span>
            </div>
            <h3>
              A little clarity.
              <br />A lot of possibility.
            </h3>
            <div className="mock-button">Explore what’s next ↗</div>
            <div className="mock-arch" />
          </div>
        </div>
        <div className="visual-card visual-flow">
          <div className="mini-top">
            CONNECTED WORK / 03 <span>↗</span>
          </div>
          <div className="flow-node">
            <Mail size={17} /> New enquiry
          </div>
          <div className="flow-line" />
          <div className="flow-node">
            <Workflow size={17} /> A smarter workflow
          </div>
          <div className="flow-line" />
          <div className="flow-node">
            <Check size={17} /> One less manual task
          </div>
        </div>
        <div className="visual-card visual-type">
          <div className="mini-top">DESIGN THAT BELONGS / 04</div>
          <div className="big-type">
            Aa
            <br />
            <span>Bb.</span>
          </div>
          <div className="swatches">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
function ServiceRows({ limit = 6 }: { limit?: number }) {
  return (
    <div className="service-list">
      {services.slice(0, limit).map((s, i) => (
        <Link className="service-row" key={s.slug} href={"/" + s.slug}>
          <span className="service-num">0{i + 1}</span>
          <div>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
          </div>
          <ArrowUpRight className="service-arrow" />
        </Link>
      ))}
    </div>
  );
}
function Process() {
  return (
    <section className="section process">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">THE WAY WE WORK</span>
          <h2>
            From a conversation
            <br />
            to something useful.
          </h2>
        </div>
        <div className="steps">
          {steps.map(([title, copy], i) => (
            <div key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const qa = [
    [
      "Do you work with businesses outside Nigeria?",
      "Yes. Sindev is based in Abuja and works remotely with businesses elsewhere, subject to project fit and availability. We agree meetings and written updates before starting.",
    ],
    [
      "What will my project cost?",
      "Your quote depends on the scope, deliverables and current setup. Tell us what you need and we will propose a clear price and timeline before work begins.",
    ],
    [
      "Will I have access to my website and accounts?",
      "We agree ownership, account access and third-party licence arrangements before starting. Handover covers the parts you will manage.",
    ],
    [
      "Can you help after launch?",
      "Yes, we can discuss ongoing support and maintenance. What is included and for how long will be stated in your proposal.",
    ],
  ];
  return (
    <section className="section faq wrap">
      <div>
        <span className="eyebrow">A LITTLE MORE CLARITY</span>
        <h2>
          Good questions.
          <br />
          Straight answers.
        </h2>
        <p>
          Still wondering about something?
          <br />
          <Link href="/contact" className="text-link">
            Let’s talk <ArrowUpRight size={16} />
          </Link>
        </p>
      </div>
      <div>
        {qa.map(([q, a], i) => (
          <div className="faq-item" key={q}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              {q}
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </button>
            {open === i && <p>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-orbit orbit-left">
          <Globe2 />
          <span>
            Based in Abuja.
            <br />
            Working everywhere.
          </span>
        </div>
        <div className="hero-orbit orbit-right">
          <span className="orbit-s">↗</span>
          <span>
            Made for your
            <br />
            next chapter.
          </span>
        </div>
        <span className="eyebrow">
          <i className="status-dot" /> DIGITAL SERVICES, HUMAN APPROACH
        </span>
        <h1>
          Big possibilities.
          <br />
          Practical <span>digital solutions.</span>
        </h1>
        <p>
          Websites, branding and automation that help your business
          <br className="desktop-br" /> show up clearly and work a little smarter.
        </p>
        <Quote />
        <span className="hero-note">Your goals first. A clear plan next.</span>
      </section>
      <VisualStrip />
      <div className="service-ticker">
        <span>DESIGN WITH PURPOSE</span>
        <i>✳</i>
        <span>BUILD WITH CLARITY</span>
        <i>✳</i>
        <span>CONNECT THE DOTS</span>
        <i>✳</i>
        <span>MOVE BUSINESS FORWARD</span>
      </div>
      <section className="section wrap benefits">
        <div>
          <Layers className="benefit-icon" />
          <h3>Built around you.</h3>
          <p>
            We start with your business and the problem you want to solve. Not a one-size-fits-all
            package.
          </p>
        </div>
        <div>
          <ArrowRight className="benefit-icon" />
          <h3>Clear from day one.</h3>
          <p>
            Understand the scope, the cost and what happens next. Plain English. No software
            lecture.
          </p>
        </div>
        <div>
          <Globe2 className="benefit-icon" />
          <h3>Local roots. Global reach.</h3>
          <p>
            Based in Abuja, collaborating remotely with businesses wherever a good project takes us.
          </p>
        </div>
      </section>
      <section className="section services-section">
        <div className="wrap services-layout">
          <div className="service-intro">
            <span className="eyebrow">WHAT WE CAN HELP WITH</span>
            <h2>
              Your business.
              <br />
              Better connected.
            </h2>
            <p>
              From your first impression to the work behind the scenes, we make the digital pieces
              fit.
            </p>
            <Link href="/services" className="text-link">
              Explore all services <ArrowUpRight size={18} />
            </Link>
          </div>
          <ServiceRows />
        </div>
      </section>
      <Process />
      <section className="section wrap approach">
        <span className="eyebrow">NOT JUST ANOTHER HANDOFF</span>
        <h2>
          A partner in the process.
          <br />
          <span>Not a puzzle to figure out.</span>
        </h2>
        <div className="approach-bottom">
          <p>
            We explain the trade-offs, share progress at agreed points, and help you understand the
            assets you’ll manage. Your next step should feel clear—not complicated.
          </p>
          <Link href="/about" className="text-link">
            Get to know Sindev <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <Projects home />
      <Faq />
    </>
  );
}
function About() {
  return (
    <>
      <section className="page-hero wrap">
        <span className="eyebrow">HELLO, WE’RE SINDEV</span>
        <h1>
          Practical people.
          <br />
          Digital possibilities.
        </h1>
        <p>
          We help businesses turn websites, branding and everyday workflows into useful tools for
          their next chapter.
        </p>
      </section>
      <section className="section wrap split">
        <h2>
          A clear plan.
          <br />A human approach.
        </h2>
        <div>
          <p>
            Sindev Technologies is based in Abuja, Nigeria, and works remotely with businesses
            around the world. We support small businesses, startups and organisations with websites,
            local search, branding, social media and automation.
          </p>
          <p>
            We begin by understanding what’s slowing you down. Then we recommend work that fits,
            explain the trade-offs, and agree the scope before we start.
          </p>
          <p>
            Your proposal sets out costs, timelines, what you need to provide, and how revisions,
            account ownership and ongoing support are handled.
          </p>
        </div>
      </section>
      <section className="section team-section">
        <div className="wrap">
          <span className="eyebrow">THE PEOPLE BEHIND THE WORK</span>
          <h2>Meet the leadership.</h2>
          <div className="team">
            <div>
              <span className="team-initial">MM</span>
              <h3>Muhammad Muhsin</h3>
              <span className="eyebrow">CEO</span>
            </div>
            <div>
              <span className="team-initial sage">AK</span>
              <h3>Abdullahi Kudu</h3>
              <span className="eyebrow">DIRECTOR OF PROJECTS</span>
            </div>
          </div>
        </div>
      </section>
      <Process />
    </>
  );
}
function Services() {
  return (
    <>
      <section className="page-hero wrap">
        <span className="eyebrow">OUR SERVICES</span>
        <h1>
          The right digital tools.
          <br />
          For your next move.
        </h1>
        <p>
          Build a clearer presence. Simplify a workflow. Bring your brand together. Let’s start with
          what your business needs.
        </p>
      </section>
      <section className="section wrap">
        <ServiceRows />
      </section>
      <Process />
    </>
  );
}
function Detail({ slug }: { slug: string }) {
  const s = services.find((x) => x.slug === slug);
  if (!s) return <NotFound />;
  return (
    <>
      <section className="page-hero wrap">
        <Link className="eyebrow back-link" href="/services">
          ← ALL SERVICES
        </Link>
        <h1>{s.name}</h1>
        <p>{s.description}</p>
        <Quote text="Discuss your project" service={s.name} />
      </section>
      <section className="section wrap split">
        <div>
          <span className="eyebrow">A SCOPE THAT FITS</span>
          <h2>
            Useful work.
            <br />
            Clear expectations.
          </h2>
          <p>{s.note}</p>
        </div>
        <div className="included">
          <h3>What may be included</h3>
          {s.includes.map((x) => (
            <div key={x}>
              <Check size={18} />
              {x}
            </div>
          ))}
          <p>The final deliverables, timeline and price are confirmed in your proposal.</p>
        </div>
      </section>
      <Process />
    </>
  );
}
function Contact() {
  const [opened, setOpened] = useState(false);
  const preset = new URLSearchParams(window.location.search).get("service") || "";
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nPhone / WhatsApp: ${d.get("phone") || "Not provided"}\nService: ${d.get("service")}\n\nProject details:\n${d.get("message")}`;
    window.location.href =
      "mailto:mmuhsin045@gmail.com?subject=" +
      encodeURIComponent("Sindev project quote enquiry") +
      "&body=" +
      encodeURIComponent(body);
    setOpened(true);
  }
  return (
    <>
      <section className="page-hero wrap">
        <span className="eyebrow">LET’S MAKE A START</span>
        <h1>
          What’s your
          <br />
          next big idea?
        </h1>
        <p>Tell us about your business and what you’d like to improve. We’ll take it from there.</p>
      </section>
      <section className="section wrap contact-layout">
        <aside>
          <h2>
            A conversation.
            <br />
            Not a commitment.
          </h2>
          <p>
            No need to know the technical terms. A little context helps us understand your goals and
            recommend a useful next step.
          </p>
          <a href="mailto:info@sindev.tech" className="contact-link">
            <Mail size={19} /> info@sindev.tech
          </a>
          <a
            href="https://wa.me/17798888705"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <ArrowUpRight size={19} /> Talk on WhatsApp
          </a>
          <div className="contact-link">
            <MapPin size={19} /> Abuja, Nigeria · Working globally
          </div>
          <div className="note">
            After your enquiry, we can arrange a conversation and prepare a proposal with the work,
            price and expected timeline.
          </div>
        </aside>
        <form className="quote-form" onSubmit={submit}>
          <span className="eyebrow">REQUEST A FREE QUOTE</span>
          <div className="form-grid">
            <label>
              Your name <span>*</span>
              <input
                aria-label="Your name"
                name="name"
                required
                autoComplete="name"
                maxLength={120}
                placeholder="What should we call you?"
              />
            </label>
            <label>
              Email address <span>*</span>
              <input
                aria-label="Email address"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@business.com"
              />
            </label>
          </div>
          <label>
            Phone / WhatsApp <span className="optional">optional</span>
            <input
              aria-label="Phone or WhatsApp"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Include your country code"
            />
          </label>
          <label>
            What can we help with? <span>*</span>
            <select name="service" defaultValue={preset || "Not sure yet"}>
              {services.map((s) => (
                <option key={s.slug}>{s.name}</option>
              ))}
              <option>Not sure yet</option>
            </select>
          </label>
          <label>
            A little about your project <span>*</span>
            <textarea
              aria-label="Project details"
              name="message"
              required
              maxLength={4000}
              rows={5}
              placeholder="What does your business do, and what would you like to change?"
            />
          </label>
          <p className="form-note">
            This opens your email app with a draft addressed to mmuhsin045@gmail.com. Review it and
            press Send there. Your form details are not saved in this website.{" "}
            <Link href="/privacy">Privacy notice</Link>.
          </p>
          <button className="button" type="submit">
            Open email with enquiry <ArrowUpRight size={17} />
          </button>
          {opened && (
            <output className="form-status">
              An email draft was requested—not sent. If your mail app did not open, email{" "}
              <a href="mailto:mmuhsin045@gmail.com">mmuhsin045@gmail.com</a> directly with your
              project details.
            </output>
          )}
        </form>
      </section>
    </>
  );
}
function Privacy() {
  return (
    <>
      <section className="page-hero wrap">
        <span className="eyebrow">YOUR INFORMATION</span>
        <h1>Privacy notice.</h1>
        <p>
          How Sindev Technologies handles information when you visit this website or contact us.
        </p>
      </section>
      <article className="privacy wrap">
        <p className="notice-banner">
          Draft for business review · Last updated 18 November 2026. Mailbox retention and provider
          practices must be confirmed before publication.
        </p>
        <h2>Who we are</h2>
        <p>
          Sindev Technologies is a digital services business based in Abuja, Nigeria. For questions
          about your information, contact <a href="mailto:info@sindev.tech">info@sindev.tech</a>.
        </p>
        <h2>Project enquiries</h2>
        <p>
          The quote form prepares an email draft in your own mail application addressed to
          mmuhsin045@gmail.com. The website does not send that email or store the entered enquiry in
          its database. If you send it, your name, email address, optional phone number and project
          details are received in that mailbox and handled by the mail services involved.
        </p>
        <p>
          We use enquiry details to understand your request, respond, and discuss a potential
          project. Do not include passwords, payment details or sensitive personal information in
          your enquiry.
        </p>
        <h2>Website services and analytics</h2>
        <p>
          The website uses Runable hosting and its built-in analytics to understand usage. Technical
          data may be processed by the hosting and analytics services. The specific data collected,
          storage duration, cookie behavior and any consent requirements need to be verified before
          this draft is finalized.
        </p>
        <h2>WhatsApp and external links</h2>
        <p>
          WhatsApp and email links take you to services outside this website. Those services process
          information according to their own terms and privacy notices. Contacting us is not consent
          to receive marketing messages.
        </p>
        <h2>Administration and project content</h2>
        <p>
          Private project administration uses authenticated access. Only approved project
          information should be published; client names, images and outcomes must have permission
          where required. Account and storage providers process information needed to operate those
          services.
        </p>
        <h2>Retention and your requests</h2>
        <p>
          A mailbox enquiry-retention period has not yet been confirmed. You may contact us to ask
          about access, correction or deletion of information you have provided. We will consider
          requests under applicable law, including any legitimate recordkeeping obligations.
        </p>
        <h2>Changes</h2>
        <p>
          We may revise this notice as the website and our services change. The update date will be
          shown here.
        </p>
      </article>
    </>
  );
}
function NotFound() {
  return (
    <section className="page-hero wrap">
      <span className="eyebrow">404 / A WRONG TURN</span>
      <h1>This page isn’t here.</h1>
      <p>Let’s get you back to something useful.</p>
      <Link href="/" className="button">
        Back to home <ArrowRight size={16} />
      </Link>
    </section>
  );
}
export default function Site() {
  const [path] = useLocation();
  useEffect(() => {
    const info = pageInfo(path);
    if (!path.startsWith("/projects")) setMetadata(info.title, info.description, path);
  }, [path]);
  let page =
    path === "/" ? (
      <Home />
    ) : path === "/about" ? (
      <About />
    ) : path === "/services" ? (
      <Services />
    ) : path === "/contact" ? (
      <Contact />
    ) : path === "/privacy" ? (
      <Privacy />
    ) : path.startsWith("/admin") ? (
      <Admin />
    ) : path.startsWith("/projects") ? (
      <Projects />
    ) : services.some((s) => "/" + s.slug === path) ? (
      <Detail slug={path.slice(1)} />
    ) : (
      <NotFound />
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{page}</main>
      <Footer />
    </>
  );
}
