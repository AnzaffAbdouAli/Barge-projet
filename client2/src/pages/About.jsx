import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { request } from "../services/api";

export default function About() {
  const [content, setContent] = useState(
  "BARGE SARL"
  );
  useEffect(() => {
    request("GET", "/api/content/about")
      .then((res) => setContent(res.value))
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Projets livrés", value: "120+" },
    { label: "Années d'expérience", value: "8" },
    { label: "Partenaires", value: "4" },
  ];
  const steps = [
    "Écoute des usages et analyse du site",
    "Concept architectural et modélisation",
    "Dialogue avec les parties prenantes",
    "Suivi d'exécution et livraison",
    "Fournir des services d'ingénierie de qualité contre toutes attentes",
    "Obtenir des résultats a temps, selon les spécifications et le budget",
    "Mener un instrument bien conçu pour le transfert de technologie",
    "Ooffrir les services et produits avec rapport qualité-prix à nos clients"
  ];

  return (
    <section className="section container" style={{ padding: "40px 0 80px" }}>
      <SectionTitle title="À propos" subtitle="Histoire, valeurs et méthode." />
      <div className="card" style={{ display: "grid", gap: "16px" }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>{content}</p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div>
          <h4>Approche</h4>
          <ul>
            {steps.map((step) => (
              <li key={step} style={{ color: "var(--muted)" }}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
