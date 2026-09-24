import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, LogOut, Pencil, Plus, Upload, X } from "lucide-react";
import { useLocation } from "wouter";

type RecordValue = Record<string, unknown>;
type FieldType = "text" | "textarea" | "date" | "number" | "checkbox" | "email" | "url" | "select" | "json";
type Field = { key: string; label: string; type: FieldType; help?: string; options?: string[] };

const resourceConfig: Record<string, { label: string; labelField: string; fields: Field[] }> = {
  people: {
    label: "People",
    labelField: "name",
    fields: [
      { key: "category", label: "Category", type: "select", options: ["PI", "Postdoctoral", "PhD", "MSc", "Research Assistant", "Undergraduate", "Visiting", "Alumni"] },
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "institution", label: "Institution", type: "text" },
      { key: "researchFocus", label: "Research focus", type: "textarea" },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "url" },
      { key: "status", label: "Status", type: "select", options: ["current", "alumni"] },
      { key: "photoMediaId", label: "Photo media ID", type: "number", help: "Upload an image in Media, then enter its ID here." },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "archived", label: "Archived", type: "checkbox" },
    ],
  },
  projects: {
    label: "Projects",
    labelField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "objective", label: "Objective", type: "textarea" },
      { key: "status", label: "Status", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "collaborators", label: "Collaborators", type: "json", help: "JSON array of verified collaborator names." },
      { key: "fundingAgency", label: "Funding agency", type: "text" },
      { key: "years", label: "Years", type: "text" },
      { key: "methods", label: "Methods", type: "textarea" },
      { key: "relatedPublications", label: "Related publications", type: "json", help: "JSON array of verified publication references." },
      { key: "imageMediaId", label: "Image media ID", type: "number" },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "archived", label: "Archived", type: "checkbox" },
    ],
  },
  news: {
    label: "News",
    labelField: "headline",
    fields: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "imageMediaId", label: "Image media ID", type: "number" },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "archived", label: "Archived", type: "checkbox" },
    ],
  },
  researchAreas: {
    label: "Research Areas",
    labelField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "researchQuestions", label: "Research questions", type: "json", help: "JSON array of verified questions." },
      { key: "methods", label: "Methods", type: "textarea" },
      { key: "geographicScope", label: "Geographic scope", type: "text" },
      { key: "relatedProjects", label: "Related projects", type: "json", help: "JSON array of project IDs or verified titles." },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "archived", label: "Archived", type: "checkbox" },
    ],
  },
  teaching: {
    label: "Teaching",
    labelField: "title",
    fields: [
      { key: "academicYear", label: "Academic year", type: "text" },
      { key: "courseCode", label: "Course code", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "program", label: "Program", type: "text" },
      { key: "term", label: "Term", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "archived", label: "Archived", type: "checkbox" },
    ],
  },
  profile: {
    label: "Profile / Site information",
    labelField: "name",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "appointment", label: "Appointment", type: "text" },
      { key: "labName", label: "Lab name", type: "text" },
      { key: "directorRole", label: "Director role", type: "text" },
      { key: "researchInterests", label: "Research interests", type: "json" },
      { key: "labEmail", label: "Lab email", type: "email" },
      { key: "university", label: "University", type: "text" },
      { key: "externalLinks", label: "Verified external links", type: "json", help: 'JSON array like [{"label":"Western","url":"https://..."}].' },
    ],
  },
  media: {
    label: "Media / Photos",
    labelField: "fileName",
    fields: [
      { key: "fileName", label: "File name", type: "text" },
      { key: "objectPath", label: "Object path", type: "text" },
      { key: "contentType", label: "Content type", type: "select", options: ["image/jpeg", "image/png", "image/webp", "image/gif"] },
      { key: "size", label: "Size in bytes", type: "number" },
      { key: "altText", label: "Alt text", type: "text" },
      { key: "associatedType", label: "Associate with", type: "select", options: ["people", "projects", "news"] },
      { key: "associatedId", label: "Associated record ID", type: "number" },
      { key: "displayOrder", label: "Display order", type: "number" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "archived", label: "Archived", type: "checkbox" },
    ],
  },
};

