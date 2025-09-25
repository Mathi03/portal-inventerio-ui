import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ConfigDataAttribute,
  TipoComponenteType,
} from "@/core/tipo-componente/tipo-componente.type";
import TabStrip from "@/components/TabStrip";
import TabStripTab from "@/components/TabStripTab";
import InputDynamic from "./InputDynamic";
import Link from "next/link";
import Icon from "@/components/Icon";
import { RELACIONES_TIPO_CIRCUITO } from "@/core/config/relacionesServicios";
import { useFetchCached } from "./useFetchCached";
import BlockUI from "@/components/BlockUi";

function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

// === helpers de normalización ===
const normalizeApiData = (r: any) =>
  r?.data?.data?.data ?? r?.data?.data ?? r?.data ?? r;

const ensurePaged = (url: string) => {
  const u = new URL(url);
  u.searchParams.set("page", "1");
  u.searchParams.set("limit", "10");
  return u.toString();
};

const DEFAULT_GROUP_LABEL = "Sin agrupación";
// Priorizar grupo
const PREFERRED_FIRST_GROUPS = ["Principal"];

function groupByGroup(items: ConfigDataAttribute[]) {
  const out: Record<string, ConfigDataAttribute[]> = {};
  for (const it of items) {
    const g =
      (it as any)?.group && String((it as any).group).trim()
        ? String((it as any).group).trim()
        : DEFAULT_GROUP_LABEL;
    (out[g] ??= []).push(it);
  }
  return out;
}

