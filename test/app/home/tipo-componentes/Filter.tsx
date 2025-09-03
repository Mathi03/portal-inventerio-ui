"use client";
import Button from "@/components/Button";
import {
  TCStatusEnumOptions,
  TipoComponenteType,
} from "@/core/tipo-componente/tipo-componente.type";
import { Select, TextField } from "@telefonica/mistica";
import { useState } from "react";

export type FormType = keyof Pick<
  TipoComponenteType,
  "label" | "name" | "status"
>;

const defaultValues: Record<FormType, string> = {
  label: "",
  name: "",
  status: "",
};

export default function Filter({
  onSubmit,
}: {
  onSubmit: (values: Record<FormType, string>) => void;
}) {
  const [formValues, setFormValues] =
    useState<Record<FormType, string>>(defaultValues);

  const handleChange = (name: FormType, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  const handleReset = () => {
    setFormValues(defaultValues);
    onSubmit(defaultValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="max-w-[360px] bg-white grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden rounded-[8px]"
    >
      <header className="p-4 grid gap-4">
        <h6 className="col-span-5 text-base font-semibold flex gap-4">
          <span className="material-symbols-outlined">filter_list</span>
          <b className="text-[22px] font-normal">Filtro de Búsqueda</b>
        </h6>
        <p>
          Seleccione los filtros necesarios antes de consultar sus mantenedores
          de tipo de componente
        </p>
      </header>
      <section className="scroller grid gap-4 overflow-auto px-4 pb-4 content-start">
        <TextField
          name="label"
          label="Etiqueta"
          value={formValues.label}
          onChange={(e) => handleChange("label", e.target.value)}
          fullWidth
          optional
        />
        <TextField
          name="name"
          label="Nombre"
          value={formValues.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
          optional
        />
        <Select
          name="status"
          label="Estado"
          value={formValues.status}
          onChangeValue={(value) => handleChange("status", value)}
          options={TCStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
          optional
        />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary" onClick={handleReset}>
          Limpiar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Buscar
        </Button>
      </footer>
    </div>
  );
}
