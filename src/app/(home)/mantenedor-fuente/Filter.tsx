"use client";

import { useState, useCallback, useEffect } from "react";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { FuenteStatusEnumOptions, FuenteType } from "@/core/fuente/fuente.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { TextField } from "@telefonica/mistica";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { TipoFuenteType } from "@/core/tipo-fuente/tipo-fuente.type";

export type FormType = keyof Pick<
  FuenteType,
  | "label"
  | "name"
  | "status"
  | "version"
  | "refNetworkId"
  | "refComponentTypeId"
  | "refTypeSourceId"
>;
export type FilterFormValues = Record<FormType, string>;

export default function Filter({
  onSubmit,
}: {
  onSubmit: (values: FilterFormValues) => void;
}) {
  const [formData, setFormData] = useState<FilterFormValues>({
    label: "",
    name: "",
    status: "",
    version: "",
    refNetworkId: "",
    refComponentTypeId: "",
    refTypeSourceId: "",
  });

  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [isLoadingTF, setIsLoadingTF] = useState(true);
  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    []
  );
  const [tipoFuentes, setTipoFuentes] = useState<TipoFuenteType[]>([]);

  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    const sortedData = [...data.data.data].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setRedes(sortedData);
    setIsLoadingRed(false);
  }, []);

  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    const sortedData = [...data.data.data].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setTipoComponentes(sortedData);
    setIsLoadingTC(false);
  }, []);

  const getTipoFuente = useCallback(async () => {
    setIsLoadingTF(true);
    const tfService = new TipoFuenteService();
    const { data } = await tfService.findAll({});
    const sortedData = [...data.data.data].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setTipoFuentes(sortedData);
    setIsLoadingTF(false);
  }, []);

  useEffect(() => {
    getRedes();
    getTipoComponente();
    getTipoFuente();
  }, [getRedes, getTipoComponente, getTipoFuente]);

  const handleChange = (field: FormType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleReset = () => {
    const empty = {
      label: "",
      name: "",
      status: "",
      version: "",
      refNetworkId: "",
      refComponentTypeId: "",
      refTypeSourceId: "",
    };
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
          name="refComponentTypeId"
          label="Tipo de componente"
          fullWidth
          optional
          disabled={isLoadingTC}
          value={formData.refComponentTypeId}
          onChangeValue={(value) => handleChange("refComponentTypeId", value)}
          options={tipoComponentes.map((tc) => ({
            text: tc.label,
            value: tc.id.toString(),
          }))}
        />
        <Select
          name="refNetworkId"
          label="Red"
          fullWidth
          optional
          disabled={isLoadingRedes}
          value={formData.refNetworkId}
          onChangeValue={(value) => handleChange("refNetworkId", value)}
          options={redes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
        />
        <Select
          name="refTypeSourceId"
          label="Tipo Fuente"
          fullWidth
          optional
          disabled={isLoadingTF}
          value={formData.refTypeSourceId}
          onChangeValue={(value) => handleChange("refTypeSourceId", value)}
          options={tipoFuentes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
        />
        <Select
          name="status"
          label="Estado"
          fullWidth
          optional
          value={formData.status}
          onChangeValue={(value) => handleChange("status", value)}
          options={FuenteStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
        />
        {/**
         <TextField
            name="version"
            label="Versión"
            fullWidth
            optional
            value={formData.version}
            onChange={(e) => handleChange("version", e.target.value)}
          />
         */}
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
