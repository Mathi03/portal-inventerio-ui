"use client";
import Button from "@/components/Button";
import { Form, TextField } from "@telefonica/mistica";
import Select from "@/components/Select";
import { useState, useEffect, useCallback } from "react";
import { QueryComponenteRedDto } from "@/core/componente-red/dto/search.dto";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { RedService } from "@/core/red/red.service";
import { msDirecciones } from "@/core/config";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { RedType } from "@/core/red/red.type";
import { RegionType } from "@/core/region/region.type";

export type FormFilterType = Omit<
  QueryComponenteRedDto,
  "page" | "limit" | "q"
>;

const defaultValues: FormFilterType = {
  id: "",
  name: "",
  label: "",
  ref_component_type_id: "",
  ref_network_id: "",
  ref_source_id: "",
  region_id: "",
  client_id: "",
  station_id: "",
};

export default function Filter({
  onFilter,
}: {
  onFilter: (form: FormFilterType) => void;
}) {
  const [formValues, setFormValues] = useState<FormFilterType>(defaultValues);

  const handleChange = (name: keyof FormFilterType, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onFilter(formValues);
  };

  const handleReset = () => {
    setFormValues(defaultValues);
    onFilter(defaultValues);
  };

  // Estado y carga para selects
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    []
  );
  const [isLoadingTC, setIsLoadingTC] = useState(true);

  const [redes, setRedes] = useState<RedType[]>([]);
  const [isLoadingRedes, setIsLoadingRedes] = useState(true);

  const [regiones, setRegiones] = useState<RegionType[]>([]);
  const [isLoadingRegiones, setIsLoadingRegiones] = useState(true);

  const fetchTipoComponentes = useCallback(async () => {
    setIsLoadingTC(true);
    const { data } = await new TipoComponenteService().findAll({});
    setTipoComponentes(data.data.data);
    setIsLoadingTC(false);
  }, []);

  const fetchRedes = useCallback(async () => {
    setIsLoadingRedes(true);
    const { data } = await new RedService().findAll({});
    setRedes(data.data.data);
    setIsLoadingRedes(false);
  }, []);

  const fetchRegiones = useCallback(async () => {
    setIsLoadingRegiones(true);
    try {
      const { data } = await msDirecciones.get("/api/v1/direcciones/regiones", {
        timeout: 2000,
      });
      setRegiones(data?.data?.data || []);
    } catch {
      setRegiones([{ id: 1, nombre: "Gran Caracas" } as RegionType]);
    } finally {
      setIsLoadingRegiones(false);
    }
  }, []);

  useEffect(() => {
    fetchTipoComponentes();
    fetchRedes();
    fetchRegiones();
  }, [fetchTipoComponentes, fetchRedes, fetchRegiones]);

  return (
    <Form
      onSubmit={handleSubmit}
      className="max-w-[360px] bg-white rounded-[8px] grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden"
    >
      <header className="p-4 grid gap-4">
        <h6 className="col-span-5 text-base font-semibold flex gap-4">
          <span className="material-symbols-outlined">filter_list</span>
          <b className="text-[22px] font-normal">Filtro de Búsqueda</b>
        </h6>
        <p>
          Seleccione los filtros necesarios antes de consultar sus componente de
          red
        </p>
      </header>
      <section className="grid gap-4 overflow-auto px-4 pb-4 scroller">
        <TextField
          name="id"
          label="Componente Id"
          value={formValues.id}
          onChange={(e) => handleChange("id", e.target.value)}
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
        <TextField
          name="label"
          label="Etiqueta"
          value={formValues.label}
          onChange={(e) => handleChange("label", e.target.value)}
          fullWidth
          optional
        />

        <Select
          name="ref_component_type_id"
          label="Tipo de componente"
          value={formValues.ref_component_type_id}
          onChangeValue={(value) =>
            handleChange("ref_component_type_id", value)
          }
          disabled={isLoadingTC}
          helperText={
            isLoadingTC ? "Cargando tipo de componentes..." : undefined
          }
          options={tipoComponentes
            .filter((tc) => tc.status === 1)
            .map((tc) => ({
              text: tc.label,
              value: tc.id.toString(),
            }))}
          optional
          fullWidth
        />

        <Select
          name="ref_network_id"
          label="Red"
          value={formValues.ref_network_id}
          onChangeValue={(value) => handleChange("ref_network_id", value)}
          disabled={isLoadingRedes}
          helperText={isLoadingRedes ? "Cargando redes..." : undefined}
          options={redes
            .filter((r) => r.status === 1)
            .map((r) => ({
              text: r.label,
              value: r.id.toString(),
            }))}
          optional
          fullWidth
        />

        <Select
          name="region_id"
          label="Región"
          value={formValues.region_id}
          onChangeValue={(value) => handleChange("region_id", value)}
          disabled={isLoadingRegiones}
          helperText={isLoadingRegiones ? "Cargando regiones..." : undefined}
          options={regiones.map((r) => ({
            text: r.nombre,
            value: r.id.toString(),
          }))}
          optional
          fullWidth
        />

        <TextField
          name="client_id"
          label="Id Cliente"
          value={formValues.client_id}
          onChange={(e) => handleChange("client_id", e.target.value)}
          fullWidth
          optional
        />
        <TextField
          name="station_id"
          label="Id Estacion"
          value={formValues.station_id}
          onChange={(e) => handleChange("station_id", e.target.value)}
          fullWidth
          optional
        />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary" onClick={handleReset}>
          Limpiar
        </Button>
        <Button>Buscar</Button>
      </footer>
    </Form>
  );
}