const defaultValue = (field: Field): unknown => {
  if (field.type === "checkbox") return false;
  if (field.type === "number") return 0;
  if (field.type === "json") return [];
  if (field.type === "select") return field.options?.[0] ?? "";
  return "";
};

const blankRecord = (resource: string): RecordValue =>
  Object.fromEntries(resourceConfig[resource].fields.map((field) => [field.key, defaultValue(field)]));

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: "include",
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new Error("Unable to reach the admin server. Please try again in a moment.");
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : "Request failed");
  return body as T;
}

export function AdminLoginPanel({ onClose, onAuthenticated }: { onClose: () => void; onAuthenticated: () => void }) {
  const [email, setEmail] = useState("admin@p3healthlab.local");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      onAuthenticated();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  };
  return <div className="admin-entry-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
    <form className="admin-login-card" onSubmit={submit}>
      <div className="admin-card-heading"><div><span className="eyebrow">Restricted access</span><h2 id="admin-login-title">Lab administration</h2></div><button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close admin login"><X size={18} /></button></div>
      <p>Sign in to manage verified lab records.</p>
      <label className="admin-field"><span>Email</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <div className="admin-field admin-password-field"><span>Password</span><div className="admin-password-control"><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" className="admin-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="button-primary admin-submit" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  </div>;
}

export function AdminGate() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<"loading" | "unauthorized" | "authorized">("loading");
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  useEffect(() => {
    api<{ user: { email: string; role: string } }>("/admin/auth/session")
      .then((result) => { setUser(result.user); setState("authorized"); })
      .catch(() => setState("unauthorized"));
  }, []);
  if (state === "loading") return <div className="admin-loading">Checking access…</div>;
  if (state !== "authorized" || !user) return <div className="admin-unavailable"><span className="eyebrow">Unavailable</span><h1>Not found.</h1><p>This area is not available.</p><button className="button-secondary" onClick={() => setLocation("/")}>Return to site <ArrowLeft size={14} /></button></div>;
  return <AdminDashboard user={user} onLogout={() => { setState("unauthorized"); setLocation("/"); }} />;
}

