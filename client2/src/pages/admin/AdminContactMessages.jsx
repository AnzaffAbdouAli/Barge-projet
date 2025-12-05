import { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminContactMessages() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    request("GET", "/api/admin/contact-messages", { token })
      .then((res) => setMessages(res))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await request("PUT", `/api/admin/contact-messages/${id}/mark-read`, { token });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="grid" style={{ gap: "16px" }}>
      <h1>Messages de contact</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Sujet</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} style={{ background: m.is_read ? "transparent" : "#eef2ff" }}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.subject}</td>
                <td>{m.created_at ? new Date(m.created_at).toLocaleString() : "-"}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="btn secondary" type="button" onClick={() => alert(m.message)}>
                    Lire
                  </button>
                  {!m.is_read && (
                    <button className="btn secondary" type="button" onClick={() => markRead(m.id)}>
                      Marquer lu
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan="5">Aucun message pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
