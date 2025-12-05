import { useEffect, useState } from "react";
import { request } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const KEYS = [
  { key: "home_hero", label: "Texte héro Home" },
  { key: "about", label: "Texte À propos" },
  { key: "contact_intro", label: "Texte contact" },
];

export default function AdminContent() {
  const { token } = useAuth();
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    KEYS.forEach((entry) => {
      request("GET", `/api/content/${entry.key}`)
        .then((res) => setValues((prev) => ({ ...prev, [entry.key]: res.value })))
        .catch(() => {});
    });
  }, []);

  const save = async (key) => {
    try {
      await request("PUT", `/api/admin/content/${key}`, {
        body: { value: values[key] || "" },
        token,
      });
      setStatus("Sauvegardé");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="grid" style={{ gap: "16px" }}>
      <h1>Contenus</h1>
      {KEYS.map((entry) => (
        <div key={entry.key} className="card" style={{ display: "grid", gap: "10px" }}>
          <label>{entry.label}</label>
          <textarea
            value={values[entry.key] || ""}
            onChange={(e) => setValues({ ...values, [entry.key]: e.target.value })}
          />
          <button className="btn secondary" type="button" onClick={() => save(entry.key)}>
            Enregistrer
          </button>
        </div>
      ))}
      {status && <div>{status}</div>}
    </div>
  );
}
