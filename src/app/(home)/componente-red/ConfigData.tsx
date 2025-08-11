import { useEffect, useState } from "react";
import {
  ConfigDataAttribute,
  TipoComponenteType,
} from "@/core/tipo-componente/tipo-componente.type";
import TabStrip from "@/components/TabStrip";
import TabStripTab from "@/components/TabStripTab";
import InputDynamic from "./InputDynamic";
import Link from "next/link";
import Icon from "@/components/Icon";
import { AxiosInstance } from "axios";
import {
  bff,
  cnr,
  contacto,
  estaciones,
  msDirecciones,
  source,
} from "@/core/config";
import { RELACIONES_TIPO_CIRCUITO } from "@/core/config/relacionesServicios";

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

interface ConfigDataProps {
  tipoComponente: TipoComponenteType | null;
  setAttributes: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  setServices: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  attributes: { [key: string]: any };
  services: { [key: string]: any };
  networkId: number | null;
  regionId: number | null;
  stationId: number | null;
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
}: ConfigDataProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );

  const [filteredConfigServices, setFilteredConfigServices] = useState<
    ConfigDataAttribute[]
  >([]);

  const configDataItem = tipoComponente ? tipoComponente.configData?.[0] : null;
  const configAttributes = configDataItem?.configAttributes ?? [];
  const configServices = configDataItem?.configServices ?? [];

  const fetchOptions = async (
    url: string,
    responseFields?: string[],
    searchQuery = ""
  ): Promise<{ text: string; value: string }[]> => {
    try {
      const urlWithSearch =
        responseFields && searchQuery
          ? url.includes("?")
            ? `${url}&q=${searchQuery}`
            : `${url}?q=${searchQuery}`
          : url;

      const client = getAxiosClientFromUrl(urlWithSearch);
      const response = await client.get(urlWithSearch);

      const items: any[] =
        response.data?.items || response.data?.data?.data || response.data;

      const labelKey = responseFields ? responseFields[0] : "name";
      const valueKey = responseFields ? responseFields[1] : "value";

      return items.map((item) => ({
        text: String(item[labelKey]),
        value: String(item[valueKey]),
      }));
    } catch (err) {
      console.error("Error fetching options from", url, err);
      return [];
    }
  };

  const onChange = async (name: string, value: any) => {
    if (name.includes("#")) {
      const [groupKey, fieldKey] = name.split("#");

      setFormData((prev) => {
        // Obtenemos el array actual (o lo inicializamos con un objeto vacío)
        const existingGroup = prev[groupKey] ?? [{}];
        const updatedGroup = { ...existingGroup[0], [fieldKey]: value };
        return { ...prev, [groupKey]: [updatedGroup] };
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

    const options = await fetchOptions(
      attribute.valores_posibles_source,
      attribute.valores_posibles_response
    );

    setDynamicOptions((prev) => ({
      ...prev,
      [`${namePrefix}${attribute.name}`]: options,
    }));
  };

  const loadPaginatedOptions =
    (url: string, responseFields?: string[]) =>
    async (search: string, loadedOptions: any, { page }: any) => {
      const paginatedUrl = `${url}`.replace(/([&?])page=\d+/, "$1page=" + page);
      
      const options = await fetchOptions(paginatedUrl, responseFields, search);
      
      return {
        options: options.map(({ text, value }) => ({ label: text, value })),
        hasMore: options.length === 10, // configurable según API
        additional: { page: page + 1 },
      };
    };

  const prepareInputs = (
    attributes: ConfigDataAttribute[],
    namePrefix = ""
  ) => {
    attributes.forEach((attr) => {
      if (attr.valores_posibles_source) {
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

    setAttributes(newAttributes);
    setServices(newServices);
    console.log("FormData", formData, newAttributes);
    
  }, [formData]);

  const renderInputs = (attributes: ConfigDataAttribute[], namePrefix = "") =>
    attributes
      .filter((attr) => attr.html_form_type)
      .map((attr, idx) => (
        <InputDynamic
          key={`${namePrefix}${attr.name}-${idx}`}
          name={`${namePrefix}${attr.name}`}
          label={attr.label}
          value={
            namePrefix.includes("#")
              ? formData[namePrefix.split("#")[0]]?.[0]?.[attr.name]
              : formData[`${namePrefix}${attr.name}`]
          }
          // type={attr.type}
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
          onChange={onChange}
          isPaginated={
            attr.valores_posibles_source?.includes("limit=") &&
            attr.valores_posibles_source?.includes("page=")
          }
          loadPaginatedOptions={loadPaginatedOptions(
            attr.valores_posibles_source ?? "",
            attr.valores_posibles_response
          )}
        />
      ));

  const renderNestedInputs = (attributes: ConfigDataAttribute[]) => {
    const nested = attributes.filter(
      (a) => a.type === "array" && a.atribs_config
    );
    return nested.map((attr, idx) => (
      <div key={idx}>
        <h4>{attr.label} (Atributos secundarios)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {renderInputs(attr.atribs_config || [], `${attr.name}#`)}
          {/* renderInputs(attr.atribs_config || [], "") */}
        </div>
      </div>
    ));
  };

  const renderTabContent = (items: ConfigDataAttribute[]) => (
    <div className="flex flex-col gap-6">
      <div>
        <h4>Atributos principales</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
          {renderInputs(items.filter((a) => a.type !== "array"))}
        </div>
      </div>
      {renderNestedInputs(items)}
    </div>
  );

  const tabsData = [
    {
      title: "Atributos",
      content: () => renderTabContent(configAttributes),
    },
    {
      title: "Servicios",
      content: () =>
        renderTabContent(
          filteredConfigServices.length > 0
            ? filteredConfigServices
            : configServices
        ),
    },
  ];

  return (
    <TabStrip
      selected={selectedTab}
      onSelect={({ selected }) => setSelectedTab(selected)}
      className="col-span-full"
      header={
        <hgroup className="" style={{ marginBottom: "20px" }}>
          <h4 className="text-[20px]" style={{ marginBottom: "10px" }}>
            Configuración adicional
          </h4>
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
        </hgroup>
      }
    >
      {tabsData.map((tab, index) => (
        <TabStripTab key={index} title={tab.title}>
          {tab.content()}
        </TabStripTab>
      ))}
    </TabStrip>
  );
}
