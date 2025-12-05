import { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { request } from "../services/api";

const initialState = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    try {
      await request("POST", "/api/contact", { body: form });
      setStatus({ loading: false, error: "", success: "Message envoyé, merci !" });
      setForm(initialState);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <section className="section container" style={{ padding: "40px 0 80px" }}>
      <SectionTitle title="Contact" subtitle="Parlons de votre projet." />
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}
      >
        <form onSubmit={submit} className="card" style={{ display: "grid", gap: "12px" }}>
          <div>
            <label>Nom</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Téléphone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label>Sujet</label>
            <input name="subject" value={form.subject} onChange={handleChange} required />
          </div>
          <div>
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required />
          </div>
          <button className="btn" disabled={status.loading} type="submit">
            {status.loading ? "Envoi..." : "Envoyer"}
          </button>
          {status.error && <div style={{ color: "red" }}>{status.error}</div>}
          {status.success && <div style={{ color: "green" }}>{status.success}</div>}
        </form>

        <div className="card" style={{ display: "grid", gap: "12px" }}>
          <h3>Coordonnées</h3>
          <div>Adresse : Union des Comores, Rond-point BONZAMI, Immeuble Alliamani aux 1 ère étage</div>
          <div>Email : bargecomores@gmail.com</div>
          <div>333 65 81/ 773 00 19</div>
          <div style={{ background: "#e5e7eb", height: "220px", borderRadius: "12px" }}>
            <p style={{ padding: "16px", color: "var(--muted)" }}>Zone prévue pour une carte.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
