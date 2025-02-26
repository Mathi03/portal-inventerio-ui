import axios from "axios";

export const bff = axios.create({
  baseURL: "/api",
  validateStatus: (status) => status < 500,
  headers: {
    "X-APP-ID": "11",
    "X-USER-ID": "1",
  },
});