function sortGroupNames(names: string[]) {
  // 1) preferidos primero (en el orden indicado)
  // 2) alfabético
  // 3) DEFAULT_GROUP_LABEL al final
  return [...names].sort((a, b) => {
    const ia = PREFERRED_FIRST_GROUPS.indexOf(a);
    const ib = PREFERRED_FIRST_GROUPS.indexOf(b);
    const aIsDefault = a === DEFAULT_GROUP_LABEL;
    const bIsDefault = b === DEFAULT_GROUP_LABEL;

    if (ia !== -1 || ib !== -1) {
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    if (aIsDefault && !bIsDefault) return 1;
    if (bIsDefault && !aIsDefault) return -1;
    return a.localeCompare(b);
  });
}

type LoaderFn = (
  search: string,
  loadedOptions: Array<{ label: string; value: string }>,
  additional: { page: number }
) => Promise<{
  options: Array<{ label: string; value: string }>;
  hasMore: boolean;
  additional: { page: number };
}>;

interface ConfigDataProps {
  tipoComponente: TipoComponenteType | null;
  setAttributes: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  setServices: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  attributes: { [key: string]: any };
  services: { [key: string]: any };
  networkId: number | null;
  regionId: number | null;
  stationId: number | null;
  disabled?: boolean;
}

export default function ConfigData({
  tipoComponente,
  setAttributes,
  setServices,
  attributes,
  services,
  networkId,
  regionId,
  stationId,
  disabled = false,
}: ConfigDataProps) {
  const fetchCached = useFetchCached();

  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );

  const [filteredConfigServices, setFilteredConfigServices] = useState<
    ConfigDataAttribute[]
  >([]);

  const [resolvedAsyncValues, setResolvedAsyncValues] = useState<
    Record<string, { label: string; value: string }>
  >({});
  const dataCacheRef = useRef<Map<string, any>>(new Map());
  const inflightRef = useRef<Map<string, Promise<any>>>(new Map());

  const hasResolvedAsyncValues = useRef(false);

  const configDataItem = tipoComponente ? tipoComponente.configData?.[0] : null;
  const configAttributes = configDataItem?.configAttributes ?? [];
  const configServices = configDataItem?.configServices ?? [];

  useEffect(() => {
    dataCacheRef.current.clear();
    inflightRef.current.clear();
  }, [tipoComponente?.id]);

  const fetchOptions = async (
    url: string,
    responseFields?: string[],
    searchQuery = ""
  ): Promise<{ text: string; value: string }[]> => {
    try {
      const base = new URL(url, window.location.origin);
      if (searchQuery) base.searchParams.set("q", searchQuery);
      const finalUrl = base.toString();

      const response = await fetchCached(finalUrl);
      const data = normalizeApiData(response);

      const items: any[] = Array.isArray(data) ? data : (data?.items ?? data);

      const labelKey = responseFields?.[0] ?? "name";
      const valueKey = responseFields?.[1] ?? "value";

      return (items ?? []).map((item: any) => ({
        text: String(item?.[labelKey]),
        value: String(item?.[valueKey]),
      }));
    } catch (err) {
      console.error("Error fetching options from", url, err);
      return [];
    }
  };

  const onChange = async (name: string, value: any, inObject?: boolean) => {
    if (name.includes("#")) {
      const [groupKey, fieldKey] = name.split("#");

      setFormData((prev) => {
        // Obtenemos el array actual (o lo inicializamos con un objeto vacío)
        if (inObject) {
          const existingGroup = prev[groupKey] ?? {};
          const updatedGroup = { ...existingGroup, [fieldKey]: value };
          return { ...prev, [groupKey]: updatedGroup };
        } else {
          const existingGroup = prev[groupKey] ?? [{}];
          const updatedGroup = { ...existingGroup[0], [fieldKey]: value };
          return { ...prev, [groupKey]: [updatedGroup] };
        }
      });
    } else {
      // Si no contiene #, se guarda normalmente
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Buscar si este campo tiene una acción de on_change
    const allAttributes = [...configAttributes, ...configServices];
    const triggeringAttr = allAttributes.find((attr) => attr.name === name);

    if (triggeringAttr?.on_change) {
      const {
        target_name,
        valores_posibles_source,
        valores_posibles_response,
      } = triggeringAttr.on_change;

      // Reemplazar @value con el valor seleccionado
      const targetUrl = valores_posibles_source.replace("@value", value);
      const options = await fetchOptions(targetUrl, valores_posibles_response);

      // Guardar opciones en el select dependiente
      setDynamicOptions((prev) => ({ ...prev, [target_name]: options }));

      // Limpiar valor del dependiente
      setFormData((prev) => ({ ...prev, [target_name]: "" }));
    }

    if (name === "id_tipo_circuito") {
      const relacion = RELACIONES_TIPO_CIRCUITO.find(
        (r) => r.id === parseInt(value)
      );
      if (relacion) {
        const serviciosFiltrados = configServices.filter((service) =>
          relacion.servicios_asociados.some((s) => s.name === service.name)
        );
        setFilteredConfigServices(serviciosFiltrados);
      } else {
        setFilteredConfigServices([]);
      }
    }
  };

  const fetchValoresPosibles = async (
    attribute: ConfigDataAttribute,
    namePrefix = ""
  ) => {
    if (!attribute.valores_posibles_source) return;

    const keyField = `${namePrefix}${attribute.name}`;
    const url = ensurePaged(attribute.valores_posibles_source);

    const options = await fetchOptions(
      url,
      attribute.valores_posibles_response
    );

    // evita re-render si no cambió
    // setDynamicOptions((prev) => ({ ...prev, [key]: options }));

    setDynamicOptions((prev) => {
      const prevOpts = prev[keyField] ?? [];
      const sameLen = prevOpts.length === options.length;
      const same =
        sameLen &&
        prevOpts.every(
          (o, i) => o.text === options[i].text && o.value === options[i].value
        );
      if (same) return prev;
      return { ...prev, [keyField]: options };
    });
  };

  const loadPaginatedOptions = useCallback(
    (url: string, responseFields?: string[]) =>
      async (
        search: string,
        _loadedOptions: any,
        { page }: { page: number }
      ) => {
        const u = new URL(url);
        u.searchParams.set("page", String(page));
        // const limit = Number(u.searchParams.get("limit") ?? "10");
        u.searchParams.set("limit", "10");
        const limit = 10;
        const options = await fetchOptions(
          u.toString(),
          responseFields,
          search
        );
        return {
          options: options.map(({ text, value }) => ({ label: text, value })),
          hasMore: options.length >= limit,
          additional: { page: page + 1 },
        };
      },
    [fetchOptions]
  );

  const getLoader = useMemo(() => {
    const cache = new Map<string, LoaderFn>();
    return (src?: string, resp?: string[]) => {
      const key = `${src ?? ""}|${JSON.stringify(resp ?? [])}`;
      if (cache.has(key)) return cache.get(key)!;
      const fn = loadPaginatedOptions(src ?? "", resp);
      cache.set(key, fn);
      return fn;
    };
  }, [loadPaginatedOptions]);

  const isPaginatedSource = (src?: string) =>
    !!src && src.includes("limit=") && src.includes("page=");

  const prepareInputs = (
    attributes: ConfigDataAttribute[],
    namePrefix = ""
  ) => {
    attributes.forEach((attr) => {
      if (
        attr.valores_posibles_source &&
        !isPaginatedSource(attr.valores_posibles_source)
      ) {
        fetchValoresPosibles(attr, namePrefix);
      }

      if (attr.type === "array" && attr.atribs_config) {
        prepareInputs(attr.atribs_config, `${attr.name}_`);
      }
    });
  };

  useEffect(() => {
    prepareInputs(configAttributes);
    prepareInputs(configServices);
    setFilteredConfigServices([]);
  }, [tipoComponente]);

  useEffect(() => {
    const hasInitialData =
      Object.keys(attributes || {}).length > 0 ||
      Object.keys(services || {}).length > 0;
    if (hasInitialData) {
      setFormData((prev) => {
        if (Object.keys(prev).length === 0) {
          return { ...attributes, ...services };
        }
        return prev;
      });
    }
  }, [attributes, services]);

  useEffect(() => {
    const circuitoId = formData.id_tipo_circuito;
    if (
      circuitoId !== undefined &&
      circuitoId !== null &&
      configServices.length > 0
    ) {
      const relacion = RELACIONES_TIPO_CIRCUITO.find(
        (r) => r.id === parseInt(circuitoId)
      );
      if (relacion) {
        const serviciosFiltrados = configServices.filter((service) =>
          relacion.servicios_asociados.some((s) => s.name === service.name)
        );
        setFilteredConfigServices(serviciosFiltrados);
      } else {
        setFilteredConfigServices([]);
      }
    }
  }, [formData.id_tipo_circuito, configServices]);

  useEffect(() => {
    const attributeKeys = configAttributes.map((item) => item.name);
    const serviceKeys = configServices.map((item) => item.name);

    const newAttributes: { [key: string]: any } = {};
    const newServices: { [key: string]: any } = {};

    for (const key in formData) {
      if (attributeKeys.includes(key)) {
        newAttributes[key] = formData[key];
      } else if (serviceKeys.includes(key)) {
        newServices[key] = formData[key];
      }
    }

    // ⚠️ Solo actualizamos si hay algo útil que setear
    const shouldUpdateAttributes = Object.keys(newAttributes).length > 0;
    const shouldUpdateServices = Object.keys(newServices).length > 0;

    if (shouldUpdateAttributes) {
      setAttributes(newAttributes);
    }

    if (shouldUpdateServices) {
      setServices(newServices);
    }

    console.log("FormData", formData, newAttributes);
  }, [formData]);

  useEffect(() => {
    if (hasResolvedAsyncValues.current || !tipoComponente) return;
    let mounted = true;

    const resolveInitialAsyncValues = async () => {
      const allAttrs = [...configAttributes, ...configServices];
      const valuesToResolve: Record<string, any> = {
        ...formData,
        ...attributes,
        ...services,
      };
      const out: Record<string, { label: string; value: string }> = {};

      await Promise.all(
        allAttrs.map(async (attr) => {
          const fieldValue = valuesToResolve[attr.name];

          if (
            fieldValue &&
            isPaginatedSource(attr.valores_posibles_source) &&
            attr.valores_posibles_source &&
            attr.valores_posibles_response &&
            attr.valores_posibles_response?.length >= 2
          ) {
            try {
              const [labelKey, valueKey] = attr.valores_posibles_response;

              let data;
              if (valueKey.toLocaleLowerCase() == "id") {
                const baseUrl = attr.valores_posibles_source.split("?")[0];
                const url = `${baseUrl}/${fieldValue}`;
                data = await fetchCached(url);
                if (Array.isArray(data)) data = data[0];
              } else {
                const u = new URL(attr.valores_posibles_source);
                u.searchParams.set(camelToSnake(valueKey), String(fieldValue));
                const url = ensurePaged(u.toString());
                const list = await fetchCached(url);
                const arr = Array.isArray(list) ? list : (list?.data ?? list);
                data = Array.isArray(arr) ? arr[0] : arr;
              }

              if (data && data[valueKey]) {
                out[attr.name] = {
                  label: String(data[labelKey]),
                  value: String(data[valueKey]),
                };
              }
            } catch (error) {
              console.warn(
                `Error resolving initial async value for ${attr.name}:`,
                error
              );
            }
          }
        })
      );

      if (mounted) {
        setResolvedAsyncValues(out);
        hasResolvedAsyncValues.current = true;
      }
    };

    resolveInitialAsyncValues();
    return () => {
      mounted = false;
    };
  }, [tipoComponente]);

  const renderInputs = (
    attributes: ConfigDataAttribute[],
    namePrefix = "",
    inObject: boolean = false
  ) =>
    attributes
      .filter((attr) => attr.html_form_type)
      .map((attr, idx) => {
        const isPaginated =
          attr.valores_posibles_source?.includes("limit=") &&
          attr.valores_posibles_source?.includes("page=");

        const loader = isPaginated
          ? getLoader(
              attr.valores_posibles_source,
              attr.valores_posibles_response
            )
          : undefined;

        return (
          <InputDynamic
            key={`${namePrefix}${attr.name}-${idx}`}
            name={`${namePrefix}${attr.name}`}
            label={attr.label}
            value={
              isPaginated && resolvedAsyncValues[attr.name]
                ? resolvedAsyncValues[attr.name]
                : namePrefix.includes("#")
                  ? inObject
                    ? formData[namePrefix.split("#")[0]]?.[attr.name]
                    : formData[namePrefix.split("#")[0]]?.[0]?.[attr.name]
                  : formData[`${namePrefix}${attr.name}`]
            }
            type={attr.type}
            required={attr.required}
            html_form_type={attr.html_form_type}
            selectOptions={
              dynamicOptions[`${namePrefix}${attr.name}`] ||
              attr.valores_posibles?.map((i) => ({
                text: i.name?.toString(),
                value: i.value?.toString(),
              }))
            }
            isCreate={attr.is_create}
            networkId={networkId}
            regionId={regionId}
            stationId={stationId}
            onChange={(nameOC, valueOC) => onChange(nameOC, valueOC, inObject)}
            isPaginated={isPaginated}
            loadPaginatedOptions={loader}
          />
        );
      });

  const renderNestedInputs = (
    attributes: ConfigDataAttribute[],
    isService: boolean = false
  ) => {
    const nested = attributes.filter(
      (a) => a.type === "array" && a.atribs_config
    );
    return nested.map((attr, idx) => {
      const grouped = groupByGroup(attr.atribs_config || []);
      const groupNames = sortGroupNames(Object.keys(grouped));
      return (
        <div key={idx}>
          <h4>{attr.label} (Atributos secundarios)</h4>
          {groupNames.map((gName) => (
            <section key={gName} className="mt-3">
              <h5 className="text-[16px] font-medium mb-2">{gName}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {renderInputs(grouped[gName] || [], `${attr.name}#`, isService)}
              </div>
            </section>
          ))}
        </div>
      );
    });
  };
  const renderTabContent = (
    items: ConfigDataAttribute[],
    isService: boolean = false
  ) => {
    const flatItems = items.filter((a) => a.type !== "array");
    const grouped = groupByGroup(flatItems);
    const groupNames = sortGroupNames(Object.keys(grouped));

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h4>Atributos principales</h4>
          {groupNames.map((gName) => (
            <section key={gName} className="mt-3">
              <h5 className="text-[16px] font-medium mb-2">{gName}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
                {renderInputs(grouped[gName] || [])}
              </div>
            </section>
          ))}
        </div>
        {renderNestedInputs(items, isService)}
      </div>
    );
  };

  const tabsData = () => {
    const tabsToRender = [];
    if (configAttributes?.length > 0)
      tabsToRender.push({
        title: "Atributos",
        content: () => renderTabContent(configAttributes),
      });
    if (configServices?.length > 0)
      tabsToRender.push({
        title: "Servicios",
        content: () =>
          renderTabContent(
            filteredConfigServices.length > 0
              ? filteredConfigServices
              : configServices,
            true
          ),
      });
    return tabsToRender;
  };

  const Header = () => (
    <hgroup className="" style={{ marginBottom: "20px" }}>
      <h4 className="text-[20px]" style={{ marginBottom: "10px" }}>
        Configuración adicional
      </h4>
      {configAttributes?.length == 0 && configServices?.length == 0 ? (
        <span> No posee configuración</span>
      ) : (
        <>
          <p>
            Esta configuración es dinámica, por lo cual cambia según el criterio
            del administrador. Si desea modificarlo, haga clic en{" "}
            <Link
              href="/mantenedor-tipo-componente"
              className="text-[#0066FF] flex items-center gap-1"
            >
              Editar tipo componente {tipoComponente?.name}
              <Icon icon="edit" style={{ fontSize: "20px" }} />
            </Link>
          </p>
        </>
      )}
    </hgroup>
  );

  if (configAttributes?.length == 0 && configServices?.length == 0)
    return (
      <div className="col-span-full">
        <Header />
      </div>
    );

  return (
    <BlockUI blocked={disabled} className="col-span-full">
      <TabStrip
        selected={selectedTab}
        onSelect={({ selected }) => setSelectedTab(selected)}
        header={<Header />}
      >
        {tabsData().map((tab, index) => (
          <TabStripTab key={index} title={tab.title}>
            {tab.content()}
          </TabStripTab>
        ))}
      </TabStrip>
    </BlockUI>
  );
}
