export default function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ margin: "0 0 6px 0" }}>{title}</h2>
      {subtitle && <p style={{ margin: 0, color: "var(--muted)" }}>{subtitle}</p>}
    </div>
  );
}
