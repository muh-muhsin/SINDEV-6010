import { Link, useLocation } from "wouter";
import { useProjects, useProject } from "../queries/projects";
function ProjectDetail({ slug }: { slug: string }) {
  const q = useProject(slug);
  if (q.isLoading) return <div className="page-hero wrap">Loading project…</div>;
  if (!q.data)
    return (
      <section className="page-hero wrap">
        <h1>Project unavailable.</h1>
        <Link href="/projects">Back to projects</Link>
      </section>
    );
  const p = q.data;
  return (
    <article className="page-hero wrap project-detail">
      <Link className="eyebrow" href="/projects">
        ← PROJECTS
      </Link>
      <h1>{p.title}</h1>
      <p>{p.services}</p>
      <p style={{ whiteSpace: "pre-wrap" }}>{p.summary}</p>
      {p.images.map((i) => (
        <img key={i.key} src={i.url} alt={i.alt} />
      ))}
      {p.results && (
        <>
          <h2>Results</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{p.results}</p>
        </>
      )}
    </article>
  );
}
export function Projects({ home = false }: { home?: boolean }) {
  const [path] = useLocation();
  const q = useProjects();
  if (!home && path.startsWith("/projects/")) return <ProjectDetail slug={path.slice(10)} />;
  if (home && (q.isLoading || q.isError || !q.data?.length)) return null;
  return (
    <section className="section wrap">
      <span className="eyebrow">REAL WORK, SHARED WITH PERMISSION</span>
      <h2 style={{ margin: "20px 0 35px" }}>Projects with purpose.</h2>
      {q.isLoading ? (
        <p>Loading projects…</p>
      ) : q.isError ? (
        <p role="alert">Projects couldn’t load. Please try again later.</p>
      ) : !q.data?.length ? (
        <div className="project-empty">
          <h3>Good work takes shape.</h3>
          <p>Approved project examples will appear here when they’re ready.</p>
          <Link className="text-link" href="/contact">
            Discuss your project ↗
          </Link>
        </div>
      ) : (
        <div className="project-grid">
          {q.data.map((p) => (
            <Link className="project-card" href={"/projects/" + p.slug} key={p.id}>
              {p.images[0] && <img src={p.images[0].url} alt={p.images[0].alt} loading="lazy" />}
              <h3>{p.title} ↗</h3>
              <p>{p.services}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
