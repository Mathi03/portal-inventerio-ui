import clsx from "clsx";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import Modal from "@/components/Modal";
import CreateForm from "@/app/crear-componente-red/CreateForm";
import { useFetchCached } from "./useFetchCached";
import Icon from "@/components/Icon";
import ClientInfo from "@/components/ClientInfo";
import { useSnackbar } from "@telefonica/mistica";

type AttrMap = { [key: string]: any };
type NodeSpec = { key: string; level: number };

const INDENTS = ["", "pl-0", "pl-6", "pl-10", "pl-14", "pl-20"];

function openNewWindow(id: number | string) {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/detalle-componente-red/${id}`;
  window.open(url, "_blank");
}

const toStr = (x: any) => String(x);
const getByPath = (obj: any, path: string) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

const clienteSpecs: NodeSpec[] = [
  { key: "id_control_nodo_a", level: 1 },
  { key: "id_control_tarjeta_a", level: 2 },
  { key: "id_control_puerto_a", level: 3 },
  { key: "id_control_nodo_dependiente_a", level: 1 },
];

const movistarSpecs: NodeSpec[] = [
  { key: "id_control_nodo_b", level: 1 },
  { key: "id_control_tarjeta_b", level: 2 },
  { key: "id_control_puerto_b", level: 3 },
  { key: "id_control_nodo_dependiente_b", level: 1 },
];

const camelToSnake = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();

const buildResolvedUrl = (
  source: string,
  valueKey: string,
  fieldValue: string | number
): string => {
  const fieldSnake = camelToSnake(valueKey);
  const urlObj = new URL(source);

  // si ya trae el parámetro -> lo reemplazamos
  if (urlObj.searchParams.has(fieldSnake)) {
    urlObj.searchParams.set(fieldSnake, String(fieldValue));
  } else {
    // sino lo agregamos
    urlObj.searchParams.set(fieldSnake, String(fieldValue));
  }

  // normalizamos paginación
  urlObj.searchParams.set("page", "1");
  urlObj.searchParams.set("limit", "10");

  return urlObj.toString();
};

const TreeView = ({
  tipoComponente,
  attributes,
}: {
  tipoComponente: TipoComponenteType | null;
  attributes: AttrMap | null;
}) => {
  const fetchCached = useFetchCached();
  const { openSnackbar } = useSnackbar();
  const [openForm, setOpenForm] = useState(false);
  const [openCliente, setOpenCliente] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [componenteRed, setComponenteRed] = useState<any | null>(null);
  const dataCacheRef = useRef<Map<string, any>>(new Map());
  const inflightRef = useRef<Map<string, Promise<any>>>(new Map());
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const [errorKeys, setErrorKeys] = useState<Set<string>>(new Set());

  const isReady = !!tipoComponente;
  const attrs = attributes ?? {};

  const allAttributes = useMemo(
    () =>
      (tipoComponente?.configData ?? []).flatMap(
        (c) => c.configAttributes ?? []
      ) ?? [],
    [tipoComponente]
  );

  const getCfg = useCallback(
    (name: string) => allAttributes.find((a: any) => a.name === name),
    [allAttributes]
  );
  const getLabelFromCfg = (name: string) => getCfg(name)?.label || name;

  const [resolved, setResolved] = useState<Record<string, string | string[]>>(
    {}
  );

  useEffect(() => {
    dataCacheRef.current.clear();
    inflightRef.current.clear();
  }, [tipoComponente?.id]);

  // === Resuelve etiquetas visibles (igual que antes) ===
  useEffect(() => {
    if (!isReady) {
      setResolved({});
      return;
    }
    let mounted = true;

    const visibleKeys = [...clienteSpecs, ...movistarSpecs]
      .map((s) => s.key)
      .filter((k, i, arr) => arr.indexOf(k) === i);

    const resolveForKey = async (key: string) => {
      const rawVal = attrs[key];
      if (rawVal == null) return;

      const cfg: any = getCfg(key);
      if (!cfg) return;

      const formType = cfg.html_form_type as
        | "input"
        | "select"
        | "date"
        | "multiple";

      if (formType !== "select" && formType !== "multiple") return;

      // 1) opciones estáticas
      if (Array.isArray(cfg.valores_posibles)) {
        const opts = cfg.valores_posibles as Array<{
          value: number | string;
          name: string;
        }>;
        if (formType === "select") {
          const found = opts.find((o) => toStr(o.value) === toStr(rawVal));
          if (mounted && found)
            setResolved((p) => ({ ...p, [key]: found.name }));
        } else {
          const ids = Array.isArray(rawVal) ? rawVal.map(toStr) : [];
          const labels = ids
            .map((id) => opts.find((o) => toStr(o.value) === id)?.name)
            .filter(Boolean) as string[];
          if (mounted) setResolved((p) => ({ ...p, [key]: labels }));
        }
        return;
      }

      // 2) opciones remotas (con cache)
      if (cfg.valores_posibles_source && cfg.valores_posibles_response) {
        const labelPath = (cfg.valores_posibles_response as string[])[0];
        const valueKey = (cfg.valores_posibles_response as string[])[1];

        const getObjById = async (id: string) => {
          // normaliza URL para key de cache
          if (valueKey.toLowerCase() === "id") {
            const baseUrl = cfg.valores_posibles_source.split("?")[0];
            const url = `${baseUrl}/${id}`;
            const data = await fetchCached(url);
            // si el endpoint devuelve una lista, toma el primero
            return Array.isArray(data) ? data[0] : data;
          } else {
            const url = buildResolvedUrl(
              cfg.valores_posibles_source,
              valueKey,
              id
            );
            const data = await fetchCached(url);
            // usualmente viene como lista paginada, toma el primero
            const list = Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
                ? data.data
                : data;
            return Array.isArray(list) ? list[0] : list;
          }
        };

        try {
          if (formType === "select") {
            const id = toStr(rawVal);
            if (id === "0") return;
            const obj = await getObjById(id);
            const label = getByPath(obj, labelPath) ?? id;
            if (mounted) setResolved((p) => ({ ...p, [key]: String(label) }));
          } else {
            const ids: string[] = Array.isArray(rawVal)
              ? rawVal.map(toStr)
              : [];
            const results = await Promise.all(
              ids.map(async (id) => {
                const obj = await getObjById(id);
                return getByPath(obj, labelPath) ?? id;
              })
            );
            if (mounted) setResolved((p) => ({ ...p, [key]: results }));
          }
        } catch {
          // silencio
        }
      }
    };

    Promise.all(visibleKeys.map(resolveForKey)).catch(() => {});
    return () => {
      mounted = false;
    };
  }, [isReady, attrs, getCfg]);

  // === CLICK: abre modal y pasa el resultado de fetchById usando el cacheRef ===
  const handleOpenFormForKey = useCallback(
    async (k: string, open?: boolean) => {
      const cfg: any = getCfg(k);
      const val = attrs[k];
      if (!cfg || val == null) return;

      const isSelect =
        cfg.html_form_type === "select" || cfg.html_form_type === "multiple";
      const hasRemote = !!cfg.valores_posibles_source;

      if (!isSelect || !hasRemote) return;

      try {
        setLoadingKeys((prev) => new Set(prev).add(k));
        setErrorKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(k);
          return newSet;
        });

        const valueKey = (cfg.valores_posibles_response as string[])[1];
        const id = Array.isArray(val) ? toStr(val[0]) : toStr(val);

        let url: string;
        if (valueKey.toLowerCase() === "id") {
          const baseUrl = cfg.valores_posibles_source.split("?")[0];
          url = `${baseUrl}/${id}`;
        } else {
          url = buildResolvedUrl(cfg.valores_posibles_source, valueKey, id);
        }

        const data = await fetchCached(url);
        const obj = Array.isArray(data)
          ? data[0]
          : Array.isArray(data?.data)
            ? data.data[0]
            : data;
        if (open && obj) {
          openNewWindow(obj?.id);
        } else {
          setComponenteRed(obj ?? null);
          setOpenForm(true);
        }
      } catch (err) {
        console.error(err);
        setErrorKeys((prev) => new Set(prev).add(k));
      } finally {
        setLoadingKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(k);
          return newSet;
        });
      }
    },
    [attrs, getCfg, fetchCached]
  );

  const renderValue = (key: string, raw: any) => {
    const val = resolved[key] ?? raw;
    if (val == null) return null;

    if (Array.isArray(val)) {
      return (
        <p className="text-xs leading-4 text-neutral-500">
          {val.filter(Boolean).join(" · ")}
        </p>
      );
    }
    if (typeof val === "object") {
      const { title, subtitle, line1, line2 } = val as any;
      return (
        <p className="text-xs leading-4 text-neutral-500">
          {[title, subtitle, line1, line2].filter(Boolean).map((t, i) => (
            <span key={i} className={i ? "block" : ""}>
              {t}
            </span>
          ))}
        </p>
      );
    }
    return <p className="text-xs leading-4 text-neutral-500">{String(val)}</p>;
  };

  const CheckItem = ({ k, level }: { k: string; level: number }) => (
    <div className="flex items-center justify-between">
      <div
        className={clsx(
          "flex items-center gap-3 w-full",
          INDENTS[level] || "pl-0",
          "cursor-pointer hover:bg-neutral-50 rounded-md p-1"
        )}
        role="button"
        onClick={() => handleOpenFormForKey(k)}
        title="Ver detalle"
      >
        <span className="mt-0.5 grid h-5 w-5 place-items-center rounded border border-neutral-300 bg-white shrink-0">
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M7.5 13.2 4.8 10.5l-1.1 1.1 3.8 3.8 8-8-1.1-1.1-6.9 6.9Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <div>
          <p className="font-medium">{getLabelFromCfg(k)}</p>
          <div className="flex items-center gap-2">
            {renderValue(k, attrs[k])}
            {/* Chips de estado */}
            {loadingKeys.has(k) && (
              <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5">
                Loading...
              </span>
            )}
            {errorKeys.has(k) && (
              <span className="text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5">
                Error
              </span>
            )}
          </div>
        </div>
      </div>

      <Icon
        icon="open_in_new"
        className="text-blue-500 cursor-pointer"
        onClick={() => {
          handleOpenFormForKey(k, true);
        }}
      />
    </div>
  );

  const renderCard = (title: string, specs: NodeSpec[], keyInfo: string) => {
    const filtered = specs.filter((s) => attrs[s.key] !== undefined);
    if (filtered.length === 0) return null;

    const labelAttribute =
      allAttributes?.find((a) => a.name === keyInfo)?.label ?? null;

    return (
      <section className="rounded-xl border border-neutral-300 bg-white shadow-sm">
        <header className="border-b border-neutral-200 px-5 py-3 flex items-center justify-center">
          <h2 className="text-center text-sm font-semibold tracking-wide text-neutral-700">
            {title}
          </h2>
          <Icon
            icon="visibility"
            className="text-blue-500 ml-1 cursor-pointer"
            onClick={() => {
              if (attrs[keyInfo]) {
                setSelectedId(Number(attrs[keyInfo]));
                setOpenCliente(true);
              } else {
                openSnackbar({
                  message: "No existe un valor en " + labelAttribute || keyInfo,
                  type: "CRITICAL",
                });
              }
            }}
          />
        </header>
        <div className="space-y-5 p-5">
          {filtered.map(({ key, level }) => (
            <CheckItem key={`check-${title}-${key}`} k={key} level={level} />
          ))}
        </div>
      </section>
    );
  };

  if (!isReady) return null;

  return (
    <div className="w-full rounded-lg bg-[#fafafa] border p-4 col-span-3">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
        {renderCard("Cliente", clienteSpecs, "id_cliente")}
        {renderCard("Movistar", movistarSpecs, "id_lider")}
      </div>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <CreateForm mode="read" componenteRed={componenteRed ?? {}} />
      </Modal>

      {selectedId && (
        <Modal
          open={openCliente}
          onClose={() => setOpenCliente(false)}
          size={{ width: "90%", height: "80%" }}
        >
          <ClientInfo clientId={selectedId} />
        </Modal>
      )}
    </div>
  );
};

export default TreeView;
