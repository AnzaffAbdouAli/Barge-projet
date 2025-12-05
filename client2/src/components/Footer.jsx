export default function Footer() {
  return (
    <footer style={{ padding: "40px 0", background: "#f9fafb", marginTop: "60px" }}>
      <div className="container" style={{ display: "grid", gap: "16px" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "18px" }}>BARGE SARL</div>
          <p style={{ color: "var(--muted)", maxWidth: "480px" }}>
            Bureau d'architecture spécialisé dans la conception d'espaces élégants, lumineux et durables.
          </p>
        </div>
        <div style={{ display: "grid", gap: "8px", color: "var(--muted)" }}>
          <div>Adresse : Union des Comores, Rond-point BONZAMI, Immeuble Alliamani aux 1 ère étage</div>
          <div>Email : bargecomores@gmail.com</div>
          <div>Tel : 333 65 81/ 773 00 19</div>
          <div>Réseaux : Instagram · LinkedIn</div>
          <div>Mentions légales · Politique de confidentialité</div>
        </div>
      </div>
    </footer>
  );
}
