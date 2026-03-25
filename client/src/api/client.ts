import axios from "axios";

// Fall back to localhost block if env is missing
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Since we are skipping complex auth and focusing purely on the demo flow,
// we will intercept and inject a hardcoded token mechanism here if needed,
// but for now, we will just rely on the backend accepting the requests.
// Let's grab the token from localStorage if the user logged in.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
