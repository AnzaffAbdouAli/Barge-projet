import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <h1>Dashboard</h1>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {[
          { title: "Projets", link: "/admin/projets", desc: "Créer et mettre à jour les projets." },
          { title: "Équipe", link: "/admin/equipe", desc: "Gérer les membres de l'équipe." },
          { title: "Contacts", link: "/admin/contact-messages", desc: "Messages reçus via le site." },
          { title: "Contenus", link: "/admin/content", desc: "Textes de la home et à propos." },
        ].map((item) => (
          <Link key={item.link} to={item.link} className="card" style={{ textDecoration: "none" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>{item.title}</h3>
            <p style={{ color: "var(--muted)", margin: 0 }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
