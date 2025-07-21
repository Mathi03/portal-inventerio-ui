"use client";
import Button from "@/components/Button";
import { QueryEstacionDto } from "@/core/estaciones/dto/search.dto";
import { IntegerField, TextField } from "@telefonica/mistica";
import { useState } from "react";

interface FilterProps {
  onSearch?: (filters: QueryEstacionDto) => void;
}

export default function Filter({ onSearch }: FilterProps) {
  const [formData, setFormData] = useState<QueryEstacionDto>({
    codigo: "",
    nombre: "",
    estatus: "",
    estatusMorinre: "",
    id: "",
  });

  const handleSubmit = () => {
    if (onSearch) {
      onSearch(formData);
    }
  };

  const handleChange = (field: keyof QueryEstacionDto, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleClear = () => {
    const clearData = {
      codigo: "",
      nombre: "",
      estatus: "",
      estatusMorinre: "",
      id: "",
    };
    setFormData(clearData);

    if (onSearch) {
      onSearch(clearData as QueryEstacionDto);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="max-w-[360px] bg-white rounded-3xl grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden"
    >
      <header className="p-4 grid gap-4">
        <h6 className="col-span-5 text-base font-semibold flex gap-4">
          <span className="material-symbols-outlined">filter_list</span>
          <b className="text-[22px] font-normal">Filtro de Búsqueda</b>
        </h6>
        <p>Seleccione los filtros necesarios antes de consultar sus estaciones</p>
      </header>
      <section className="grid gap-4 overflow-auto px-4 pb-4 content-start">
        <IntegerField
          name="id"
          label="ID"
          value={formData.id}
          onChange={(e) => handleChange("id", e.target.value)}
          fullWidth
        />
        <TextField
          name="codigo"
          label="Código"
          value={formData.codigo}
          onChange={(e) => handleChange("codigo", e.target.value)}
          fullWidth
        />
        <TextField
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          fullWidth
        />
        <TextField
          name="estatus"
          label="Estatus"
          value={formData.estatus}
          onChange={(e) => handleChange("estatus", e.target.value)}
          fullWidth
        />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary" onClick={handleClear}>
          Limpiar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Buscar
        </Button>
      </footer>
    </div>
  );
}
