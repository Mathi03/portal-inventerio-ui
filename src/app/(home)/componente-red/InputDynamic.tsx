import { useState, useEffect, useMemo } from "react";
import { TextField, Select, DateField } from "@telefonica/mistica";
import { useModalStore } from "@/hooks/modalStorage";
import CreateForm from "@/app/crear-componente-red/CreateForm";

interface InputDynamicProps {
  name: string;
  label: string;
  required?: boolean;
  html_form_type: "input" | "select" | "date";
  value?: string;
  onChange: (name: string, value: string) => void;
  isCreate?: boolean;
  selectOptions?: Array<{
    text: string;
    value: string;
  }>;
  loading?: boolean;
  networkId?: number;
  componentTypeId?: number;
}

export default function InputDynamic({
  name,
  label,
  required = true,
  html_form_type,
  value = "",
  onChange,
  isCreate,
  selectOptions = [],
  loading = false,
  networkId,
  componentTypeId,
}: InputDynamicProps) {
  const { openModal } = useModalStore();

  const renderButton = () => (
    <button
      className="px-6 py-3 bg-blue-600 text-white rounded-full"
      onClick={(e) => {
        e.preventDefault();
        openModal(
          <CreateForm
            isModal
            networkId={networkId}
            componentTypeId={componentTypeId}
          />
        );
      }}
    >
      Crear
    </button>
  );

  const renderSelect = () => (
    <Select
      name={name}
      label={label}
      optional={!required}
      value={value?.toString()}
      onChangeValue={(val) => {
        onChange(name, val);
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
      value={value}
      fullWidth
      maxLength={255}
      onChange={(e) => {
        const val = e.target.value;
        onChange(name, val);
      }}
    />
  );

  const renderDate = () => (
    <DateField
      name={name}
      optional={!required}
      label={label}
      value={value}
      fullWidth
      onChange={(val) => {
        onChange(name, val?.target?.value ?? "");
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
        return <div>Error: tipo no soportado</div>;
    }
  }, [html_form_type, loading, selectOptions]);

  if (isCreate) {
    return (
      <div className="flex gap-2 items-start">
        {field}
        {renderButton()}
      </div>
    );
  }

  return field;
}
