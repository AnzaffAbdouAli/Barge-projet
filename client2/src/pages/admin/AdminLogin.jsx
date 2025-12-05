import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      const redirect = location.state?.from?.pathname || "/admin";
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #e5e7eb, #f8fafc)",
      }}
    >
      <form
        onSubmit={submit}
        className="card"
        style={{ width: "360px", display: "grid", gap: "14px" }}
      >
        <h2 style={{ margin: 0 }}>Connexion admin</h2>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn" type="submit">
          Se connecter
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Link to="/" style={{ color: "var(--muted)", textAlign: "center" }}>
          ← Retour au site
        </Link>
      </form>
    </div>
  );
}
