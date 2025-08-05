import { useState, useEffect, useMemo } from "react";
import { TextField, Select, DateField } from "@telefonica/mistica";
import { useModalStore } from "@/hooks/modalStorage";
import CreateForm from "@/app/crear-componente-red/CreateForm";

interface InputDynamicProps {
  name: string;
  label: string;
  required?: boolean;
  html_form_type: "input" | "select" | "date";
  value: string;
  onChange: (name: string, value: string) => void;
  is_create?: boolean;
  selectOptions?: { value: string; text: string }[];
  loading?: boolean;
  networkId?: number;
  componentTypeId?: number;
}

export default function InputDynamic({
  name,
  label,
  required = true,
  html_form_type,
  value,
  onChange,
  is_create,
  selectOptions = [],
  loading = false,
  networkId,
  componentTypeId,
}: InputDynamicProps) {
  const { openModal } = useModalStore();
  const [valueController, setValueController] = useState(value);

  useEffect(() => {
    setValueController(value);
  }, [value]);

  const renderButton = () => (
    <button className="px-6 py-3 bg-blue-500 text-white rounded-full"
      onClick={(e) =>
      {
        e.preventDefault();
        openModal(
          <CreateForm
            isModal
            networkId={networkId}
            componentTypeId={componentTypeId}
          />
        )
      }
      }
    >
      Crear
    </button>
  );

  const renderSelect = () => (
    <Select
      name={name}
      label={label}
      optional={!required}
      value={valueController}
      onChangeValue={(val) => {
        onChange(name, val);
        setValueController(val);
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
      value={valueController}
      fullWidth
      maxLength={255}
      onChange={(e) => {
        const val = e.target.value;
        onChange(name, val);
        setValueController(val);
      }}
    />
  );

  const renderDate = () => (
    <DateField
      name={name}
      optional={!required}
      label={label}
      value={valueController}
      fullWidth
      onChange={(val) => {
        onChange(name, val);
        setValueController(val);
      }}
    />
  );

  const field = useMemo(() => {
    switch (html_form_type) {
      case "select":
        return renderSelect();
      case "input":
        return renderInput();
      case "date":
        return renderDate();
      default:
        throw new Error(`html_form_type inválido: ${html_form_type}`);
    }
  }, [html_form_type, valueController, loading, selectOptions]);

  if (is_create) {
    return (
      <div className="flex gap-2 items-start">
        {field}
        {renderButton()}
      </div>
    );
  }

  return field;
}
