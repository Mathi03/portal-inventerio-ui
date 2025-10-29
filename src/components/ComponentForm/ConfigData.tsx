import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ConfigDataAttribute,
  TipoComponenteType
} from '@/core/tipo-componente/tipo-componente.type';
import TabStrip from '@/components/TabStrip';
import TabStripTab from '@/components/TabStripTab';
import InputDynamic from './InputDynamic';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { RELACIONES_TIPO_CIRCUITO } from '@/core/config/relacionesServicios';
import { useFetchCached } from './hooks/useFetchCached';
import BlockUI from '@/components/BlockUi';
import { buildShapeIndex } from './shape';
import { getValueAtPath, setValueAtPath } from './path-access';

// ========== HELPERS PUROS (fuera del componente) ==========
function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

const normalizeApiData = (r: any) =>
  r?.data?.data?.data ?? r?.data?.data ?? r?.data ?? r;

const ensurePaged = (url: string) => {
  const u = new URL(url);
  u.searchParams.set('page', '1');
  u.searchParams.set('limit', '10');
  return u.toString();
};

const DEFAULT_GROUP_LABEL = 'Sin agrupación';
const PREFERRED_FIRST_GROUPS = ['Principal'];

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

function walkAttributes(
  items: ConfigDataAttribute[],
  visitor: (attr: ConfigDataAttribute, path: string) => void,
  prefix = ''
) {
  items?.forEach((attr) => {
    const path = prefix ? `${prefix}#${attr.name}` : attr.name;
    visitor(attr, path);
    if (Array.isArray(attr.atribs_config) && attr.atribs_config.length > 0) {
      walkAttributes(attr.atribs_config, visitor, path);
    }
  });
}

// ========== TIPOS ==========
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

