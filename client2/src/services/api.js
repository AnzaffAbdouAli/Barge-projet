export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function request(method, path, { body, token, isForm } = {}) {
  const headers = {};
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || "Erreur serveur";
    throw new Error(message);
  }
  return data.data || data;
}
