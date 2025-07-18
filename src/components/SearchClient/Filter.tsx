"use client";
import Button from "@/components/Button";
import { QueryClienteDto } from "@/core/cliente/dto/search.dto";
import { TextField } from "@telefonica/mistica";
import { useState } from "react";

interface FilterProps {
  onSearch?: (filters: QueryClienteDto) => void;
}

export default function Filter({ onSearch }: FilterProps) {
  const [formData, setFormData] = useState<QueryClienteDto>({
    inicialescircuito: "",
    nombreadministrativo: "",
    nombrecomercial: "",
    rif: "",
  });

  const handleSubmit = () => {
    if (onSearch) {
      onSearch(formData);
    }
  };

  const handleChange = (field: keyof QueryClienteDto, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleClear = () => {
    const clearData = {
      inicialescircuito: "",
      nombreadministrativo: "",
      nombrecomercial: "",
      rif: "",
    };
    setFormData(clearData);

    if (onSearch) {
      onSearch(clearData as QueryClienteDto);
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
        <p>Seleccione los filtros necesarios antes de consultar sus clientes</p>
      </header>
      <section className="grid gap-4 overflow-auto px-4 pb-4 content-start">
        <TextField
          name="nombreadministrativo"
          label="Nombre Administrativo"
          value={formData.nombreadministrativo}
          onChange={(e) => handleChange("nombreadministrativo", e.target.value)}
          fullWidth
        />
        <TextField
          name="nombrecomercial"
          label="Nombre Comercial"
          value={formData.nombrecomercial}
          onChange={(e) => handleChange("nombrecomercial", e.target.value)}
          fullWidth
        />
        <TextField
          name="rif"
          label="RIF"
          value={formData.rif}
          onChange={(e) => handleChange("rif", e.target.value)}
          fullWidth
        />
        <TextField
          name="inicialescircuito"
          label="Iniciales Circuito"
          value={formData.inicialescircuito}
          onChange={(e) => handleChange("inicialescircuito", e.target.value)}
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
