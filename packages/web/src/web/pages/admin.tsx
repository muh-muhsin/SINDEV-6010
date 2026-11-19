import { useEffect, useState } from "react";
import { authClient } from "../lib/auth";
import { useAdminProjects, useSaveProject, useUpload } from "../queries/projects";
type Edit = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  services: string;
  results: string;
  published: boolean;
  images: { key: string; alt: string; url?: string }[];
};
const blank = (): Edit => ({
  id: crypto.randomUUID(),
  title: "",
  slug: "",
  summary: "",
  services: "",
  results: "",
  published: false,
  images: [],
});
function Dashboard() {
  const q = useAdminProjects();
  const save = useSaveProject();
  const upload = useUpload();
  const [edit, setEdit] = useState<Edit | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function addImage(file: File) {
    setError("");
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("Choose a JPEG, PNG or WebP image smaller than 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const result = await upload.mutateAsync({
        type: file.type as "image/jpeg" | "image/png" | "image/webp",
        size: file.size,
      });
      const response = await fetch(result.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed. Try again.");
      setEdit((p) =>
        p
          ? {
              ...p,
              images: [...p.images, { key: result.key, alt: "", url: URL.createObjectURL(file) }],
            }
          : p,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setError("");
    try {
      await save.mutateAsync({
        ...edit,
        images: edit.images.map(({ key, alt }) => ({ key, alt })),
      });
      setEdit(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save project");
    }
  }
  if (q.isLoading) return <p>Loading your projects…</p>;
  if (q.isError)
    return (
      <div className="error">
        Administration could not load. Your account may not be authorized.{" "}
        <button onClick={() => q.refetch()}>Retry</button>
      </div>
    );
  return (
    <>
      <div className="admin-bar">
        <h1>Project studio.</h1>
        <button
          className="button"
          onClick={() => {
            setEdit(blank());
            setError("");
          }}
        >
          New project +
        </button>
      </div>
      <p>
        Drafts stay private. Publish only approved client information and substantiated results.
      </p>
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      {edit ? (
        <form className="quote-form project-edit" onSubmit={submit}>
          <div className="form-grid">
            <label>
              Project title
              <input
                aria-label="Project title"
                required
                value={edit.title}
                onChange={(e) => setEdit({ ...edit, title: e.target.value })}
              />
            </label>
            <label>
              URL slug
              <input
                aria-label="URL slug"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                value={edit.slug}
                placeholder="project-name"
                onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
              />
            </label>
          </div>
          <label>
            Services
            <input
              aria-label="Services"
              value={edit.services}
              placeholder="Web design, Branding"
              onChange={(e) => setEdit({ ...edit, services: e.target.value })}
            />
          </label>
          <label>
            Project summary
            <textarea
              aria-label="Project summary"
              required
              rows={5}
              value={edit.summary}
              onChange={(e) => setEdit({ ...edit, summary: e.target.value })}
            />
          </label>
          <label>
            Results (optional, evidence-backed)
            <textarea
              aria-label="Results"
              rows={3}
              value={edit.results}
              onChange={(e) => setEdit({ ...edit, results: e.target.value })}
            />
          </label>
          <label>
            Project images (maximum 12)
            <input
              aria-label="Project images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy || edit.images.length >= 12}
              onChange={(e) => {
                if (e.target.files?.[0]) void addImage(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </label>
          {busy && <output>Uploading image…</output>}
          {edit.images.map((im, i) => (
            <div key={im.key} style={{ marginBottom: 20 }}>
              {im.url && (
                <img
                  src={im.url}
                  alt="Project upload preview"
                  style={{ width: 140, borderRadius: 5 }}
                />
              )}
              <label>
                Image {i + 1} description
                <input
                  aria-label={`Image ${i + 1} description`}
                  required
                  value={im.alt}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      images: edit.images.map((x, n) =>
                        n === i ? { ...x, alt: e.target.value } : x,
                      ),
                    })
                  }
                />
              </label>
              <button
                type="button"
                className="small-button"
                onClick={() => setEdit({ ...edit, images: edit.images.filter((_, n) => n !== i) })}
              >
                Remove from project
              </button>
            </div>
          ))}
          <label>
            Visibility
            <select
              value={edit.published ? "published" : "draft"}
              onChange={(e) => setEdit({ ...edit, published: e.target.value === "published" })}
            >
              <option value="draft">Draft — private</option>
              <option value="published">Published — visible to visitors</option>
            </select>
          </label>
          <button type="submit" className="button" disabled={save.isPending || busy}>
            {save.isPending ? "Saving…" : "Save project"}
          </button>
          <button type="button" className="small-button" onClick={() => setEdit(null)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          {q.data?.length ? (
            q.data.map((p) => (
              <div className="admin-item" key={p.id}>
                <div>
                  <h3>{p.title}</h3>
                  <p>
                    {p.published ? "Published" : "Draft"} · /projects/{p.slug}
                  </p>
                </div>
                <button
                  className="small-button"
                  onClick={() => {
                    setEdit(p);
                    setError("");
                  }}
                >
                  Edit
                </button>
              </div>
            ))
          ) : (
            <div className="project-empty">
              <h3>Your next project starts here.</h3>
              <p>Create a draft, add images and publish when approved.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default function Admin() {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState("");
  const [signing, setSigning] = useState(false);
  useEffect(() => {
    void authClient.managedAuth
      .handleRedirect()
      .catch(() => setError("Sign-in could not finish. Please try again."));
  }, []);
  async function signIn() {
    setSigning(true);
    setError("");
    try {
      const r = await authClient.managedAuth.signIn({ provider: "google" });
      if (r.error) setError(r.error.message || "Sign-in failed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setSigning(false);
    }
  }
  return (
    <section className="admin-panel">
      {isPending ? (
        <p>Checking your session…</p>
      ) : !session ? (
        <>
          <span className="eyebrow">PRIVATE / SINDEV STUDIO</span>
          <h1>
            Your work.
            <br />
            Ready when you are.
          </h1>
          <p>
            Sign in with the authorized Google account to manage projects. Public registration is
            not available.
          </p>
          <button className="button" disabled={signing} onClick={signIn}>
            {signing ? "Signing in…" : "Continue with Google"}
          </button>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </>
      ) : session.user.email.toLowerCase() !== "mmuhsin045@gmail.com" ? (
        <>
          <h1>Owner access only.</h1>
          <button className="button" onClick={() => authClient.signOut()}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <div style={{ textAlign: "right", marginBottom: 25 }}>
            <button className="small-button" onClick={() => authClient.signOut()}>
              Sign out
            </button>
          </div>
          <Dashboard />
        </>
      )}
    </section>
  );
}
