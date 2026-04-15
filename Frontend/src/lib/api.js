const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  return parseResponse(response);
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const getAuthHeaders = () => {
  const user = getStoredUser();

  return user?.token
    ? {
        Authorization: `Bearer ${user.token}`,
      }
    : {};
};

export { API_BASE_URL };
