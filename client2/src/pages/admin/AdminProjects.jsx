import { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const emptyForm = {
  title: "",
  description: "",
  project_type: "",
  location: "",
  year: "",
  surface: "",
};

export default function AdminProjects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const load = () => {
    request("GET", "/api/projects", { token })
      .then((res) => setProjects(res))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFiles([]);
    setEditing(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    files.forEach((file) => fd.append("images", file));
    try {
      if (editing) {
        fd.append("replace_images", files.length > 0 ? "true" : "false");
        await request("PUT", `/api/admin/projects/${editing}`, {
          body: fd,
          token,
          isForm: true,
        });
        setStatus({ loading: false, error: "", success: "Projet mis à jour." });
      } else {
        await request("POST", "/api/admin/projects", { body: fd, token, isForm: true });
        setStatus({ loading: false, error: "", success: "Projet créé." });
      }
      resetForm();
      load();
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  const handleEdit = (project) => {
    setEditing(project.id);
    setForm({
      title: project.title,
      description: project.description,
      project_type: project.project_type || "",
      location: project.location || "",
      year: project.year || "",
      surface: project.surface || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    try {
      await request("DELETE", `/api/admin/projects/${id}`, { token });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="grid" style={{ gap: "20px" }}>
      <h1>Projets</h1>
      <form onSubmit={submit} className="card" style={{ display: "grid", gap: "10px" }}>
        <h3 style={{ margin: 0 }}>{editing ? "Modifier un projet" : "Créer un projet"}</h3>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          <div>
            <label>Titre</label>
            <input name="title" value={form.title} onChange={onChange} required />
          </div>
          <div>
            <label>Type</label>
            <input name="project_type" value={form.project_type} onChange={onChange} />
          </div>
          <div>
            <label>Localisation</label>
            <input name="location" value={form.location} onChange={onChange} />
          </div>
          <div>
            <label>Année</label>
            <input name="year" value={form.year} onChange={onChange} />
          </div>
          <div>
            <label>Prix</label>
            <input name="surface" value={form.surface} onChange={onChange} />
          </div>
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={onChange} required />
        </div>
        <div>
          <label>Images</label>
          <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            Formats: png, jpg, webp. {editing ? "Laisser vide pour conserver les images." : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn" type="submit" disabled={status.loading}>
            {status.loading ? "Envoi..." : editing ? "Mettre à jour" : "Créer"}
          </button>
          {editing && (
            <button className="btn secondary" type="button" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
        {status.error && <div style={{ color: "red" }}>{status.error}</div>}
        {status.success && <div style={{ color: "green" }}>{status.success}</div>}
      </form>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Liste des projets</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Année</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.project_type}</td>
                <td>{p.year}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="btn secondary" type="button" onClick={() => handleEdit(p)}>
                    Éditer
                  </button>
                  <button className="btn secondary" type="button" onClick={() => handleDelete(p.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="4">Aucun projet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