// ========== COMPONENTE PRINCIPAL ==========
export default function ConfigData({
  tipoComponente,
  setAttributes,
  setServices,
  attributes,
  services,
  networkId,
  regionId,
  stationId,
  disabled = false
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

  // 🔥 CRITICAL: Usar ref para evitar re-inicializaciones
  const hasInitializedRef = useRef(false);
  const isResolvingAsyncRef = useRef(false);

  // Extraer configuración
  const configDataItem = tipoComponente?.configData?.[0] ?? null;
  const configAttributes = useMemo(
    () => configDataItem?.configAttributes ?? [],
    [configDataItem]
  );
  const configServices = useMemo(
    () => configDataItem?.configServices ?? [],
    [configDataItem]
  );

  // 🔥 OPTIMIZACIÓN: Memoizar índices de forma estable
  const attributeShapeIndex = useMemo(
    () => buildShapeIndex(configAttributes, false),
    [configAttributes]
  );

  const serviceShapeIndex = useMemo(
    () => buildShapeIndex(configServices, true),
    [configServices]
  );

  const serviceRootNames = useMemo(
    () => new Set(configServices.map((attr) => attr.name)),
    [configServices]
  );

  const attributeByPath = useMemo(() => {
    const map = new Map<string, ConfigDataAttribute>();
    walkAttributes(configAttributes, (attr, path) => map.set(path, attr));
    walkAttributes(configServices, (attr, path) => map.set(path, attr));
    return map;
  }, [configAttributes, configServices]);

  const pickShapeIndex = useCallback(
    (path: string) => {
      const root = path.split('#')[0];
      return serviceRootNames.has(root)
        ? serviceShapeIndex
        : attributeShapeIndex;
    },
    [attributeShapeIndex, serviceRootNames, serviceShapeIndex]
  );

  // 🔥 OPTIMIZACIÓN: fetchOptions memoizado con useCallback
  const fetchOptions = useCallback(
    async (
      url: string,
      responseFields?: string[],
      searchQuery = ''
    ): Promise<{ text: string; value: string }[]> => {
      try {
        const base = new URL(url, window.location.origin);
        if (searchQuery) base.searchParams.set('q', searchQuery);
        const finalUrl = base.toString();

        const response = await fetchCached(finalUrl);
        const data = normalizeApiData(response);
        const items: any[] = Array.isArray(data) ? data : (data?.items ?? data);

        const labelKey = responseFields?.[0] ?? 'name';
        const valueKey = responseFields?.[1] ?? 'value';

        return (items ?? []).map((item: any) => ({
          text: String(item?.[labelKey]),
          value: String(item?.[valueKey])
        }));
      } catch (err) {
        console.error('Error fetching options from', url, err);
        return [];
      }
    },
    [fetchCached]
  );

  // 🔥 OPTIMIZACIÓN: onChange memoizado
  const onChange = useCallback(
    async (name: string, value: any) => {
      setFormData((prev) =>
        setValueAtPath(prev, name, value, pickShapeIndex(name))
      );

      const triggeringAttr = attributeByPath.get(name);

      if (triggeringAttr?.on_change) {
        const {
          target_name,
          valores_posibles_source,
          valores_posibles_response
        } = triggeringAttr.on_change;

        if (target_name && valores_posibles_source) {
          const targetUrl = valores_posibles_source.replace('@value', value);
          const options = await fetchOptions(
            targetUrl,
            valores_posibles_response
          );

          setDynamicOptions((prev) => ({
            ...prev,
            [target_name]: options
          }));

          setResolvedAsyncValues((prev) => {
            if (!(target_name in prev)) return prev;
            const next = { ...prev };
            delete next[target_name];
            return next;
          });

          setFormData((prev) =>
            setValueAtPath(prev, target_name, '', pickShapeIndex(target_name))
          );
        }
      }

      // Manejar cambio de tipo de circuito
      if (name === 'id_tipo_circuito') {
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
    },
    [attributeByPath, configServices, fetchOptions, pickShapeIndex]
  );

  // 🔥 OPTIMIZACIÓN: Cargar opciones estáticas solo una vez
  const fetchValoresPosibles = useCallback(
    async (attribute: ConfigDataAttribute, fieldPath: string) => {
      if (!attribute.valores_posibles_source) return;

      const url = ensurePaged(attribute.valores_posibles_source);
      const options = await fetchOptions(
        url,
        attribute.valores_posibles_response
      );

      setDynamicOptions((prev) => {
        const prevOpts = prev[fieldPath] ?? [];
        const sameLen = prevOpts.length === options.length;
        const same =
          sameLen &&
          prevOpts.every(
            (o, i) => o.text === options[i].text && o.value === options[i].value
          );
        if (same) return prev;
        return { ...prev, [fieldPath]: options };
      });
    },
    [fetchOptions]
  );

  // 🔥 OPTIMIZACIÓN: loadPaginatedOptions memoizado
  const loadPaginatedOptions = useCallback(
    (url: string, responseFields?: string[]) =>
      async (search: string, _: any, { page }: { page: number }) => {
        const u = new URL(url);
        u.searchParams.set('page', String(page));
        u.searchParams.set('limit', '10');
        const options = await fetchOptions(
          u.toString(),
          responseFields,
          search
        );
        return {
          options: options.map(({ text, value }) => ({ label: text, value })),
          hasMore: options.length >= 10,
          additional: { page: page + 1 }
        };
      },
    [fetchOptions]
  );

  const getLoader = useMemo(() => {
    const cache = new Map<string, LoaderFn>();
    return (src?: string, resp?: string[]) => {
      const key = `${src ?? ''}|${JSON.stringify(resp ?? [])}`;
      if (cache.has(key)) return cache.get(key)!;
      const fn = loadPaginatedOptions(src ?? '', resp);
      cache.set(key, fn);
      return fn;
    };
  }, [loadPaginatedOptions]);

  const isPaginatedSource = (src?: string) =>
    !!src && src.includes('limit=') && src.includes('page=');

  // 🔥 OPTIMIZACIÓN: Preparar inputs solo cuando cambia tipoComponente
  useEffect(() => {
    if (!tipoComponente) return;

    const prepareInputs = (attributes: ConfigDataAttribute[]) => {
      walkAttributes(attributes, (attr, path) => {
        if (
          attr.valores_posibles_source &&
          !isPaginatedSource(attr.valores_posibles_source)
        ) {
          fetchValoresPosibles(attr, path);
        }
      });
    };

    prepareInputs(configAttributes);
    prepareInputs(configServices);
    setFilteredConfigServices([]);
  }, [tipoComponente?.id, configAttributes, configServices]);

  // 🔥 FIX CRÍTICO: Inicialización de formData SOLO UNA VEZ
  useEffect(() => {
    const hasData =
      Object.keys(attributes || {}).length > 0 ||
      Object.keys(services || {}).length > 0;

    if (!hasData || hasInitializedRef.current) return;

    let nextState: Record<string, any> = {};

    walkAttributes(configAttributes, (_, path) => {
      const value = getValueAtPath(attributes, path, attributeShapeIndex);
      if (value !== undefined) {
        nextState = setValueAtPath(nextState, path, value, attributeShapeIndex);
      }
    });

    walkAttributes(configServices, (_, path) => {
      const value = getValueAtPath(services, path, serviceShapeIndex);
      if (value !== undefined) {
        nextState = setValueAtPath(nextState, path, value, serviceShapeIndex);
      }
    });

    if (Object.keys(nextState).length > 0) {
      setFormData(nextState);
      hasInitializedRef.current = true;
    }
  }, [
    attributes,
    services,
    configAttributes,
    configServices,
    attributeShapeIndex,
    serviceShapeIndex
  ]);

  // 🔥 OPTIMIZACIÓN: Manejar tipo circuito sin causar re-renders
  useEffect(() => {
    const circuitoId = formData.id_tipo_circuito;
    if (circuitoId == null || configServices.length === 0) return;

    const relacion = RELACIONES_TIPO_CIRCUITO.find(
      (r) => r.id === parseInt(circuitoId)
    );

    setFilteredConfigServices((prev) => {
      const newFiltered = relacion
        ? configServices.filter((service) =>
            relacion.servicios_asociados.some((s) => s.name === service.name)
          )
        : [];

      // Solo actualizar si cambió
      if (JSON.stringify(prev) === JSON.stringify(newFiltered)) return prev;
      return newFiltered;
    });
  }, [formData.id_tipo_circuito, configServices]);

  // 🔥 FIX CRÍTICO: Sincronizar con parent SOLO cuando formData cambia significativamente
  const lastEmittedRef = useRef<string>('');

  useEffect(() => {
    if (!hasInitializedRef.current) return;

    const attributeKeys = configAttributes.map((item) => item.name);
    const serviceKeys = configServices.map((item) => item.name);

    const newAttributes: Record<string, any> = {};
    const newServices: Record<string, any> = {};

    for (const key in formData) {
      if (attributeKeys.includes(key)) {
        newAttributes[key] = formData[key];
      } else if (serviceKeys.includes(key)) {
        newServices[key] = formData[key];
      }
    }

    // 🔥 PREVENIR LOOPS: Solo emitir si realmente cambió
    const newSignature = JSON.stringify({ newAttributes, newServices });
    if (newSignature === lastEmittedRef.current) return;

    lastEmittedRef.current = newSignature;

    if (Object.keys(newAttributes).length > 0) {
      setAttributes(newAttributes);
    }
    if (Object.keys(newServices).length > 0) {
      setServices(newServices);
    }
  }, [formData, configAttributes, configServices]);

  // 🔥 OPTIMIZACIÓN: Resolver valores async SOLO UNA VEZ
  useEffect(() => {
    if (
      isResolvingAsyncRef.current ||
      !tipoComponente ||
      !hasInitializedRef.current
    )
      return;

    isResolvingAsyncRef.current = true;
    let mounted = true;

    const entries: Array<{ attr: ConfigDataAttribute; path: string }> = [];
    walkAttributes(configAttributes, (attr, path) =>
      entries.push({ attr, path })
    );
    walkAttributes(configServices, (attr, path) =>
      entries.push({ attr, path })
    );

    const resolveInitialAsyncValues = async () => {
      const out: Record<string, { label: string; value: string }> = {};

      await Promise.all(
        entries.map(async ({ attr, path }) => {
          if (
            !attr.valores_posibles_source ||
            !isPaginatedSource(attr.valores_posibles_source) ||
            !attr.valores_posibles_response ||
            attr.valores_posibles_response.length < 2
          ) {
            return;
          }

          const shape = pickShapeIndex(path);
          const root = path.split('#')[0];
          const baseData = serviceRootNames.has(root) ? services : attributes;
          const fieldValue = getValueAtPath(baseData, path, shape);

          if (!fieldValue) return;

          try {
            const [labelKey, valueKey] = attr.valores_posibles_response;
            let data;

            if (valueKey.toLowerCase() === 'id') {
              const baseUrl = attr.valores_posibles_source.split('?')[0];
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
              out[path] = {
                label: String(data[labelKey]),
                value: String(data[valueKey])
              };
            }
          } catch (error) {
            console.warn(`Error resolving async value for ${path}:`, error);
          }
        })
      );

      if (mounted) {
        setResolvedAsyncValues(out);
      }
    };

    resolveInitialAsyncValues();

    return () => {
      mounted = false;
    };
  }, [tipoComponente?.id]);

  // ========== RENDER ==========
  const renderNode = useCallback(
    (
      items: ConfigDataAttribute[],
      prefix = '',
      heading = 'Atributos principales'
    ) => {
      const leaves = items.filter(
        (attr) => attr.type !== 'array' && attr.html_form_type
      );
      const grouped = groupByGroup(leaves);
      const groupNames = sortGroupNames(Object.keys(grouped));
      const arrays = items.filter(
        (attr) =>
          attr.type === 'array' &&
          Array.isArray(attr.atribs_config) &&
          attr.atribs_config.length > 0
      );

      return (
        <div className="flex flex-col gap-6">
          {leaves.length > 0 && (
            <div>
              <h4>{heading}</h4>
              {groupNames.map((gName) => {
                const entries = grouped[gName] ?? [];
                return (
                  <section
                    key={`${prefix || 'root'}-${gName}`}
                    className="mt-3"
                  >
                    <h5 className="text-[16px] font-medium mb-2">{gName}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
                      {entries.map((attr) => {
                        const fieldPath = prefix
                          ? `${prefix}#${attr.name}`
                          : attr.name;
                        const isPaginated = isPaginatedSource(
                          attr.valores_posibles_source
                        );
                        const loader = isPaginated
                          ? getLoader(
                              attr.valores_posibles_source,
                              attr.valores_posibles_response
                            )
                          : undefined;
                        const shape = pickShapeIndex(fieldPath);
                        const storedValue = getValueAtPath(
                          formData,
                          fieldPath,
                          shape
                        );
                        const value =
                          isPaginated && resolvedAsyncValues[fieldPath]
                            ? resolvedAsyncValues[fieldPath]
                            : storedValue;

                        return (
                          <InputDynamic
                            key={fieldPath}
                            name={fieldPath}
                            label={attr.label}
                            value={value}
                            type={attr.type}
                            required={attr.required}
                            html_form_type={attr.html_form_type}
                            selectOptions={
                              dynamicOptions[fieldPath] ||
                              attr.valores_posibles?.map((i) => ({
                                text: i.name?.toString(),
                                value: i.value?.toString()
                              }))
                            }
                            isCreate={attr.is_create}
                            networkId={networkId}
                            regionId={regionId}
                            stationId={stationId}
                            onChange={onChange}
                            isPaginated={isPaginated}
                            loadPaginatedOptions={loader}
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
          {arrays.map((attr) => {
            const nextPrefix = prefix ? `${prefix}#${attr.name}` : attr.name;
            return (
              <div key={nextPrefix} className="mt-4">
                {renderNode(
                  attr.atribs_config ?? [],
                  nextPrefix,
                  `${attr.label} (Atributos secundarios)`
                )}
              </div>
            );
          })}
        </div>
      );
    },
    [
      formData,
      dynamicOptions,
      resolvedAsyncValues,
      getLoader,
      pickShapeIndex,
      onChange,
      networkId,
      regionId,
      stationId
    ]
  );

  const tabsData = useMemo(() => {
    const tabs = [];
    if (configAttributes?.length > 0) {
      tabs.push({
        title: 'Atributos',
        content: () => renderNode(configAttributes)
      });
    }
    if (configServices?.length > 0) {
      tabs.push({
        title: 'Servicios',
        content: () =>
          renderNode(
            filteredConfigServices.length > 0
              ? filteredConfigServices
              : configServices
          )
      });
    }
    return tabs;
  }, [configAttributes, configServices, filteredConfigServices, renderNode]);

  const Header = useCallback(
    () => (
      <hgroup style={{ marginBottom: '20px' }}>
        <h4 className="text-[20px]" style={{ marginBottom: '10px' }}>
          Configuración adicional
        </h4>
        {configAttributes?.length === 0 && configServices?.length === 0 ? (
          <span>No posee configuración</span>
        ) : (
          <p>
            Esta configuración es dinámica, por lo cual cambia según el criterio
            del administrador. Si desea modificarlo, haga clic en{' '}
            <Link
              href="/mantenedor-tipo-componente"
              className="text-[#0066FF] flex items-center gap-1"
            >
              Editar tipo componente {tipoComponente?.name}
              <Icon icon="edit" style={{ fontSize: '20px' }} />
            </Link>
          </p>
        )}
      </hgroup>
    ),
    [configAttributes, configServices, tipoComponente?.name]
  );

  if (!configAttributes?.length && !configServices?.length) {
    return (
      <div className="col-span-full">
        <Header />
      </div>
    );
  }

  return (
    <BlockUI blocked={disabled} className="col-span-full">
      <TabStrip
        selected={selectedTab}
        onSelect={({ selected }) => setSelectedTab(selected)}
        header={<Header />}
      >
        {tabsData.map((tab, index) => (
          <TabStripTab key={index} title={tab.title}>
            {tab.content()}
          </TabStripTab>
        ))}
      </TabStrip>
    </BlockUI>
  );
}
