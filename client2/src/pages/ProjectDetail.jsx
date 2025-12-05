import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { request, API_BASE } from "../services/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    request("GET", `/api/projects/${id}`)
      .then((res) => setProject(res))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div className="container" style={{ padding: "80px 0" }}>{error}</div>;
  if (!project) return <div className="container" style={{ padding: "80px 0" }}>Chargement...</div>;

  return (
    <section className="section container" style={{ padding: "40px 0 80px" }}>
      <Link to="/projets" style={{ color: "var(--muted)" }}>
        ← Retour aux projets
      </Link>
      <h1 style={{ marginBottom: "4px" }}>{project.title}</h1>
      <div style={{ color: "var(--muted)", marginBottom: "16px" }}>
        {project.location} · {project.year || "Année n/c"} · {project.project_type}
      </div>
      {project.images?.length > 0 && (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {project.images.map((img) => (
            <img
              key={img.id}
              src={`${API_BASE}/uploads/${img.image_path}`}
              alt={project.title}
              style={{ height: "220px", objectFit: "cover" }}
            />
          ))}
        </div>
      )}
      <div className="card" style={{ marginTop: "20px" }}>
        <p style={{ color: "var(--muted)" }}>{project.description}</p>
        <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
          <div>Type : {project.project_type || "n/c"}</div>
          <div>Localisation : {project.location || "n/c"}</div>
          <div>Surface : {project.surface || "n/c"}</div>
        </div>
      </div>
    </section>
  );
}
