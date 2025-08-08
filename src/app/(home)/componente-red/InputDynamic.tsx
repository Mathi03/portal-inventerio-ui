import { useEffect, useMemo, useState } from "react";
import { TextField, Select, DateField } from "@telefonica/mistica";
import { useModalStore } from "@/hooks/modalStorage";
import CreateForm from "@/app/crear-componente-red/CreateForm";
import { AsyncPaginate } from "react-select-async-paginate";

interface InputDynamicProps {
  name: string;
  label: string;
  required?: boolean;
  html_form_type: "input" | "select" | "date" | "multiple";
  value?: string;
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
  const { openModal } = useModalStore();
  const [myValue, setMyValue] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    console.log("INPUT DINAMICO", value, myValue);
  }, [value, myValue]);

  const renderButton = () => (
    <button
      className="px-6 py-3 bg-blue-600 text-white rounded-full"
      onClick={(e) => {
        e.preventDefault();
        openModal(
          <CreateForm
            mode="popup"
            networkId={networkId}
            regionId={regionId}
            stationId={stationId}
          />
        );
      }}
    >
      Crear
    </button>
  );

  const renderSelect = () => {
    if (isPaginated && loadPaginatedOptions) {
      console.log("value", value);

      return (
        <AsyncPaginate
          debounceTimeout={1000}
          loadOptions={loadPaginatedOptions}
          onChange={(option) => {
            onChange(name, option?.value || "");
            setMyValue(option);
          }}
          additional={{ page: 1 }}
          placeholder={`Seleccione ${label}`}
          isClearable
        />
      );
    }

    return (
      <Select
        name={name}
        label={label}
        optional={!required}
        value={value?.toString()}
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
      <AsyncPaginate
        loadOptions={() => ({
          options: selectOptions.map((o) => ({
            label: o.text,
            value: o.value,
          })),
        })}
        onChange={(option) => {
          console.log("onchange", option);
          onChange(name, option?.value || "");
          setMyValue(option);
        }}
        placeholder={`Seleccione ${label}`}
        isMulti
        className="w-full"
      />
    );
  };

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
      case "multiple":
        return renderMultiple();
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
