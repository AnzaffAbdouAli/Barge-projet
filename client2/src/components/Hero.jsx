import { Link } from "react-router-dom";

export default function Hero({ title, subtitle }) {
  return (
    <section
      className="section"
      style={{
        padding: "80px 0",
        background: "linear-gradient(120deg, #ffffff, #f1f5f9)",
      }}
    >
      <div className="container" style={{ display: "grid", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--muted)" }}>
          <span className="pill">Architecture contemporaine</span>
          <span>•</span>
          <span>BARGE SARL</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "42px", lineHeight: 1.1 }}>{title}</h1>
        <p style={{ maxWidth: "720px", color: "var(--muted)" }}>{subtitle}</p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link className="btn" to="/projets">
            Voir nos projets
          </Link>
          <Link className="btn secondary" to="/contact">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
