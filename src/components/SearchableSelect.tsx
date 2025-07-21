import { TextField, useFieldProps } from "@telefonica/mistica";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";

interface Option {
  value: string;
  text: string;
}

interface SearchableSelectProps {
  name: string;
  label: string;
  options: Option[];
  onChangeValue?: (value: string) => void;
  value?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  optional?: boolean;
}

export default function SearchableSelect({
  name,
  label,
  options,
  onChangeValue,
  value: controlledValue,
  helperText,
  disabled,
  fullWidth,
  optional,
}: SearchableSelectProps) {
  const [selectedText, setSelectedText] = useState("");
  const isControlled =
    controlledValue !== undefined && onChangeValue !== undefined;

  const {
    defaultValue,
    onChange: formOnChange,
    error,
    helperText: fieldHelperText,
  } = useFieldProps({
    name,
    label,
    value: controlledValue,
    onChangeValue,
    processValue: (v) => v,
    helperText,
    error: false,
    disabled,
  });

  const value = useMemo(() => {
    return isControlled ? controlledValue : (defaultValue ?? "");
  }, []);
  const setValue = isControlled
    ? onChangeValue!
    : (val: string) => {
        const syntheticEvent = {
          currentTarget: { value: val },
        } as React.ChangeEvent<HTMLInputElement>;
        formOnChange(syntheticEvent);
      };

  const [query, setQuery] = useState(value.toString());
  const [showList, setShowList] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.text.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, options]);

  useEffect(() => {
    if (options.length === 0 || !value) return;
    const selected = options.find((opt) => opt.value === value);
    if (selected) {
      setQuery(selected.text);
      setValue(selected.value);
    }
  }, [value, options]);

  useEffect(() => {
    if (isControlled && !controlledValue) {
      setQuery("");
    }
  }, [controlledValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt: Option) => {
    setValue(opt.value);
    setQuery(opt.text);
    setSelectedText(opt.text);
    setShowList(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative grid gap-2 ${fullWidth ? "w-full" : "w-fit"}`}
    >
      <TextField
        name={name}
        label={label}
        value={query}
        onChangeValue={(val) => {
          setQuery(val);
          setShowList(true);
          if (selectedText && val !== selectedText) {
            setValue("");
            setSelectedText("");
          }
        }}
        placeholder="Buscar..."
        helperText={error ? fieldHelperText : helperText}
        disabled={disabled}
        fullWidth={fullWidth}
        onFocus={() => setShowList(true)}
        optional={optional}
        autoComplete="off"
        endIcon={
          <Icon
            icon="expand_more"
            className={`transition-transform duration-200 ${
              showList ? "rotate-180" : ""
            }`}
          />
        }
      />

      {showList && (
        <ul className="absolute top-full left-0 max-h-[200px] min-w-full w-max max-w-screen-md overflow-auto border rounded shadow bg-white z-50 overflow-x-hidden">
          {filteredOptions.map((opt) => (
            <li
              key={opt.value}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                value === opt.value ? "bg-blue-100 font-bold" : ""
              }`}
              onClick={() => handleSelect(opt)}
            >
              {opt.text}
            </li>
          ))}
          {filteredOptions.length === 0 && (
            <li className="p-2 text-gray-500">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}
