const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3001")
  .replace(/\/+$/, "");

export async function api(path, options = {}) {
  const { method = "GET", body, token } = options;
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensagem: text };
    }
  }

  if (!response.ok) {
    throw new Error(data.mensagem || `Erro HTTP ${response.status}`);
  }

  return data;
}
