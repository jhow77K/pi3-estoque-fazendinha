export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || "Erro na comunicação com o servidor");
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Erro na requisição para ${endpoint}:`, error);
    throw error;
  }
};
