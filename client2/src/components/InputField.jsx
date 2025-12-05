export default function InputField({ label, as = "input", ...props }) {
  const Field = as;
  return (
    <div style={{ display: "grid", gap: "6px" }}>
      {label && <label>{label}</label>}
      <Field {...props} />
    </div>
  );
}
