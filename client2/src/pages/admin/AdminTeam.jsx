import { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const emptyForm = { name: "", position: "", bio: "" };

export default function AdminTeam() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const load = () => {
    request("GET", "/api/team", { token })
      .then((res) => setMembers(res))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const reset = () => {
    setForm(emptyForm);
    setPhoto(null);
    setEditing(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);
    try {
      if (editing) {
        await request("PUT", `/api/admin/team/${editing}`, {
          body: fd,
          token,
          isForm: true,
        });
        setStatus({ loading: false, error: "", success: "Membre mis à jour." });
      } else {
        await request("POST", "/api/admin/team", { body: fd, token, isForm: true });
        setStatus({ loading: false, error: "", success: "Membre créé." });
      }
      reset();
      load();
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  const handleEdit = (member) => {
    setEditing(member.id);
    setForm({ name: member.name, position: member.position, bio: member.bio || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      await request("DELETE", `/api/admin/team/${id}`, { token });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="grid" style={{ gap: "20px" }}>
      <h1>Équipe</h1>
      <form onSubmit={submit} className="card" style={{ display: "grid", gap: "10px" }}>
        <h3 style={{ margin: 0 }}>{editing ? "Modifier un membre" : "Ajouter un membre"}</h3>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          <div>
            <label>Nom</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label>Poste</label>
            <input name="position" value={form.position} onChange={onChange} required />
          </div>
        </div>
        <div>
          <label>Bio</label>
          <textarea name="bio" value={form.bio} onChange={onChange} />
        </div>
        <div>
          <label>Photo</label>
          <input type="file" onChange={(e) => setPhoto(e.target.files?.[0])} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn" type="submit" disabled={status.loading}>
            {status.loading ? "Envoi..." : editing ? "Mettre à jour" : "Ajouter"}
          </button>
          {editing && (
            <button className="btn secondary" type="button" onClick={reset}>
              Annuler
            </button>
          )}
        </div>
        {status.error && <div style={{ color: "red" }}>{status.error}</div>}
        {status.success && <div style={{ color: "green" }}>{status.success}</div>}
      </form>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Membres</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Poste</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.position}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="btn secondary" type="button" onClick={() => handleEdit(m)}>
                    Éditer
                  </button>
                  <button className="btn secondary" type="button" onClick={() => handleDelete(m.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="3">Aucun membre.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
