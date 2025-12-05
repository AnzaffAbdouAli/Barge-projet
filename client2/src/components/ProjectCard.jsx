import { Link } from "react-router-dom";
import { API_BASE } from "../services/api";

export default function ProjectCard({ project }) {
  const mainImage = project.images?.find((i) => i.is_main) || project.images?.[0];
  return (
    <Link
      to={`/projets/${project.id}`}
      className="card"
      style={{ display: "grid", gap: "12px", textDecoration: "none" }}
    >
      {mainImage ? (
        <img
          src={`${API_BASE}/uploads/${mainImage.image_path}`}
          alt={project.title}
          style={{ width: "100%", height: "220px", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            height: "220px",
            background: "#e5e7eb",
            borderRadius: "12px",
          }}
        />
      )}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{project.title}</h3>
          {project.project_type && <span className="tag">{project.project_type}</span>}
        </div>
        <p style={{ color: "var(--muted)", margin: "6px 0 0 0" }}>{project.location}</p>
      </div>
    </Link>
  );
}
