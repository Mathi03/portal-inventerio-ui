import { DateField, Select, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
import { source } from "@/core/config";
import Button from "./Button";
import { useModalStore } from "@/hooks/modalStorage";
import CreateForm from "@/app/crear-componente-red/CreateForm";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { RedType } from "@/core/red/red.type";

export interface InputDynamicProps {
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  html_form_type: "input" | "select" | "date";
  valores_posibles?: Array<{ name: string; value: string }>;
  valores_posibles_source?: string;
  valores_posibles_response?: ["label", "id"];
  onChange?: (name: string, value: any) => void;
  value?: string | number | boolean | null;
  currentValue?: string;
  loading?: boolean;
  dynamicOptions?: Array<{ text: string; value: string }>;
  isCreate?: boolean;
  tipoComponente?: TipoComponenteType | null;
  red?: RedType | null;
}

export default function InputDynamic(props: InputDynamicProps) {
  const {
    name,
    html_form_type,
    label,
    valores_posibles = [],
    required,
    valores_posibles_source,
    valores_posibles_response = [],
    onChange = () => {},
    currentValue,
    dynamicOptions,
    value,
    isCreate = false,
    red,
    tipoComponente,
  } = props;

  const { openModal } = useModalStore();
  const [valueController, setValueController] = useState(
    value?.toString() ?? ""
  );
  const [loading, setLoading] = useState<boolean>(!!valores_posibles_source);
  const [options, setOptions] = useState<
    Array<{ text: string; value: string }>
  >([]);

  const getData = useCallback(async () => {
    if (!valores_posibles_source) return;
    setLoading(true);
    try {
      const { data } = await source.get(valores_posibles_source);
      const [textKey, valueKey] = valores_posibles_response;
      const mappedOptions = data.data.data.map((item: any) => ({
        text: item[textKey],
        value: String(item[valueKey]),
      }));
      setOptions(mappedOptions);
    } finally {
      setLoading(false);
    }
  }, [valores_posibles_source, valores_posibles_response]);

  useEffect(() => {
    getData();
  }, [getData]);

  const selectOptions =
    dynamicOptions ??
    (valores_posibles_source
      ? options
      : valores_posibles.map(({ name, value }) => ({
          text: name,
          value: value.toString(),
        })));

  const renderButton = () => (
    <div style={{ marginLeft: "8px" }}>
      <Button
        onClick={() =>
          openModal(
            <CreateForm
              isModal
              networkId={red?.id}
              componentTypeId={tipoComponente?.id}
            />
          )
        }
        small
      >
        Crear
      </Button>
    </div>
  );

  const renderSelect = () => (
    <Select
      name={name}
      label={label}
      value={valueController}
      optional={!required}
      onChangeValue={(value) => {
        onChange(name, value);
        setValueController(value);
      }}
      disabled={loading}
      helperText={loading ? `Cargando ${label}...` : undefined}
      options={selectOptions}
      fullWidth
    />
  );

  const renderInput = () => (
    <TextField
      name={name}
      optional={!required}
      label={label}
      fullWidth
      onChange={(e) => onChange(name, e.target.value)}
      value={currentValue}
      maxLength={255}
    />
  );

  const renderDate = () => (
    <DateField
      name={name}
      optional={!required}
      label={label}
      fullWidth
      onChange={(value) => onChange(name, value)}
    />
  );

  const renderFieldWithOptionalButton = (field: JSX.Element) => {
    if (isCreate) {
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          {field}
          {renderButton()}
        </div>
      );
    }
    return field;
  };

  switch (html_form_type) {
    case "select":
      return renderFieldWithOptionalButton(renderSelect());
    case "input":
      return renderFieldWithOptionalButton(renderInput());
    case "date":
      return renderFieldWithOptionalButton(renderDate());
    default:
      throw new Error("html_form_type inválido");
  }
}
