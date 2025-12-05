import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import SectionTitle from "../components/SectionTitle";
import { request } from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ type: "", year: "" });

  const load = () => {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.year) params.append("year", filters.year);
    const qs = params.toString() ? `?${params.toString()}` : "";
    request("GET", `/api/projects${qs}`)
      .then((res) => setProjects(res))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <section className="section container" style={{ padding: "40px 0 80px" }}>
      <SectionTitle title="Projets" subtitle="Grille des réalisations BARGE SARL." />
      <form
        onSubmit={applyFilters}
        className="card fade-in"
        style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}
      >
        <div style={{ display: "grid", gap: "4px" }}>
          <label>Type</label>
          <input
            name="type"
            placeholder="Maison, bureaux..."
            value={filters.type}
            onChange={handleFilterChange}
          />
        </div>
        <div style={{ display: "grid", gap: "4px" }}>
          <label>Année</label>
          <input name="year" placeholder="2024" value={filters.year} onChange={handleFilterChange} />
        </div>
        <button className="btn" type="submit">
          Filtrer
        </button>
      </form>

      <div
        className="grid fade-in"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: "24px" }}
      >
        {projects.map((p) => (
          <div key={p.id} className="fade-in">
            <ProjectCard project={p} />
          </div>
        ))}
        {projects.length === 0 && <p>Aucun projet trouvé.</p>}
      </div>
    </section>
  );
}
