import {
  bff,
  cnr,
  contacto,
  estaciones,
  msDirecciones,
  source,
} from "@/core/config";
import { AxiosInstance } from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

type SelectPaginateProps<T> = {
  label: string;
  value?: string | number;
  required?: boolean;
  fieldName: string;
  fieldKey: string;
  fieldUrl: string;
  mapById?: string;
  clientToFetch?: AxiosInstance;
  searchType?: "byId" | "byParams";
  onChange: (value: string | number | null) => void;
};

const buildCacheKey = (url: string) => {
  const u = url.startsWith("http")
    ? new URL(url)
    : new URL(url, window.location.origin);

  const entries = [...u.searchParams.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  );

  u.search = "";
  for (const [k, v] of entries) u.searchParams.append(k, v);

  return u.pathname + (u.search ? `?${u.searchParams.toString()}` : "");
};

const urlClientMap: Record<string, AxiosInstance> = {
  [process.env.NEXT_PUBLIC_API_URL!]: bff,
  [process.env.NEXT_PUBLIC_API_URL_MS_DIRECCIONES!]: msDirecciones,
  [process.env.NEXT_PUBLIC_API_URL_ESTACIONES!]: estaciones,
  [process.env.NEXT_PUBLIC_API_URL_CONTACTO!]: contacto,
  [process.env.NEXT_PUBLIC_API_URL_CNR!]: cnr,
};

function getAxiosClientFromUrl(url: string): AxiosInstance {
  const entry = Object.entries(urlClientMap).find(([baseUrl]) =>
    url.startsWith(baseUrl)
  );
  return entry?.[1] || source;
}

const normalizeApiData = (r: any) =>
  r?.data?.data?.data ?? r?.data?.data ?? r?.data ?? r;

function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

const ensurePaged = (url: string) => {
  const u = new URL(url);
  if (!u.searchParams.has("page")) u.searchParams.set("page", "1");
  if (!u.searchParams.has("limit")) u.searchParams.set("limit", "10");
  return u.toString();
};

export function SelectPaginate<T>({
  label,
  value,
  required = false,
  fieldUrl,
  onChange,
  fieldKey,
  fieldName,
  mapById,
  clientToFetch,
  searchType = "byParams",
}: SelectPaginateProps<T>) {
  const dataCacheRef = useRef<Map<string, any>>(new Map());
  const inflightRef = useRef<Map<string, Promise<any>>>(new Map());
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const isInitial = useRef(true);

  const fetchCached = useCallback(async (url: string) => {
    const key = buildCacheKey(url);

    if (dataCacheRef.current.has(key)) {
      return dataCacheRef.current.get(key);
    }
    if (inflightRef.current.has(key)) {
      return inflightRef.current.get(key);
    }

    let client;
    if (clientToFetch) {
      client = clientToFetch;
    } else {
      const parsed = new URL(url);
      client = getAxiosClientFromUrl(parsed.origin + parsed.pathname);
    }

    const p = client
      .get(url)
      .then((res) => {
        const data = normalizeApiData(res);
        dataCacheRef.current.set(key, data);
        inflightRef.current.delete(key);
        return data;
      })
      .catch((err) => {
        inflightRef.current.delete(key);
        throw err;
      });

    inflightRef.current.set(key, p);
    return p;
  }, []);

  const fetchOptions = async (
    url: string,
    searchQuery = ""
  ): Promise<{ text: string; value: string }[]> => {
    try {
      let finalUrl = "";
      if (clientToFetch) {
        finalUrl = url;
        if (searchQuery) finalUrl += "&q=" + searchQuery;
      } else {
        const base = new URL(url, window.location.origin);
        if (searchQuery) base.searchParams.set("q", searchQuery);
        finalUrl = base.toString();
      }

      const data = await fetchCached(finalUrl);
      const items: any[] = Array.isArray(data) ? data : (data?.items ?? data);

      return (items ?? []).map((item: any) => ({
        text: String(item?.[fieldName]),
        value: String(item?.[fieldKey]),
      }));
    } catch (err) {
      console.error("Error fetching options from", url, err);
      return [];
    }
  };

  const loadPaginatedOptions = useCallback(
    (url: string) =>
      async (
        search: string,
        _loadedOptions: any,
        { page }: { page: number }
      ) => {
        let urlString = "";
        let limit;

        if (clientToFetch) {
          limit = 10;
          urlString = url + "?page=" + String(page) + "&limit=" + String(limit);
        } else {
          const u = new URL(url);
          u.searchParams.set("page", String(page));
          if (!u.searchParams.get("limit")) u.searchParams.set("limit", "10");

          limit = Number(u.searchParams.get("limit") ?? "10");
          urlString = u.toString();
        }

        const options = await fetchOptions(urlString, search);
        return {
          options: options.map(({ text, value }) => ({ label: text, value })),
          hasMore: options.length >= limit,
          additional: { page: page + 1 },
        };
      },
    [fetchOptions]
  );

  useEffect(() => {
    let mounted = true;

    const resolveInitialAsyncValues = async () => {
      const out: Record<string, { label: string; value: string }> = {};

      const fieldValue = value;

      if (fieldValue && fieldUrl && fieldName && fieldKey) {
        try {
          let data;
          if (searchType === "byId" || fieldKey.toLocaleLowerCase() == "id") {
            const baseUrl = fieldUrl.split("?")[0];
            const url = `${baseUrl}/${fieldValue}`;
            data = await fetchCached(url);
            if (mapById) data = data[mapById];

            if (Array.isArray(data)) data = data[0];
          } else {
            const u = fieldUrl.startsWith("http")
              ? new URL(fieldUrl)
              : new URL(fieldUrl, window.location.origin);
            u.searchParams.set(camelToSnake(fieldKey), String(fieldValue));
            const url = ensurePaged(u.toString());

            const list = await fetchCached(url);
            const arr = Array.isArray(list) ? list : (list?.data ?? list);
            data = Array.isArray(arr) ? arr[0] : arr;
          }

          if (data && data[fieldKey]) {
            out[value] = {
              label: String(data[fieldName]),
              value: String(data[fieldKey]),
            };
          }
        } catch (error) {
          console.warn(
            `Error resolving initial async value for ${value}:`,
            error
          );
        }
      }

      if (mounted && value) {
        setSelectedValue(out[value]);
      }
    };

    resolveInitialAsyncValues();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative w-full">
      {selectedValue && (
        <div className="absolute top-2 z-[1] left-3 text-sm text-gray-500 w-5/6 truncate">
          {label} {!required && "(opcional)"}
        </div>
      )}
      <AsyncPaginate
        className="h-[60px] group_field_paginated"
        classNamePrefix={"field_paginated"}
        debounceTimeout={1000}
        value={selectedValue}
        loadOptions={loadPaginatedOptions(fieldUrl)}
        onChange={(option) => {
          if (isInitial.current) isInitial.current = false;
          const selected = option === null ? null : option;
          setSelectedValue(selected);
          onChange(selected ? selected.value : null);
        }}
        additional={{ page: 1 }}
        placeholder={`${label} ${!required ? "(opcional)" : ""}`}
        isClearable
        required={required}
      />
    </div>
  );
}
