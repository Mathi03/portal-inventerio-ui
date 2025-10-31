import { useMemo, useRef, useState } from "react";
import {
  TextField,
  Select,
  DateField,
  IntegerField,
} from "@telefonica/mistica";
import { AsyncPaginate } from "react-select-async-paginate";
import SelectField from "@/components/SelectField";
import Modal from "@/components/Modal";
import CreateForm from ".";
import IconButton from "../IconButton";

interface InputDynamicProps {
  name: string;
  label: string;
  required?: boolean;
  html_form_type: "input" | "select" | "date" | "multiple" | "textarea";
  type?: "number" | "string" | "array" | "date" | "boolean" | "master";
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

  const sortedSelectOptions = useMemo(() => {
    return [...selectOptions].sort((a, b) =>
      a.text.localeCompare(b.text, "es", { sensitivity: "base" })
    );
  }, [selectOptions]);

  const renderButton = () => (
    <IconButton
      onClick={() => {
        setOpenForm(true);
      }}
      className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-2xl"
      icon="add"
      buttonHeight="h-10"
      buttonWidth="w-10"
    />
  );

  const renderSelect = () => {
    if (isPaginated && loadPaginatedOptions) {
      const selectedValue =
        typeof value === "object" && value !== null && isInitial.current
          ? value
          : internalAsyncValue;

      return (
        <div className="relative w-full">
          {selectedValue && (
            <div className="absolute top-2 z-[1] left-3 text-sm text-gray-500 w-5/6 truncate">
              {label} {!required && "(opcional)"}
            </div>
          )}
          <AsyncPaginate
            className={`h-[60px] group_field_paginated ${
              selectedValue ? "has-value" : ""
            }`}
            classNamePrefix={"field_paginated"}
            debounceTimeout={1000}
            value={selectedValue}
            loadOptions={loadPaginatedOptions}
            onChange={(option) => {
              if (isInitial.current) isInitial.current = false;
              const selected = option === null ? null : option;
              setInternalAsyncValue(selected);
              onChange(name, selected === null ? "" : selected.value);
            }}
            additional={{ page: 1 }}
            placeholder={`${label} ${!required && "(opcional)"}`}
            isClearable
            required={required}
          />
        </div>
      );
    }

    return (
      <Select
        name={name}
        label={label}
        optional={!required}
        value={(value ?? "").toString()}
        onChangeValue={(val) => onChange(name, val)}
        disabled={loading}
        helperText={loading ? `Cargando ${label}...` : undefined}
        options={sortedSelectOptions}
        fullWidth
      />
    );
  };

  const renderMultiple = () => {
    return (
      <SelectField
        name={name}
        label={label}
        options={sortedSelectOptions}
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
          value={(value ?? "").toString()}
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
        value={(value ?? "").toString()}
        fullWidth
        maxLength={255}
        onChange={(e) => {
          const val = e.target.value;
          onChange(name, val);
        }}
      />
    );
  };

  const renderTextArea = () => (
    <div className="col-span-3">
      <TextField
        name={name}
        optional={!required}
        label={label}
        value={value?.toString()}
        fullWidth
        multiline
        onChange={(val) => {
          onChange(name, val?.target?.value ?? "");
        }}
      />
    </div>
  );

  const renderDate = () => (
    <DateField
      name={name}
      optional={!required}
      label={label}
      value={value ? value?.toString() : ""}
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
      case "textarea":
        return renderTextArea();
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
