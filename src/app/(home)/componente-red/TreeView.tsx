import clsx from "clsx";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AxiosInstance } from "axios";
import {
  bff,
  msDirecciones,
  estaciones,
  contacto,
  cnr,
  source, // fallback
} from "@/core/config";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import Modal from "@/components/Modal";
import CreateForm from "@/app/crear-componente-red/CreateForm";

type AttrMap = { [key: string]: any };
type NodeSpec = { key: string; level: number };

const INDENTS = ["", "pl-0", "pl-6", "pl-10", "pl-14", "pl-20"];

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

const stripQuery = (url: string) => url.split("?")[0];
const toStr = (x: any) => String(x);
const getByPath = (obj: any, path: string) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

const clienteSpecs: NodeSpec[] = [
  { key: "id_control_nodo_a", level: 1 },
  { key: "id_control_tarjeta_a", level: 2 },
  { key: "id_componente_puerto_a", level: 3 },
  { key: "id_control_nodo_dependiente_a", level: 1 },
];

const movistarSpecs: NodeSpec[] = [
  { key: "id_control_nodo_b", level: 1 },
  { key: "id_control_tarjeta_b", level: 2 },
  { key: "id_componente_puerto_b", level: 3 },
  { key: "id_control_nodo_dependiente_b", level: 1 },
];

const TreeView = ({
  tipoComponente,
  attributes,
}: {
  tipoComponente: TipoComponenteType | null;
  attributes: AttrMap | null;
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [componenteRed, setComponenteRed] = useState<any | null>(null);

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

  const cacheRef = useRef<Map<string, any>>(new Map());
  const [resolved, setResolved] = useState<Record<string, string | string[]>>(
    {}
  );

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

      // 2) opciones remotas
      if (cfg.valores_posibles_source && cfg.valores_posibles_response) {
        const base = stripQuery(cfg.valores_posibles_source as string);
        const labelPath = (cfg.valores_posibles_response as string[])[0];
        const client = getAxiosClientFromUrl(base);

        const fetchById = async (id: string) => {
          const url = `${base}/${encodeURIComponent(id)}`;
          if (cacheRef.current.has(url)) return cacheRef.current.get(url);
          const { data } = await client.get(url);
          cacheRef.current.set(url, data?.data);
          return data?.data;
        };

        try {
          if (formType === "select") {
            const id = toStr(rawVal);
            const obj = await fetchById(id);
            const label = getByPath(obj, labelPath) ?? id;
            if (mounted) setResolved((p) => ({ ...p, [key]: String(label) }));
          } else {
            const ids: string[] = Array.isArray(rawVal)
              ? rawVal.map(toStr)
              : [];
            const results = await Promise.all(
              ids.map(async (id) => {
                const obj = await fetchById(id);
                return getByPath(obj, labelPath) ?? id;
              })
            );
            if (mounted) setResolved((p) => ({ ...p, [key]: results }));
          }
        } catch {
          // silenciar
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
    async (k: string) => {
      const cfg: any = getCfg(k);
      const val = attrs[k];
      if (!cfg || val == null) return;

      const isSelect =
        cfg.html_form_type === "select" || cfg.html_form_type === "multiple";
      const hasRemote = !!cfg.valores_posibles_source;

      if (!isSelect || !hasRemote) return;

      const base = stripQuery(cfg.valores_posibles_source as string);
      const client = getAxiosClientFromUrl(base);
      const id = Array.isArray(val) ? toStr(val[0]) : toStr(val);
      const url = `${base}/${encodeURIComponent(id)}`;

      try {
        let obj = cacheRef.current.get(url);
        if (!obj) {
          const { data } = await client.get(url);
          obj = data?.data;
          cacheRef.current.set(url, obj);
        }
        setComponenteRed(obj ?? null);
        setOpenForm(true);
      } catch {
        // si falla, no abrir o abrir vacío a tu elección:
        // setComponenteRed(null); setOpenForm(true);
      }
    },
    [attrs, getCfg]
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
    <div
      className={clsx(
        "flex items-start gap-3",
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
        {renderValue(k, attrs[k])}
      </div>
    </div>
  );

  const renderCard = (title: string, specs: NodeSpec[]) => {
    const filtered = specs.filter((s) => attrs[s.key] !== undefined);
    if (filtered.length === 0) return null;

    return (
      <section className="rounded-xl border border-neutral-300 bg-white shadow-sm">
        <header className="border-b border-neutral-200 px-5 py-3">
          <h2 className="text-center text-sm font-semibold tracking-wide text-neutral-700">
            {title}
          </h2>
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
        {renderCard("Cliente", clienteSpecs)}
        {renderCard("Movistar", movistarSpecs)}
      </div>

      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <CreateForm mode="read" componenteRed={componenteRed ?? {}} />
      </Modal>
    </div>
  );
};

export default TreeView;
