import {
  DateField,
  Select,
  TextField,
  useFieldProps,
} from "@telefonica/mistica";
import { useCallback, useEffect, useMemo, useState } from "react";
import { source } from "@/core/config";

export interface InputDynamicProps {
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  html_form_type: "input" | "select" | "date";
  valores_posibles?: Array<{
    name: string;
    value: string;
  }>;
  valores_posibles_source?: string;
  valores_posibles_response?: ["label", "id"];
  onChange?: (name: string, value: any) => void;
  value?: string | number | boolean | null; // Added the 'value' prop
  currentValue?: string; // Puedes ajustar el tipo según lo que esperas (ej. solo string para texto)
  loading?: boolean;
  dynamicOptions?: Array<{ text: string; value: string }>;
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
  } = props;
  //console.log("render", name, value, valores_posibles);
  const [valueController, setValueController] = useState(value?.toString() ?? "");

  const [loading, setLoading] = useState<boolean>(
    valores_posibles_source ? true : false
  );
  const [options, setOptions] = useState<
    Array<{ text: string; value: string }>
  >([]);

  const getData = useCallback(async () => {
    if (!valores_posibles_source) return;
    setLoading(true);
    const { data } = await source.get(valores_posibles_source);

    setOptions(
      data.data.data.map((json: any) => {
        const [name, value] = valores_posibles_response;
        return {
          text: json[name!],
          value: String(json[value!]),
        };
      })
    );
    setLoading(false);
  }, [valores_posibles_source, valores_posibles_response]);

  useEffect(() => {
    getData();
  }, [getData]);

  switch (html_form_type) {
    case "select": {
      return (
        <Select
          name={name}
          label={label}
          value={valueController}
          optional={!required}
          onChangeValue={(value) => {
            // console.log("onChangeValue", name, value);
            onChange(name, value);
            setValueController(value);
          }}
          disabled={loading}
          helperText={loading ? `cargando ${label}...` : undefined}
          options={
            dynamicOptions ??
            (valores_posibles_source
              ? options
              : valores_posibles.map((valor) => ({
                  text: valor.name,
                  value: valor.value.toString(),
                })))
          }
          fullWidth
        />
      );
    }
    case "input": {
      return (
        <TextField
          name={name}
          optional={!required}
          label={label}
          fullWidth
          onChange={(e) => {
            onChange(name, e.target.value);
          }}
          value={currentValue}
          maxLength={255}
        />
      );
    }
    case "date": {
      return (
        <DateField
          name={name}
          optional={!required}
          label={label}
          fullWidth
          onChange={(value) => onChange(name, value)}
        />
      );
    }
    default: {
      throw new Error("ingreso un html_form_type incorrecto");
    }
  }
}
