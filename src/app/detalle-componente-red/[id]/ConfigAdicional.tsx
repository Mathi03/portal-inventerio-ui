import Icon from "@/components/Icon";
import InputDynamic from "@/components/InputDynamic";
import Select from "@/components/Select";
import { CRStatusEnumOptions } from "@/core/componente-red/componente-red.type";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Box, IconShowerFilled, Tabs, TextField } from "@telefonica/mistica";
import Link from "next/link";
import { Fragment, useState, useEffect } from 'react';


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


interface ConfigAdicionalProps {
  tabIndex: number;
  className?: string;
  tipoComponente: TipoComponenteType;
  // ✨ ADDED: attribute prop
  attribute: AttributesState; // The 'attribute' state received from the parent
  service: ServicesState; // The 'attribute' state received from the parent
  // onAttributes unificada: ahora puede recibir parentName
  onAttributes: (name: string, value: any, parentName?: string | null) => void;
  onServices: (name: string, value: any, parentName?: string | null) => void;
}


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

  const [activeTab, setActiveTab] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };





  if (tipoComponente)
    return (
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }} className={className}>
        <hr className={className} style={{ marginBottom: '20px' }} />
        <hgroup className={className} style={{ marginBottom: '20px' }}>
          <h4 className="text-[20px]" style={{ marginBottom: '10px' }}>Configuración adicional</h4>
          <p>
            Esta configuración es dinámica, por lo cual cambia según el criterio del administrador. Si desea modificarlo, haga clic en{" "}
            <Link href="/mantenedor-tipo-componente" className="text-[#0066FF] flex items-center gap-1">
              Editar tipo componente {tipoComponente.name}
              <Icon icon="edit" style={{ fontSize: "20px" }} />
            </Link>
          </p>
        </hgroup>

        <div style={{ width: '100%', marginBottom: '20px' }}>
          <Box>
            <Tabs
              selectedIndex={tabIndex}
              onChange={handleTabChange}
              tabs={[
                { text: "Atributos" },
                { text: "Servicios" },
              ]}
            />
          </Box>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>

          {tabIndex === 0 && (
            <div>
              <div>
                <h4 className={`text-[16px] font-semibold ${className}`} style={{ marginBottom: '15px' }}>Atributos</h4>
                {tipoComponente.configData.map((configData, configDataKey) => {
                  // Aquí se agrega el console.log para el primer map
                  // Separar atributos regulares de atributos con atribs_config
                  const regularAttributes = configData.configAttributes.filter(attr => !attr.atribs_config);
                  const nestedConfigAttributes = configData.configAttributes.filter(attr => attr.atribs_config);

                   return (
                    <div key={configDataKey} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {/* Renderizar atributos regulares primero */}
                        {regularAttributes.map((attributeConfig, attrKey) => (
                          <div key={attrKey}>
                            <InputDynamic
                              {...attributeConfig}
                              value={
                                (attribute && typeof attribute[attributeConfig.name] === 'string')
                                  ? (attribute[attributeConfig.name] as string)
                                  : ''
                              }
                              onChange={(name, value) => onAttributes && onAttributes(name, value)}
                            />
                          </div>
                        ))}

                        {/* Renderizar atributos con atribs_config al final */}
                        {/* Renderizar atributos con atribs_config */}


                        {nestedConfigAttributes.map((parentAttributeConfig, parentAttrKey) => (

                          <Fragment key={`nested-${parentAttrKey}`}>
                            {/* ... tu h5 y div ... */}
                            {parentAttributeConfig.atribs_config?.map((nestedAttributeConfig, nestedAttrKey) => {
                              const parentAttributeValue = attribute && typeof attribute[parentAttributeConfig.name] === 'object' && attribute[parentAttributeConfig.name] !== null
                                ? attribute[parentAttributeConfig.name] as any // Usa 'any' si 'NestedAttributes' no está bien tipado aún
                                : {}; // Si no se encuentra el padre, usa un objeto vacío para evitar errores

                              const inputValue = parentAttributeValue[nestedAttributeConfig.name] !== undefined && parentAttributeValue[nestedAttributeConfig.name] !== null
                                ? parentAttributeValue[nestedAttributeConfig.name]
                                : '';

                           

                              return (
                                <div key={nestedAttrKey}>
                                  <InputDynamic
                                    {...nestedAttributeConfig}
                                    value={inputValue} // Aquí se pasa el valor calculado
                                    currentValue={inputValue}
                                    onChange={(name, value) => {
                                      onAttributes && onAttributes(name, value, parentAttributeConfig.name);
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </Fragment>
                        ))}
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
                <h4 className={`text-[16px] font-semibold ${className}`} style={{ marginBottom: '15px' }}>Servicios</h4>
                {tipoComponente.configData.map((configData, configDataKey) => {
                  // Aquí se agrega el console.log para el primer map
                  // Separar atributos regulares de atributos con atribs_config
                  const regularServices = configData.configServices.filter(attr => !attr.atribs_config);
                  const nestedConfigServices = configData.configServices.filter(attr => attr.atribs_config);
                  return (
                    <div key={configDataKey } style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {/* Renderizar atributos regulares primero */}
                        {regularServices.map((serviceConfig, attrKey) => (
                          <div key={attrKey }>
                            <InputDynamic
                              {...serviceConfig}
                              value={
                                (service && typeof service[serviceConfig.name] === 'string')
                                  ? (service[serviceConfig.name] as string)
                                  : ''
                              }
                              onChange={(name, value) => onServices && onServices(name, value)}
                            />
                          </div>
                        ))}

                        {/* Renderizar atributos con atribs_config al final */}
                        {/* Renderizar atributos con atribs_config */}
                        {nestedConfigServices.map((parentServiceConfig, parentServKey) => (
                            <Fragment key={`nested-${parentServKey}`}>
                            {/* ... tu h5 y div ... */}
                            <div style={{ gridColumn: '1 / -1', marginBottom: '10px' }}>
                              <h5 className={`text-[15px] font-semibold ${className}`}>
                                {parentServiceConfig.label || parentServiceConfig.name}
                              </h5>
                            </div>
                            {parentServiceConfig.atribs_config?.map((nestedServiceConfig, nestedServKey) => {
                              const parentServiceValue = service && typeof service[parentServiceConfig.name] === 'object' && service[parentServiceConfig.name] !== null
                                ? service[parentServiceConfig.name] as any // Usa 'any' si 'NestedAttributes' no está bien tipado aún
                                : {}; // Si no se encuentra el padre, usa un objeto vacío para evitar errores

                              /*const inputValue = parentServiceValue[nestedServiceConfig.name] !== undefined && parentServiceValue[nestedServiceConfig.name] !== null
                                ? parentServiceValue[nestedServiceConfig.name]
                                : '';*/

                              const inputValue = parentServiceValue?.[nestedServiceConfig.name] ?? '';

                              console.groupEnd(); // Cierra el grupo de logs para este input

                              return (
                                <div key={nestedServKey}>
                                  <InputDynamic
                                    {...nestedServiceConfig}
                                    value={inputValue} // Aquí se pasa el valor calculado
                                    currentValue={inputValue}
                                    onChange={(name, value) => {
                                      onServices && onServices(name, value, parentServiceConfig.name);
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </Fragment>
   
                        ))}
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