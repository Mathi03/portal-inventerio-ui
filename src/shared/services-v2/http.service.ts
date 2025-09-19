import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface HttpServiceOptions {
  baseUrl: string;
  useCache?: boolean;
  cacheDuration?: number;
}

const HttpService = ({ baseUrl }: HttpServiceOptions) => {
  const http = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      // 'Access-Control-Allow-Origin': '*'
    },
  });

  http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token =
        localStorage.getItem("token") ||
        "eyJhbGciOiJIUzM4NCJ9.eyJjb2RFbXBsb3llZSI6IkI0QTcyQ0JFNDZBNDM1OTY2NTVDNkVGQzAxNThDRDM0Iiwic3ViIjoiZGVmYXVsdC1zdWJqZWN0IiwiaXNzIjoiZGVmYXVsdC1pc3N1ZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkZWZhdWx0LXVzZXJuYW1lIiwiaWF0IjoxNzQxMjEyODQ2LCJleHAiOjE3NDEyMTY0NDZ9.6ELCnqK5Q0nWIDJbnqkko4Nl0KudzesQtagmRW7aj2qGP-yAorv6cvnTUwauYPIo";
      const userId =
        localStorage.getItem("X-USER-ID") || "CEB58FDE89E9B392242F633B202F20FB";
      const correlationId =
        localStorage.getItem("X-CORRELATION-ID") || "2|E11011|332938";

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers["X-TOKEN-ID"] = token;

      config.headers["X-USER-ID"] = userId;
      config.headers["X-CORRELATION-ID"] = correlationId;

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
      }
      return Promise.reject(error);
    }
  );

  return http;
};

export default HttpService;
