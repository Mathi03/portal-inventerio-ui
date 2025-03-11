import { DateField, TextField } from "@telefonica/mistica";
import Select from "./Select";
import { useCallback, useEffect, useState } from "react";
import { bff } from "@/core/config";

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
  } = props;

  const [loading, setLoading] = useState<boolean>(
    valores_posibles_source ? true : false,
  );
  const [options, setOptions] =
    useState<Array<{ text: string; value: string }>>();

  const getData = useCallback(async () => {
    if (!valores_posibles_source) return;
    setLoading(true);
    const { data } = await bff.get(valores_posibles_source);
    setOptions(
      data.data.data.map((json: any) => {
        const [name, value] = valores_posibles_response;
        return {
          text: json[name!],
          value: json[value!],
        };
      }),
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
          optional={!required}
          onChangeValue={(value) => onChange(name, value)}
          disabled={loading}
          helperText={loading ? `cargando ${label}...` : undefined}
          options={
            options ||
            valores_posibles.map((valor) => ({
              text: valor.name,
              value: valor.value,
            }))
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
