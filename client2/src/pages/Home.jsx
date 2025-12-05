import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import ProjectCard from "../components/ProjectCard";
import TeamCard from "../components/TeamCard";
import { request } from "../services/api";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [heroText, setHeroText] = useState(
    "BARGE SARL façonne des espaces élégants et durables."
  );

  useEffect(() => {
    request("GET", "/api/projects")
      .then((res) => setProjects(res.slice(0, 6)))
      .catch(() => {});
    request("GET", "/api/team")
      .then((res) => setTeam(res.slice(0, 3)))
      .catch(() => {});
    request("GET", "/api/content/home_hero")
      .then((res) => setHeroText(res.value))
      .catch(() => {});
  }, []);

  return (
    <>
      <Hero title="BARGE SARL" subtitle={heroText} />

      <section className="section container" style={{ padding: "60px 0" }}>
        <SectionTitle
          title="Projets récents"
          subtitle="Sélection de réalisations qui illustrent notre approche."
        />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {projects.map((p) => (
            <div key={p.id} className="fade-in">
              <ProjectCard project={p} />
            </div>
          ))}
          {projects.length === 0 && <p>Aucun projet pour le moment.</p>}
        </div>
      </section>

      <section className="section container" style={{ padding: "20px 0 80px 0" }}>
        <SectionTitle
          title="Équipe dirigeante"
          subtitle="Une équipe soudée d'architectes et de designers."
        />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {team.map((m) => (
            <div key={m.id} className="fade-in">
              <TeamCard member={m} />
            </div>
          ))}
          {team.length === 0 && <p>Bientôt les profils de l'équipe.</p>}
        </div>
      </section>
    </>
  );
}
