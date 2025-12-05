import { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import SectionTitle from "../components/SectionTitle";
import { request } from "../services/api";

export default function Team() {
  const [team, setTeam] = useState([]);
  useEffect(() => {
    request("GET", "/api/team")
      .then((res) => setTeam(res))
      .catch(() => {});
  }, []);

  return (
    <section className="section container" style={{ padding: "40px 0 80px" }}>
      <SectionTitle title="Équipe" subtitle="Architectes, designers, chefs de projet." />
      <div
        className="grid fade-in"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        {team.map((m) => (
          <div key={m.id} className="fade-in">
            <TeamCard member={m} />
          </div>
        ))}
        {team.length === 0 && <p>L'équipe sera publiée bientôt.</p>}
      </div>
    </section>
  );
}
