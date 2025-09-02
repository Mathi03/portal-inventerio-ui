import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  KeyboardEvent,
} from "react";
import { useFieldProps } from "@telefonica/mistica";
import Icon from "./Icon";

type Option = { value: string; text: string };

type ValueType = string | string[]; // single o multiple

interface SelectFieldProps {
  name: string;
  label: string;
  options?: Option[];
  isMultiple?: boolean;
  value?: ValueType;
  onChangeValue?: (value: ValueType) => void;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  optional?: boolean;
  placeholder?: string;
  className?: string;
}

export interface SelectFieldHandle {
  setValue: (value: ValueType) => void;
  setQuery: (text: string) => void;
  focus: () => void;
}

const cls = (...xs: Array<string | false | undefined>) =>
  xs.filter(Boolean).join(" ");

const SelectField = forwardRef<SelectFieldHandle, SelectFieldProps>(
  (
    {
      name,
      label,
      options,
      isMultiple = false,
      value: controlledValue,
      onChangeValue,
      helperText,
      disabled,
      fullWidth,
      optional,
      placeholder = "Buscar...",
      className,
    },
    ref
  ) => {
    // ---- Integración con Form / controlado-no controlado ----
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
      value: controlledValue as any,
      onChangeValue: onChangeValue as any,
      processValue: (v) => v,
      helperText,
      error: false,
      optional,
      disabled,
    });

    const getInitialValue = (): ValueType => {
      if (isControlled) {
        if (isMultiple && Array.isArray(controlledValue)) {
          // Si es un array de numbers, lo convierto a string[]
          return controlledValue.map((v) => String(v));
        }
        // Si es un único number lo convierto a string
        if (!isMultiple && typeof controlledValue === "number") {
          return String(controlledValue);
        }
        return controlledValue!;
      }

      const initialValue =
        (defaultValue as ValueType) ?? (isMultiple ? [] : "");
      return initialValue;
    };

    const [internalValue, setInternalValue] =
      useState<ValueType>(getInitialValue);
    const currentValue: ValueType = isControlled
      ? (() => {
          if (isMultiple && Array.isArray(controlledValue)) {
            return controlledValue.map((v) => String(v));
          }
          if (!isMultiple && typeof controlledValue === "number") {
            return String(controlledValue);
          }
          return controlledValue as ValueType;
        })()
      : internalValue;

    const emitChange = (val: ValueType) => {
      if (isControlled) {
        onChangeValue!(val);
      } else {
        setInternalValue(val);
        // sintetizamos el change para Mistica Form
        const syntheticEvent = {
          currentTarget: { value: val as any },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        formOnChange(syntheticEvent);
      }
    };

    // ---- UI state ----
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = useRef(
      `listbox-${name}-${Math.random().toString(36).slice(2)}`
    ).current;

    // ---- Filtro ----
    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options;
      //   return options.filter(
      //     (o) =>
      //       o.text.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
      //   );
    }, [options, query]);

    const isSelected = (opt: Option): boolean => {
      if (isMultiple) {
        const arr = Array.isArray(currentValue) ? currentValue : [];
        return arr.includes(opt.value);
      }
      return currentValue === opt.value;
    };

    const selectOption = (opt: Option) => {
      if (isMultiple) {
        const arr = Array.isArray(currentValue) ? [...currentValue] : [];
        if (arr.includes(opt.value)) {
          // toggle off
          emitChange(arr.filter((v) => v !== opt.value));
        } else {
          emitChange([...arr, opt.value]);
        }
        // Mantén el dropdown abierto para selección múltiple
        setQuery("");
        setActiveIndex(-1);
        inputRef.current?.focus();
      } else {
        emitChange(opt.value);
        setQuery(opt.text);
        setOpen(false);
      }
    };

    const removeValue = (val: string) => {
      if (!isMultiple) {
        emitChange("");
        setQuery("");
        return;
      }
      const arr = Array.isArray(currentValue) ? currentValue : [];
      emitChange(arr.filter((v) => v !== val));
    };

    // Inicializa query si hay valor simple
    useEffect(() => {
      if (isMultiple) return;
      const v = (currentValue as string) || "";
      if (!v) {
        setQuery("");
        return;
      }
      const found = options.find((o) => o.value === v);
      if (found) setQuery(found.text);
    }, [isMultiple, currentValue, options]);

    // Cerrar al hacer click fuera
    useEffect(() => {
      const onDocClick = (e: MouseEvent) => {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const opt = filtered[activeIndex];
        if (opt) selectOption(opt);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };

    useImperativeHandle(ref, () => ({
      setValue: emitChange,
      setQuery,
      focus: () => inputRef.current?.focus(),
    }));

    const selectedChips: Option[] = useMemo(() => {
      if (!isMultiple) return [];
      const arr = Array.isArray(currentValue) ? currentValue : [];

      const map = new Map(options.map((o) => [o.value, o.text]));
      return arr.map((v) => ({ value: v, text: map.get(v) ?? v }));
    }, [isMultiple, currentValue, options]);

    const showHelper = error ? fieldHelperText : helperText;

    return (
      <div
        ref={wrapperRef}
        className={cls(
          "relative h-min-[60px]",
          fullWidth ? "w-full" : "w-[360px]",
          !isMultiple && "max-h-[60px]",
          className
        )}
      >
        {/* Contenedor “outlined” con label flotante */}
        <div
          className={cls(
            "relative h-full border min-h-[60px]",
            disabled && "opacity-60 pointer-events-none"
          )}
          {...(isMultiple ? { onClick: () => !disabled && setOpen(true) } : {})}
        >
          {/* Borde/outline 
          <div
            className={cls(
              "pointer-events-none absolute inset-0 border bg-transparent",
              error ? "border-red-600" : "border-gray-300",
              "peer-focus:border-2"
            )}
            aria-hidden="true"
          />
          */}

          {/* Chips (si usas múltiple) */}
          {isMultiple && selectedChips.length > 0 && (
            <div className="relative left-3 right-3 mt-7 flex flex-wrap gap-1 pb-1 w-5/6">
              {selectedChips.map((chip) => (
                <span
                  key={chip.value}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-sm"
                >
                  {chip.text}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(chip.value);
                    }}
                    className="grid h-5 w-5 place-items-center rounded-full hover:bg-gray-100"
                    aria-label={`Quitar ${chip.text}`}
                    title="Quitar"
                  >
                    <Icon
                      icon="close"
                      className="text-gray-600 text-base leading-none"
                    />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input: usa peer para animar el label */}
          <input
            ref={inputRef}
            id={name}
            name={name}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!open) setOpen(true);
              if (
                !isMultiple &&
                currentValue &&
                typeof currentValue === "string"
              ) {
                const chosen = options.find((o) => o.value === currentValue);
                if (chosen && chosen.text !== e.target.value) emitChange("");
              }
            }}
            onFocus={() => !disabled && setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder=" "
            className={cls(
              "peer w-full rounded-lg bg-transparent outline-none h-full",
              // padding para que el label tenga espacio; si hay chips, dale más top
              isMultiple ? "hidden px-3 pt-12 pb-2" : "px-3 pt-7 pb-2",
              "placeholder:text-transparent", // no mostramos texto placeholder
              "min-h-[58px]"
            )}
            autoComplete="off"
            disabled={disabled}
            //aria-controls={listboxId}
            //aria-autocomplete="list"
            onClick={() => !disabled && setOpen(true)}
          />

          {/* Label flotante (estilo MUI) */}
          <label
            htmlFor={name}
            className={cls(
              "pointer-events-none absolute left-3 bg-white text-lg",
              "origin-left text-gray-500 transition-all duration-150",
              // pos base (sin foco y sin valor)
              "top-1/2 -translate-y-1/2 ",
              // al enfocar o si hay valor => encoge y sube
              "peer-focus:top-3 peer-focus:text-xs peer-focus:text-blue-700",
              "peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs",
              error && "peer-focus:text-red-700",
              isMultiple && selectedChips.length > 0 && "top-[16px] text-xs"
            )}
          >
            {label}{" "}
            {optional && <span className="text-gray-400">(opcional)</span>}
          </label>

          {/* Chevron / limpiar (posicionado dentro del control) */}
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <Icon
              icon="expand_more"
              className={cls("transition-transform", open && "rotate-180")}
            />
          </div>
        </div>

        {/* Lista de opciones */}
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className={cls(
              "absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            )}
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">
                Sin resultados
              </li>
            )}
            {filtered.map((opt, idx) => {
              const selected = isSelected(opt);
              const active = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  className={cls(
                    "flex cursor-pointer items-center justify-between px-3 py-2 text-sm",
                    active ? "bg-gray-100" : "",
                    selected ? "font-medium text-blue-700" : "text-gray-800"
                  )}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()} // evita blur del input
                  onClick={() => selectOption(opt)}
                >
                  <span className="truncate">{opt.text}</span>
                  {selected && <Icon icon="check" className="text-blue-600" />}
                </li>
              );
            })}
          </ul>
        )}

        {/* Helper / error */}
        {showHelper && (
          <p
            className={cls(
              "mt-1 text-sm",
              error ? "text-red-600" : "text-gray-500"
            )}
          >
            {showHelper}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
