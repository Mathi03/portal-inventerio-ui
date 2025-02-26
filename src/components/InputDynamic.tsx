import { TextField } from "@telefonica/mistica";
import Select from "./Select";

export interface InputDynamicProps {
  name: string;
  type: string;
  label: string;
  default: boolean;
  required: boolean;
  html_form_type: "input" | "select";
  valores_posibles?: string[];
  onChange?: (name: string, value: any) => void;
}
export default function InputDynamic(props: InputDynamicProps) {
  const {
    name,
    html_form_type,
    label,
    valores_posibles = [],
    required,
    onChange = () => {},
  } = props;
  switch (html_form_type) {
    case "select": {
      return (
        <Select
          name={name}
          label={label}
          optional={!required}
          onChangeValue={(value) => onChange(name, value)}
          options={valores_posibles.map((valor) => ({
            text: valor,
            value: valor,
          }))}
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
          onChange={(value) => onChange(name, value)}
        />
      );
    }
    default: {
      throw new Error("ingreso un html_form_type incorrecto");
    }
  }
}
