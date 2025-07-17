import axios from "axios";

export const bff = axios.create({
  baseURL: "/api",
  headers: {
    "X-APP-ID": "121",
    "X-USER-ID": "12",
    "X-CORRELATION-ID": "1590|E11011|42424",
  },
});

export const msDirecciones = axios.create({
  baseURL: "/ms-direcciones",
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});

export const cnr = axios.create({
  baseURL: "/cnr",
  headers: {
    "X-CORRELATION-ID": "2|E11011|332928",
    "X-TOKEN-ID": "12",
  },
});

export const estaciones = axios.create({
  baseURL: "/estaciones",
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});

export const contacto = axios.create({
  baseURL: "/test",
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-USER-ID": "12",
  },
});

export const source = axios.create({
  headers: {
    "X-CORRELATION-ID": "111|11|1",
    "X-TOKEN-ID": "12",
  },
});

function attachTokenInterceptor(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["X-TOKEN-ID"] = `Bearer ${token}`;
    }
    return config;
  });
}

[bff, cnr, contacto].forEach(attachTokenInterceptor);
