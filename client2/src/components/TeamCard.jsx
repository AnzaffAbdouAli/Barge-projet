import { API_BASE } from "../services/api";

export default function TeamCard({ member }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      {member.photo_path ? (
        <img
          src={`${API_BASE}/uploads/${member.photo_path}`}
          alt={member.name}
          style={{ width: "100%", height: "220px", objectFit: "cover" }}
        />
      ) : (
        <div style={{ height: "220px", background: "#e5e7eb", borderRadius: "12px" }} />
      )}
      <h3 style={{ marginBottom: 4 }}>{member.name}</h3>
      <div style={{ color: "var(--muted)", marginBottom: 8 }}>{member.position}</div>
      <p style={{ color: "var(--muted)", fontSize: "14px" }}>{member.bio}</p>
    </div>
  );
}
