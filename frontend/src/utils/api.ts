import axios from "axios";

const api = axios.create({
  baseURL: "https://notes-taking-app-fxv2.onrender.com/api", // backend base url
  withCredentials: true,
});

export default api;
