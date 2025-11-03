import { useSWRConfig } from 'swr';
import { AxiosInstance } from 'axios';
import {
  bff,
  contacto,
  estaciones,
  msDirecciones,
  cnr,
  source
} from '@/core/config';

const urlClientMap: Record<string, AxiosInstance> = {
  [process.env.NEXT_PUBLIC_API_URL!]: bff,
  [process.env.NEXT_PUBLIC_API_URL_MS_DIRECCIONES!]: msDirecciones,
  [process.env.NEXT_PUBLIC_API_URL_ESTACIONES!]: estaciones,
  [process.env.NEXT_PUBLIC_API_URL_CONTACTO!]: contacto,
  [process.env.NEXT_PUBLIC_API_URL_CNR!]: cnr
};

function getAxiosClientFromUrl(url: string): AxiosInstance {
  const entry = Object.entries(urlClientMap).find(([baseUrl]) =>
    url.startsWith(baseUrl)
  );
  return entry?.[1] || source;
}

const buildCacheKey = (url: string) => {
  const u = new URL(url);
  const entries = [...u.searchParams.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  );
  u.search = '';
  for (const [k, v] of entries) u.searchParams.append(k, v);
  return u.toString();
};

const normalizeApiData = (r: any) => {
  const payload = r?.data?.data?.data ?? r?.data?.data ?? r?.data ?? r;

  // ⚠️ si el backend devuelve estructura de error, la detectamos
  if (payload?.status === 'BAD_REQUEST' || payload?.code >= 400) {
    throw new Error(payload?.message || 'Error en la API');
  }

  return payload;
};

const swrFetcher = async (url: string) => {
  const parsed = new URL(url);
  const client = getAxiosClientFromUrl(parsed.origin + parsed.pathname);
  const res = await client.get(url);
  return normalizeApiData(res);
};

const inflight = new Map<string, Promise<any>>();

export function useFetchCached() {
  const { cache, mutate } = useSWRConfig();

  const fetchCached = async <T = any>(url: string): Promise<T> => {
    const key = buildCacheKey(url);

    // 1. Buscar en cache global (ya resuelto)
    const cached = cache.get(key);
    if (cached) {
      return cached as T;
    }

    // 2. Buscar en inflight (ya se está pidiendo)
    if (inflight.has(key)) {
      return inflight.get(key) as Promise<T>;
    }

    // 3. Ejecutar fetcher y guardarlo como inflight
    const p = swrFetcher(url)
      .then((data) => {
        // guardar en SWR cache
        mutate(key, data, false);
        inflight.delete(key); // limpiar inflight
        return data;
      })
      .catch((err) => {
        // limpiar inflight si falló, para que un próximo intento vuelva a disparar el fetch
        inflight.delete(key);
        throw err;
      });

    inflight.set(key, p);

    return p;
  };

  return fetchCached;
}
