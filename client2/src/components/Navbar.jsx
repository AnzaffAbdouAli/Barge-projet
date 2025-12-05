import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.3)",
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        <NavLink to="/" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
          BARGE SARL
        </NavLink>
        <nav style={{ display: "flex", gap: "18px", fontWeight: 600 }}>
          <NavLink to="/a-propos" className="nav-link">
            À propos
          </NavLink>
          <NavLink to="/projets" className="nav-link">
            Projets
          </NavLink>
          <NavLink to="/equipe" className="nav-link">
            Équipe
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          <NavLink to="/admin/login" className="nav-link" style={{ color: "var(--muted)" }}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
