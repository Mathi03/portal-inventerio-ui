import { useMemo, useRef, useState } from "react";
import {
  TextField,
  Select,
  DateField,
  IntegerField,
} from "@telefonica/mistica";
import CreateForm from "@/app/crear-componente-red/CreateForm";
import { AsyncPaginate } from "react-select-async-paginate";
import SelectField from "@/components/SelectField";
import Modal from "@/components/Modal";

interface InputDynamicProps {
  name: string;
  label: string;
  required?: boolean;
  html_form_type: "input" | "select" | "date" | "multiple";
  type?: "string" | "number";
  value?: string | { label: string; value: string };
  onChange: (name: string, value: string) => void;
  isCreate?: boolean;
  selectOptions?: Array<{
    text: string;
    value: string;
  }>;
  loading?: boolean;
  networkId: number | null;
  regionId: number | null;
  stationId: number | null;
  isPaginated?: boolean;
  loadPaginatedOptions?: (
    search: string,
    loadedOptions: any,
    meta: any
  ) => Promise<any>;
}

export default function InputDynamic({
  name,
  label,
  required = true,
  html_form_type,
  value = "",
  type = "string",
  onChange,
  isCreate,
  selectOptions = [],
  loading = false,
  networkId,
  regionId,
  stationId,
  isPaginated,
  loadPaginatedOptions,
}: InputDynamicProps) {
  const [openForm, setOpenForm] = useState(false);
  const [internalAsyncValue, setInternalAsyncValue] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const isInitial = useRef(true);

  const renderButton = () => (
    <button
      className="px-6 py-3 bg-blue-600 text-white rounded-full"
      onClick={(e) => {
        e.preventDefault();
        setOpenForm(true);
      }}
    >
      Crear
    </button>
  );

  const renderSelect = () => {
    if (isPaginated && loadPaginatedOptions) {
      const selectedValue =
        typeof value === "object" && value !== null && isInitial.current
          ? value
          : internalAsyncValue;

      return (
        <AsyncPaginate
          className="h-[60px] group_field_paginated"
          classNamePrefix={"field_paginated"}
          debounceTimeout={1000}
          value={selectedValue}
          loadOptions={loadPaginatedOptions}
          onChange={(option) => {
            if (isInitial.current) isInitial.current = false;
            const selected = option || { label: "", value: "" };
            setInternalAsyncValue(selected);
            onChange(name, selected.value);
          }}
          additional={{ page: 1 }}
          placeholder={label}
          isClearable
          required={required}
        />
      );
    }

    return (
      <Select
        name={name}
        label={label}
        optional={!required}
        value={value?.toString() ?? ""}
        onChangeValue={(val) => onChange(name, val)}
        disabled={loading}
        helperText={loading ? `Cargando ${label}...` : undefined}
        options={selectOptions}
        fullWidth
      />
    );
  };

  const renderMultiple = () => {
    return (
      <SelectField
        name={name}
        label={label}
        options={selectOptions}
        value={value}
        onChangeValue={(val) => onChange(name, val)}
        placeholder={`Seleccione ${label}`}
        helperText={loading ? `Cargando ${label}...` : undefined}
        isMultiple
        className="w-full"
      />
    );
  };

  const renderInput = () => {
    if (type === "number")
      return (
        <IntegerField
          name={name}
          optional={!required}
          label={label}
          value={value?.toString() ?? ""}
          fullWidth
          maxLength={255}
          onChange={(e) => {
            const val = e.target.value;
            onChange(name, val);
          }}
        />
      );
    return (
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
  };

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
      case "multiple":
        return renderMultiple();
      default:
        return <div>Error: tipo no soportado</div>;
    }
  }, [html_form_type, loading, selectOptions, value]);

  if (isCreate) {
    return (
      <div className="flex gap-2 items-start">
        {field}
        {renderButton()}
        <Modal open={openForm} onClose={() => setOpenForm(false)}>
          <CreateForm
            mode="popup"
            networkId={networkId}
            regionId={regionId}
            stationId={stationId}
          />
        </Modal>
      </div>
    );
  }

  return field;
}