function AdminDashboard({ user, onLogout }: { user: { email: string; role: string }; onLogout: () => void }) {
  const [resource, setResource] = useState("people");
  const [items, setItems] = useState<RecordValue[]>([]);
  const [draft, setDraft] = useState<RecordValue | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const config = resourceConfig[resource];
  const fields = useMemo(() => config.fields, [config]);
  const load = async () => {
    setBusy(true);
    try {
      const result = await api<{ items: RecordValue[] }>(`/admin/content/${resource}`);
      setItems(result.items);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load records");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => { setDraft(null); void load(); }, [resource]);

  const updateDraft = (key: string, value: unknown) => setDraft((current) => ({ ...(current ?? blankRecord(resource)), [key]: value }));
  const edit = (item: RecordValue) => setDraft({ ...item });
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    setBusy(true);
    try {
      const body: RecordValue = { ...draft };
      for (const field of fields) {
        if (field.type === "json" && typeof body[field.key] === "string") body[field.key] = JSON.parse(body[field.key] as string);
        if (field.type === "number" && body[field.key] === "") body[field.key] = null;
      }
      const id = typeof draft.id === "number" ? `/${draft.id}` : "";
      await api(`/admin/content/${resource}${id}`, { method: id ? "PATCH" : "POST", body: JSON.stringify(body) });
      setDraft(null);
      setMessage("Saved.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save record");
    } finally {
      setBusy(false);
    }
  };
  const archive = async (id: unknown) => {
    if (typeof id !== "number" || !window.confirm("Archive this record?")) return;
    setBusy(true);
    try {
      await api(`/admin/content/${resource}/${id}`, { method: "DELETE" });
      setMessage("Record archived.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to archive record");
    } finally {
      setBusy(false);
    }
  };
  const uploadMedia = async (file: File) => {
    setBusy(true);
    setMessage("");
    try {
      const upload = await api<{ uploadURL: string; objectPath: string }>("/admin/media/upload-url", {
        method: "POST",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      const response = await fetch(upload.uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!response.ok) throw new Error("Image upload failed");
      await api("/admin/media/verify-upload", {
        method: "POST",
        body: JSON.stringify({ objectPath: upload.objectPath, size: file.size, contentType: file.type }),
      });
      setDraft({ ...blankRecord("media"), fileName: file.name, objectPath: upload.objectPath, contentType: file.type, size: file.size, published: false });
      setMessage("Upload complete. Add alt text and save the media record.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload image");
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    await api("/admin/auth/logout", { method: "POST" }).catch(() => undefined);
    onLogout();
  };

  return <div className="admin-dashboard">
    <header className="admin-header"><div><span className="eyebrow">P3 Health Lab</span><h1>Administration</h1></div><div className="admin-header-actions"><span>{user.email}</span><button className="admin-quiet-button" onClick={logout}><LogOut size={15} /> Sign out</button></div></header>
    <div className="admin-layout">
      <aside className="admin-sidebar" aria-label="Admin sections">{Object.entries(resourceConfig).map(([key, item]) => <button key={key} className={resource === key ? "is-active" : ""} onClick={() => setResource(key)}>{item.label}</button>)}</aside>
      <main className="admin-main">
        <div className="admin-main-heading"><div><span className="eyebrow">Verified records</span><h2>{config.label}</h2></div><button className="button-primary" onClick={() => setDraft(blankRecord(resource))}><Plus size={15} /> New record</button></div>
        {resource === "media" && <label className="admin-upload-button"><Upload size={15} /> Upload image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file); event.currentTarget.value = ""; }} /></label>}
        {message && <p className="admin-message" role="status">{message}</p>}
        {busy && !draft && <p className="admin-muted">Loading…</p>}
        <div className="admin-record-list">{items.map((item) => <article className={`admin-record ${item.archived ? "is-archived" : ""}`} key={String(item.id)}><div><span className="admin-record-meta">{item.published ? "Published" : "Draft"}{item.archived ? " · Archived" : ""}</span><h3>{String(item[config.labelField] ?? "Untitled record")}</h3><p>{resource === "media" ? `${String(item.contentType ?? "")} · ${String(item.size ?? "")} bytes` : String(item.summary ?? item.role ?? item.description ?? "")}</p></div><div className="admin-record-actions"><button className="admin-quiet-button" onClick={() => edit(item)}><Pencil size={14} /> Edit</button><button className="admin-quiet-button danger" onClick={() => void archive(item.id)}>Archive</button></div></article>)}</div>
        {!items.length && !busy && <div className="admin-empty"><Check size={18} /><p>No records yet. Add only verified information.</p></div>}
        {draft && <form className="admin-editor" onSubmit={save}><div className="admin-editor-heading"><h3>{draft.id ? "Edit record" : "New record"}</h3><button type="button" className="admin-icon-button" onClick={() => setDraft(null)} aria-label="Close editor"><X size={18} /></button></div><div className="admin-form-grid">{fields.map((field) => <AdminField key={field.key} field={field} value={draft[field.key]} onChange={(value) => updateDraft(field.key, value)} />)}</div><div className="admin-editor-actions"><button type="button" className="button-secondary" onClick={() => setDraft(null)}>Cancel</button><button type="submit" className="button-primary" disabled={busy}>{busy ? "Saving…" : "Save record"}</button></div></form>}
      </main>
    </div>
  </div>;
}

function AdminField({ field, value, onChange }: { field: Field; value: unknown; onChange: (value: unknown) => void }) {
  const displayValue = field.type === "json" && Array.isArray(value) ? JSON.stringify(value, null, 2) : String(value ?? "");
  if (field.type === "checkbox") return <label className="admin-field admin-checkbox"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span>{field.label}</span></label>;
  if (field.type === "select") return <label className="admin-field"><span>{field.label}</span><select value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select>{field.help && <small>{field.help}</small>}</label>;
  if (field.type === "textarea" || field.type === "json") return <label className="admin-field"><span>{field.label}</span><textarea value={displayValue} onChange={(event) => onChange(event.target.value)} rows={field.type === "json" ? 5 : 4} />{field.help && <small>{field.help}</small>}</label>;
  return <label className="admin-field"><span>{field.label}</span><input type={field.type} value={String(value ?? "")} onChange={(event) => onChange(field.type === "number" ? (event.target.value === "" ? "" : Number(event.target.value)) : event.target.value)} />{field.help && <small>{field.help}</small>}</label>;
}