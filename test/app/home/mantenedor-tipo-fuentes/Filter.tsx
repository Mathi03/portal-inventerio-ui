"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { TextField } from "@telefonica/mistica";
import {
  TipoFuenteStatusEnumOptions,
  TipoFuenteType,
} from "@/core/tipo-fuente/tipo-fuente.type";

export type FormType = keyof Pick<TipoFuenteType, "label" | "name" | "status">;
export type FilterFormValues = Record<"label" | "name" | "status", string>;

export default function Filter({
  onSubmit,
}: {
  onSubmit: (values: FilterFormValues) => void;
}) {
  const [formData, setFormData] = useState<Record<FormType, string>>({
    label: "",
    name: "",
    status: "",
  });

  const handleChange = (field: FormType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleReset = () => {
    const empty = { label: "", name: "", status: "" };
    setFormData(empty);
    onSubmit(empty);
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
          de fuentes
        </p>
      </header>

      <section className="scroller grid gap-4 overflow-auto px-4 pb-4 content-start">
        <TextField
          name="label"
          label="Etiqueta"
          fullWidth
          optional
          value={formData.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />
        <TextField
          name="name"
          label="Nombre"
          fullWidth
          optional
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Select
          name="status"
          label="Estado"
          fullWidth
          optional
          value={formData.status}
          onChangeValue={(value) => handleChange("status", value)}
          options={[
            ...TipoFuenteStatusEnumOptions.map((option) => ({
              text: option.label,
              value: option.value.toString(),
            })),
          ]}
        />
      </section>

      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary" onClick={handleReset}>
          Limpiar
        </Button>
        <Button onClick={handleSubmit}>Buscar</Button>
      </footer>
    </div>
  );
}
