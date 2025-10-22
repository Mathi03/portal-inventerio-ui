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
import IconButton from "./IconButton";
import useErrorHandler from "@/hooks/useErrorHandler";

const STATUS_LOADING_MESSAGE = "Cargando opciones...";
const STATUS_ERROR_MESSAGE =
  "No pudimos obtener la información. Intenta nuevamente.";
const STATUS_RETRYING_MESSAGE = "Reintentando...";

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
  disabled?: boolean;
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
  disabled = false,
}: SelectPaginateProps<T>) {
  const dataCacheRef = useRef<Map<string, any>>(new Map());
  const inflightRef = useRef<Map<string, Promise<any>>>(new Map());
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const isInitial = useRef(true);
  const { notifyError } = useErrorHandler(
    `No se pudieron cargar las opciones de ${label}.`
  );
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const retryRequestRef = useRef<(() => Promise<void>) | null>(null);

  const fetchCached = useCallback(
    async (url: string) => {
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
    },
    [clientToFetch]
  );

  const fetchOptions = useCallback(
    async (
      url: string,
      searchQuery = ""
    ): Promise<{ text: string; value: string }[]> => {
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
    },
    [clientToFetch, fetchCached, fieldKey, fieldName]
  );

  const loadPaginatedOptions = useCallback(
    (url: string) =>
      async (
        search: string,
        _loadedOptions: any,
        { page }: { page: number }
      ) => {
        let urlString = "";
        let limit: number;

        if (clientToFetch) {
          limit = 10;
          urlString = `${url}?page=${String(page)}&limit=${String(limit)}`;
        } else {
          const u = new URL(url);
          u.searchParams.set("page", String(page));
          if (!u.searchParams.get("limit")) u.searchParams.set("limit", "10");

          limit = Number(u.searchParams.get("limit") ?? "10");
          urlString = u.toString();
        }

        setRequestStatus("loading");
        setStatusMessage(STATUS_LOADING_MESSAGE);
        retryRequestRef.current = null;

        try {
          const options = await fetchOptions(urlString, search);
          setRequestStatus("idle");
          setStatusMessage(null);
          retryRequestRef.current = null;
          return {
            options: options.map(({ text, value }) => ({
              label: text,
              value,
            })),
            hasMore: options.length >= limit,
            additional: { page: page + 1 },
          };
        } catch (error) {
          setRequestStatus("error");
          setStatusMessage(STATUS_ERROR_MESSAGE);
          retryRequestRef.current = async () => {
            try {
              const cacheKey = buildCacheKey(urlString);
              dataCacheRef.current.delete(cacheKey);
              inflightRef.current.delete(cacheKey);
            } catch {
              // ignore cache cleanup errors
            }
            await fetchOptions(urlString, search);
          };
          notifyError(error);
          return {
            options: [],
            hasMore: false,
            additional: { page },
          };
        }
      },
    [clientToFetch, fetchOptions, notifyError]
  );

  const handleRetry = useCallback(async () => {
    if (!retryRequestRef.current) return;

    setRequestStatus("loading");
    setStatusMessage(STATUS_RETRYING_MESSAGE);

    try {
      await retryRequestRef.current();
      setRequestStatus("idle");
      setStatusMessage(null);
      retryRequestRef.current = null;
    } catch (error) {
      setRequestStatus("error");
      setStatusMessage(STATUS_ERROR_MESSAGE);
      notifyError(error);
    }
  }, [notifyError]);

  const resolveInitialSelection = useCallback(async () => {
    const fieldValue = value;

    if (
      fieldValue?.toString() !== "0" &&
      fieldValue &&
      fieldUrl &&
      fieldName &&
      fieldKey
    ) {
      let data;
      if (searchType === "byId" || fieldKey.toLocaleLowerCase() === "id") {
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
        return {
          label: String(data[fieldName]),
          value: String(data[fieldKey]),
        };
      }
    }

    return null;
  }, [fetchCached, fieldKey, fieldName, fieldUrl, mapById, searchType, value]);

  useEffect(() => {
    if (
      value?.toString() === "0" ||
      !value ||
      !fieldUrl ||
      !fieldName ||
      !fieldKey
    ) {
      return;
    }

    let mounted = true;

    const run = async (): Promise<void> => {
      setRequestStatus("loading");
      setStatusMessage(STATUS_LOADING_MESSAGE);
      retryRequestRef.current = null;

      try {
        const resolved = await resolveInitialSelection();
        if (!mounted) return;

        if (resolved) {
          setSelectedValue(resolved);
        }

        setRequestStatus("idle");
        setStatusMessage(null);
        retryRequestRef.current = null;
      } catch (error) {
        if (!mounted) return;

        setRequestStatus("error");
        setStatusMessage(STATUS_ERROR_MESSAGE);
        retryRequestRef.current = async () => {
          if (!mounted) return;
          await run();
        };
        throw error;
      }
    };

    run().catch((error) => {
      if (!mounted) return;
      notifyError(error);
    });

    return () => {
      mounted = false;
    };
  }, [
    fieldKey,
    fieldName,
    fieldUrl,
    notifyError,
    resolveInitialSelection,
    value,
  ]);

  return (
    <div className="relative w-full">
      {selectedValue && (
        <div className="absolute top-2 z-[1] left-3 text-sm text-gray-500 w-5/6 truncate">
          {label} {!required && "(opcional)"}
        </div>
      )}
      {requestStatus === 'error' && (
        <div className="absolute right-0 z-[1] top-3.5 text-sm text-gray-400">
          <IconButton
            icon="cached"
            onClick={handleRetry}
            disabled={!retryRequestRef.current || requestStatus === 'loading'}
            iconSize="!text-lg"
            className="bg-white mr-0.5"
            buttonWidth="w-8"
            buttonHeight="h-8"
          />
        </div>
      )}
      <AsyncPaginate
        className="h-[60px] group_field_paginated"
        classNamePrefix={"field_paginated"}
        debounceTimeout={1000}
        value={selectedValue}
        isDisabled={disabled}
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
      {/* mensaje para haciendo consulta y mostrar error en caso falle consulta */}
      {statusMessage && (
        <div
          className={`px-4 font-normal text-sm pt-1 ${
            requestStatus === 'error' ? 'text-[#c8102e]' : 'text-[#58617A]'
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
