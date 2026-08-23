import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Laravel API URL
});

export default api;
