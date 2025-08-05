import { useState } from "react";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import TabStrip from "@/components/TabStrip";
import TabStripTab from "@/components/TabStripTab";
import InputDynamic from "./InputDynamic";
import Link from "next/link";
import Icon from "@/components/Icon";

interface InputField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  default: boolean;
  place_holder?: string;
  html_form_type?: "input" | "select" | "date";
  is_create?: boolean;
  valores_posibles?: { name: string; value: string | number }[];
  atribs_config?: InputField[];
}

interface ConfigItem {
  id: number;
  componentTypeId: number;
  networkId: number;
  status: number;
  configAttributes: InputField[];
  configServices: InputField[];
}

interface ConfigDataProps {
  tipoComponente: TipoComponenteType | null;
}

export default function ConfigData({ tipoComponente }: ConfigDataProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const configItem: ConfigItem | undefined = tipoComponente?.configData?.[0];

  if (!configItem) return null;

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const renderFields = (fields: InputField[]) => {
    const mainFields = fields.filter((f) => !f.atribs_config);
    const nestedFields = fields
      .filter((f) => f.atribs_config)
      .flatMap((f) => f.atribs_config || []);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {mainFields.map((field) => (
            <InputDynamic
              key={field.name}
              name={field.name}
              label={field.label}
              required={field.required}
              html_form_type={field.html_form_type ?? "input"}
              value={formValues[field.name] ?? ""}
              onChange={handleChange}
              is_create={true}
              selectOptions={field.valores_posibles?.map((opt) => ({
                value: String(opt.value),
                text: opt.name,
              }))}
              networkId={configItem.networkId}
              componentTypeId={configItem.componentTypeId}
            />
          ))}
        </div>

        {nestedFields.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Configuración adicional
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nestedFields.map((field) => (
                <InputDynamic
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  required={field.required}
                  html_form_type={field.html_form_type ?? "input"}
                  value={formValues[field.name] ?? ""}
                  onChange={handleChange}
                  is_create={field.is_create}
                  selectOptions={field.valores_posibles?.map((opt) => ({
                    value: String(opt.value),
                    text: opt.name,
                  }))}
                  networkId={configItem.networkId}
                  componentTypeId={configItem.componentTypeId}
                />
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  const tabsData = [
    {
      title: "Atributos",
      content: () => renderFields(configItem.configAttributes),
    },
    {
      title: "Servicios",
      content: () => renderFields(configItem.configServices),
    },
  ];

  return (
    <TabStrip
      selected={selectedTab}
      onSelect={({ selected }) => setSelectedTab(selected)}
      className="col-span-full"
      header={(
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
      )}
    >
      {tabsData.map((tab, index) => (
        <TabStripTab key={index} title={tab.title}>
          {tab.content()}
        </TabStripTab>
      ))}
    </TabStrip>
  );
}
