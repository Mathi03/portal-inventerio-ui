import axios from "axios";

export const bff = axios.create({
  baseURL: "/api",
  validateStatus: (status) => status < 500,
  headers: {
    "X-APP-ID": "121",
    "X-USER-ID": "12",
  },
});

export const msDirecciones = axios.create({
  baseURL: "/ms-direcciones",
  validateStatus: (status) => status < 500,
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});

export const estaciones = axios.create({
  baseURL: "/estaciones",
  validateStatus: (status) => status < 500,
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});

export const contacto = axios.create({
  baseURL: "/test",
  validateStatus: (status) => status < 500,
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});

export const source = axios.create({
  validateStatus: (status) => status < 500,
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});
