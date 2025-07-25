import Icon from "@/components/Icon";
import InputDynamic from "@/components/InputDynamic";
import {
  bff,
  cnr,
  contacto,
  estaciones,
  msDirecciones,
  source,
} from "@/core/config";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Box, Tabs } from "@telefonica/mistica";
import { AxiosInstance } from "axios";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

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

interface NestedAttributes {
  [key: string]: string;
}

interface AttributesState {
  [key: string]: string | NestedAttributes;
}

interface NestedServices {
  [key: string]: string;
}

interface ServicesState {
  [key: string]: string | NestedServices;
}

// interface ConfigAdicionalProps {
//   tabIndex: number;
//   className?: string;
//   tipoComponente: TipoComponenteType;
//   // ✨ ADDED: attribute prop
//   attribute: AttributesState; // The 'attribute' state received from the parent
//   service: ServicesState; // The 'attribute' state received from the parent
//   // onAttributes unificada: ahora puede recibir parentName
//   onAttributes: (name: string, value: any, parentName?: string | null) => void;
//   onServices: (name: string, value: any, parentName?: string | null) => void;
// }

export default function ConfigAdicional({
  tipoComponente,
  onAttributes,
  onServices,
  className,
  attribute,
  service,
}: {
  tipoComponente?: TipoComponenteType | null;
  onAttributes?: (name: string, value: any, parentName?: string | null) => void;
  onServices?: (name: string, value: any, parentName?: string | null) => void;
  className?: string;
  attribute: AttributesState;
  service: ServicesState;
}) {
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<
      string,
      { loading: boolean; options: { text: string; value: string }[] }
    >
  >({});
  const [initialPreloaded, setInitialPreloaded] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!tipoComponente || !attribute) return;

    const allAttrs =
      tipoComponente.configData.flatMap((c) => c.configAttributes) || [];

    for (const attr of allAttrs) {
      const value = attribute[attr.name];
      if (!value || !attr.on_change) continue;

      const {
        target_name,
        valores_posibles_source,
        valores_posibles_response,
      } = attr.on_change;

      if (attribute[target_name] && !initialPreloaded.has(target_name)) {
        const url = valores_posibles_source
          .replace("@value", value as string)
          .replace("@name", attr.name);

        const axiosClient = getAxiosClientFromUrl(url);

        setDynamicOptions((prev) => ({
          ...prev,
          [target_name]: { loading: true, options: [] },
        }));

        axiosClient
          .get(url)
          .then((res) => {
            const [labelField, idField] = valores_posibles_response || [
              "label",
              "id",
            ];
            const options = res.data.data.data.map((item: any) => ({
              text: item[labelField],
              value: String(item[idField]),
            }));

            setDynamicOptions((prev) => ({
              ...prev,
              [target_name]: { loading: false, options },
            }));

            // Marcar como precargado
            setInitialPreloaded((prev) => new Set(prev).add(target_name));
          })
          .catch((err) => {
            console.error("Error cargando on_change inicial:", err);
            setDynamicOptions((prev) => ({
              ...prev,
              [target_name]: { loading: false, options: [] },
            }));
          });
      }
    }
  }, [tipoComponente, attribute, initialPreloaded]);

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const handleAttributeChange = async (
    name: string,
    value: any,
    parentName: string | null = null
  ) => {
    // 1. Propagar el cambio al estado original
    onAttributes?.(name, value, parentName);

    // 2. Buscar el atributo actual en tipoComponente.configData
    const allAttributes =
      tipoComponente?.configData.flatMap((c) => c.configAttributes) || [];
    const changedAttr = allAttributes.find((attr) => attr.name === name);
    if (!changedAttr?.on_change) return;

    const { target_name, valores_posibles_source, valores_posibles_response } =
      changedAttr.on_change;

    // 3. Reemplazar decoradores
    const url = valores_posibles_source
      .replace("@value", value)
      .replace("@name", name);

    // 4. Cargar nuevos datos
    setDynamicOptions((prev) => ({
      ...prev,
      [target_name]: { loading: true, options: [] },
    }));

    try {
      const axiosClient = getAxiosClientFromUrl(url);
      const { data } = await axiosClient.get(url);

      const [labelField, idField] = valores_posibles_response || [
        "label",
        "id",
      ];
      const options = data.data.data.map((item: any) => ({
        text: item[labelField],
        value: String(item[idField]),
      }));

      setDynamicOptions((prev) => ({
        ...prev,
        [target_name]: { loading: false, options },
      }));
    } catch (error) {
      console.error("Error cargando opciones dinámicas:", error);
      setDynamicOptions((prev) => ({
        ...prev,
        [target_name]: { loading: false, options: [] },
      }));
    }
  };

  if (tipoComponente)
    return (
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
        }}
        className={className}
      >
        <hr className={className} style={{ marginBottom: "20px" }} />
        <hgroup className={className} style={{ marginBottom: "20px" }}>
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
              Editar tipo componente {tipoComponente.name}
              <Icon icon="edit" style={{ fontSize: "20px" }} />
            </Link>
          </p>
        </hgroup>

        <div style={{ width: "100%", marginBottom: "20px" }}>
          <Box>
            <Tabs
              selectedIndex={tabIndex}
              onChange={handleTabChange}
              tabs={[{ text: "Atributos" }, { text: "Servicios" }]}
            />
          </Box>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          {tabIndex === 0 && (
            <div>
              <div>
                <h4
                  className={`text-[16px] font-semibold ${className}`}
                  style={{ marginBottom: "15px" }}
                >
                  Atributos
                </h4>
                {tipoComponente.configData.map((configData, configDataKey) => {
                  // Aquí se agrega el console.log para el primer map
                  // Separar atributos regulares de atributos con atribs_config
                  const regularAttributes = configData.configAttributes.filter(
                    (attr) => !attr.atribs_config
                  );
                  const nestedConfigAttributes =
                    configData.configAttributes.filter(
                      (attr) => attr.atribs_config
                    );
                  return (
                    <div key={configDataKey} style={{ marginBottom: "15px" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "20px",
                        }}
                      >
                        {/* Renderizar atributos regulares primero */}
                        {regularAttributes.map((attributeConfig, attrKey) => (
                          <div key={attrKey}>
                            <InputDynamic
                              {...attributeConfig}
                              value={
                                attribute &&
                                typeof attribute[attributeConfig.name] ===
                                  "string"
                                  ? (attribute[attributeConfig.name] as string)
                                  : ""
                              }
                              onChange={handleAttributeChange}
                              loading={
                                dynamicOptions[attributeConfig.name]?.loading
                              }
                              dynamicOptions={
                                dynamicOptions[attributeConfig.name]?.options
                              }
                            />
                          </div>
                        ))}

                        {/* Renderizar atributos con atribs_config al final */}
                        {/* Renderizar atributos con atribs_config */}
                        {nestedConfigAttributes.map(
                          (parentAttributeConfig, parentAttrKey) => (
                            <Fragment key={`nested-${parentAttrKey}`}>
                              <div
                                style={{
                                  gridColumn: "1 / -1",
                                  marginBottom: "10px",
                                }}
                              >
                                <h5
                                  className={`text-[15px] font-semibold ${className}`}
                                >
                                  {parentAttributeConfig.label ||
                                    parentAttributeConfig.name}
                                </h5>
                              </div>
                              {parentAttributeConfig.atribs_config?.map(
                                (nestedAttributeConfig, nestedAttrKey) => (
                                  <div key={nestedAttrKey}>
                                    <InputDynamic
                                      {...nestedAttributeConfig}
                                      value={
                                        attribute &&
                                        typeof attribute[
                                          parentAttributeConfig.name
                                        ] === "object" &&
                                        attribute[
                                          parentAttributeConfig.name
                                        ] !== null &&
                                        (
                                          attribute[
                                            parentAttributeConfig.name
                                          ] as NestedAttributes
                                        )[nestedAttributeConfig.name]
                                          ? (
                                              attribute[
                                                parentAttributeConfig.name
                                              ] as NestedAttributes
                                            )[nestedAttributeConfig.name]
                                          : ""
                                      }
                                      onChange={(name, value) =>
                                        onAttributes &&
                                        onAttributes(
                                          name,
                                          value,
                                          parentAttributeConfig.name
                                        )
                                      }
                                    />
                                  </div>
                                )
                              )}
                            </Fragment>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tabIndex === 1 && (
            <div>
              <div>
                <h4
                  className={`text-[16px] font-semibold ${className}`}
                  style={{ marginBottom: "15px" }}
                >
                  Servicios
                </h4>
                {tipoComponente.configData.map((configData, configDataKey) => {
                  // Aquí se agrega el console.log para el primer map
                  // Separar atributos regulares de atributos con atribs_config
                  const regularServices = configData.configServices.filter(
                    (attr) => !attr.atribs_config
                  );
                  const nestedConfigServices = configData.configServices.filter(
                    (attr) => attr.atribs_config
                  );
                  return (
                    <div
                      key={configDataKey + "guille"}
                      style={{ marginBottom: "15px" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "20px",
                        }}
                      >
                        {/* Renderizar atributos regulares primero */}
                        {regularServices.map((serviceConfig, attrKey) => (
                          <div key={attrKey + "guille"}>
                            <InputDynamic
                              {...serviceConfig}
                              value={
                                service &&
                                typeof service[serviceConfig.name] === "string"
                                  ? (service[serviceConfig.name] as string)
                                  : ""
                              }
                              onChange={(name, value) =>
                                onServices && onServices(name, value)
                              }
                            />
                          </div>
                        ))}

                        {/* Renderizar atributos con atribs_config al final */}
                        {/* Renderizar atributos con atribs_config */}
                        {nestedConfigServices.map(
                          (parentServiceConfig, parentAttrKey) => (
                            <Fragment key={`nested-${parentAttrKey}`}>
                              <div
                                style={{
                                  gridColumn: "1 / -1",
                                  marginBottom: "10px",
                                }}
                              >
                                <h5
                                  className={`text-[15px] font-semibold ${className}`}
                                >
                                  {parentServiceConfig.label ||
                                    parentServiceConfig.name}
                                </h5>
                              </div>
                              {parentServiceConfig.atribs_config?.map(
                                (nestedServiceConfig, nestedAttrKey) => (
                                  <div key={nestedAttrKey + "guille"}>
                                    <InputDynamic
                                      {...nestedServiceConfig}
                                      value={
                                        service &&
                                        typeof service[
                                          parentServiceConfig.name
                                        ] === "object" &&
                                        service[parentServiceConfig.name] !==
                                          null &&
                                        (
                                          service[
                                            parentServiceConfig.name
                                          ] as NestedServices
                                        )[nestedServiceConfig.name]
                                          ? (
                                              service[
                                                parentServiceConfig.name
                                              ] as NestedServices
                                            )[nestedServiceConfig.name]
                                          : ""
                                      }
                                      onChange={(name, value) =>
                                        onServices &&
                                        onServices(
                                          name,
                                          value,
                                          parentServiceConfig.name
                                        )
                                      }
                                    />
                                  </div>
                                )
                              )}
                            </Fragment>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
