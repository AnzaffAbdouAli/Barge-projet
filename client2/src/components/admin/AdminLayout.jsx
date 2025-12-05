import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/projets", label: "Projets" },
  { to: "/admin/equipe", label: "Équipe" },
  { to: "/admin/contact-messages", label: "Contacts" },
  { to: "/admin/content", label: "Contenus" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside
        style={{
          borderRight: "1px solid var(--border)",
          padding: "24px 18px",
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "24px" }}>BARGE Admin</div>
        <div style={{ display: "grid", gap: "12px" }}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`admin-nav-link${pathname.startsWith(link.to) ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button
          className="btn secondary"
          style={{ marginTop: "24px", width: "100%" }}
          onClick={logout}
        >
          Se déconnecter
        </button>
      </aside>
      <main style={{ padding: "32px", background: "#f8fafc" }}>
        <Outlet />
      </main>
    </div>
  );
}
