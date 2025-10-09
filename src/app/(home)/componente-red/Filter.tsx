"use client";
import Button from "@/components/Button";
import { IntegerField, TextField } from "@telefonica/mistica";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { QueryComponenteRedDto } from "@/core/componente-red/dto/search.dto";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { RedService } from "@/core/red/red.service";
import { msDirecciones } from "@/core/config";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { RedType } from "@/core/red/red.type";
import { RegionType } from "@/core/region/region.type";
import { FuenteType } from "@/core/fuente/fuente.type";
import { FuenteService } from "@/core/fuente/fuente.service";
import SearchableSelect from "@/components/SearchableSelect";
import SearchClient from "@/components/SearchClient";
import SearchEstacion from "@/components/SearchEstacion";
import Modal from "@/components/Modal";
import { RELACIONES_TIPO_CIRCUITO } from "@/core/config/relacionesServicios";

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
  id_tipo_circuito: "",
};

export default function Filter({
  onFilter,
}: {
  onFilter: (form: FormFilterType) => void;
}) {
  const [openModalCliente, setOpenModalCliente] = useState(false);
  const [openModalEstacion, setOpenModalEstacion] = useState(false);
  const [formValues, setFormValues] = useState<FormFilterType>(defaultValues);
  const [clientName, setClientName] = useState("");

  // === REGLA DE VISIBILIDAD POR TIPO DE CIRCUITO ===
  // Cuando hay id_tipo_circuito, solo se muestran estos campos (más el propio id_tipo_circuito):
  const allowedWhenCircuito = useMemo(
    () =>
      new Set<keyof FormFilterType>([
        "ref_component_type_id",
        "ref_network_id",
        "region_id",
        "station_id",
        "id_tipo_circuito",
        "client_id",
      ]),
    []
  );
  const isLimitedByCircuito = !!formValues.id_tipo_circuito;

  const isVisible = useCallback(
    (name: keyof FormFilterType) =>
      !isLimitedByCircuito || allowedWhenCircuito.has(name),
    [isLimitedByCircuito, allowedWhenCircuito]
  );

  const handleChange = (name: keyof FormFilterType, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onFilter(formValues);
  };

  const handleReset = () => {
    setFormValues(defaultValues);
    onFilter(defaultValues);
    setClientName("");
  };

  // ===== Estado y carga para selects + ERRORES =====
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    []
  );
  const [isLoadingTC, setIsLoadingTC] = useState(false);
  const [isErrorTC, setIsErrorTC] = useState(false);

  const [redes, setRedes] = useState<RedType[]>([]);
  const [isLoadingRedes, setIsLoadingRedes] = useState(false);
  const [isErrorRedes, setIsErrorRedes] = useState(false);

  const [regiones, setRegiones] = useState<RegionType[]>([]);
  const [isLoadingRegiones, setIsLoadingRegiones] = useState(false);
  const [isErrorRegiones, setIsErrorRegiones] = useState(false);

  const [fuentes, setFuentes] = useState<FuenteType[]>([]);
  const [isLoadingFuentes, setIsLoadingFuentes] = useState(false);
  const [isErrorFuentes, setIsErrorFuentes] = useState(false);

  // ===== Caché simple en memoria del navegador (por sesión) =====
  const cacheTC = useRef<TipoComponenteType[] | null>(null);
  const cacheRedes = useRef<RedType[] | null>(null);
  const cacheFuentes = useRef<FuenteType[] | null>(null);
  const cacheRegiones = useRef<RegionType[] | null>(null);

  const fetchTipoComponentes = useCallback(async () => {
    if (cacheTC.current) {
      setTipoComponentes(cacheTC.current);
      return;
    }
    setIsLoadingTC(true);
    setIsErrorTC(false);
    try {
      const { data } = await new TipoComponenteService().findAll({});
      const items = data.data.data as TipoComponenteType[];
      setTipoComponentes(items);
      cacheTC.current = items;
    } catch {
      setIsErrorTC(true);
    } finally {
      setIsLoadingTC(false);
    }
  }, []);

  const fetchRedes = useCallback(async () => {
    if (cacheRedes.current) {
      setRedes(cacheRedes.current);
      return;
    }
    setIsLoadingRedes(true);
    setIsErrorRedes(false);
    try {
      const { data } = await new RedService().findAll({});
      const items = data.data.data as RedType[];
      setRedes(items);
      cacheRedes.current = items;
    } catch {
      setIsErrorRedes(true);
    } finally {
      setIsLoadingRedes(false);
    }
  }, []);

  const fetchFuentes = useCallback(async () => {
    if (cacheFuentes.current) {
      setFuentes(cacheFuentes.current);
      return;
    }
    setIsLoadingFuentes(true);
    setIsErrorFuentes(false);
    try {
      const { data } = await new FuenteService().findAll({});
      const items = data.data.data as FuenteType[];
      setFuentes(items);
      cacheFuentes.current = items;
    } catch {
      setIsErrorFuentes(true);
    } finally {
      setIsLoadingFuentes(false);
    }
  }, []);

  const fetchRegiones = useCallback(async () => {
    if (cacheRegiones.current) {
      setRegiones(cacheRegiones.current);
      return;
    }
    setIsLoadingRegiones(true);
    setIsErrorRegiones(false);
    try {
      const { data } = await msDirecciones.get("/api/v1/direcciones/regiones", {
        timeout: 2000,
      });
      const items = (data?.data?.data || []) as RegionType[];
      setRegiones(items);
      cacheRegiones.current = items;
    } catch {
      // En error, no inventamos valores; marcamos error y mostramos helperText.
      setIsErrorRegiones(true);
    } finally {
      setIsLoadingRegiones(false);
    }
  }, []);

  useEffect(() => {
    fetchTipoComponentes();
    fetchRedes();
    fetchRegiones();
    fetchFuentes();
  }, [fetchTipoComponentes, fetchRedes, fetchRegiones, fetchFuentes]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div
        onKeyDown={handleKeyDown}
        className="max-w-[360px] bg-white rounded-[8px] grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden"
      >
        <header className="p-4 grid gap-4">
          <h6 className="col-span-5 text-base font-semibold flex gap-4">
            <span className="material-symbols-outlined">filter_list</span>
            <b className="text-[22px] font-normal">Filtro de Búsqueda</b>
          </h6>
          <p>
            Seleccione los filtros necesarios antes de consultar sus componente
            de red
          </p>
        </header>

        <section className="flex flex-col gap-4 overflow-auto px-4 pb-4 scroller">
          {isVisible("id") && (
            <IntegerField
              name="id"
              label="Componente Id"
              value={formValues.id}
              onChange={(e) => handleChange("id", e.target.value)}
              fullWidth
              optional
            />
          )}

          {isVisible("control_id" as any) && (
            <IntegerField
              name="control_id"
              label="Control Id"
              value={(formValues as any).control_id || ""}
              onChange={(e) =>
                handleChange("control_id" as any, e.target.value)
              }
              fullWidth
              optional
            />
          )}

          {isVisible("name") && (
            <TextField
              name="name"
              label="Nombre"
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              optional
            />
          )}

          {isVisible("label") && (
            <TextField
              name="label"
              label="Etiqueta"
              value={formValues.label}
              onChange={(e) => handleChange("label", e.target.value)}
              fullWidth
              optional
            />
          )}

          {isVisible("ref_component_type_id") && (
            <SearchableSelect
              name="ref_component_type_id"
              label="Tipo de componente"
              value={formValues.ref_component_type_id?.toString()}
              onChangeValue={(value) =>
                handleChange("ref_component_type_id", value)
              }
              disabled={isLoadingTC}
              helperText={
                isLoadingTC
                  ? "Cargando tipo de componentes..."
                  : isErrorTC
                    ? "No fue posible obtener los tipos de componente."
                    : undefined
              }
              options={tipoComponentes
                .filter((tc) => tc.status === 1)
                .map((tc) => ({ text: tc.label, value: tc.id.toString() }))}
              optional
              fullWidth
            />
          )}

          {isVisible("ref_network_id") && (
            <SearchableSelect
              name="ref_network_id"
              label="Red"
              value={formValues.ref_network_id}
              onChangeValue={(value) => handleChange("ref_network_id", value)}
              disabled={isLoadingRedes}
              helperText={
                isLoadingRedes
                  ? "Cargando redes..."
                  : isErrorRedes
                    ? "No fue posible obtener las redes."
                    : undefined
              }
              options={redes
                .filter((r) => r.status === 1)
                .map((r) => ({ text: r.label, value: r.id.toString() }))}
              optional
              fullWidth
            />
          )}

          {isVisible("ref_source_id") && (
            <SearchableSelect
              name="ref_source_id"
              label="Fuente"
              value={formValues.ref_source_id}
              onChangeValue={(value) => handleChange("ref_source_id", value)}
              disabled={isLoadingFuentes}
              helperText={
                isLoadingFuentes
                  ? "Cargando fuentes..."
                  : isErrorFuentes
                    ? "No fue posible obtener las fuentes."
                    : undefined
              }
              options={fuentes.map((r) => ({
                text: r.label,
                value: r.id.toString(),
              }))}
              optional
              fullWidth
            />
          )}

          {isVisible("region_id") && (
            <SearchableSelect
              name="region_id"
              label="Región"
              value={formValues.region_id}
              onChangeValue={(value) => handleChange("region_id", value)}
              disabled={isLoadingRegiones}
              helperText={
                isLoadingRegiones
                  ? "Cargando regiones..."
                  : isErrorRegiones
                    ? "No fue posible obtener las regiones."
                    : undefined
              }
              options={regiones.map((r) => ({
                text: r.nombre,
                value: r.id.toString(),
              }))}
              optional
              fullWidth
            />
          )}

          {/* Tipo Circuito siempre visible */}
          <SearchableSelect
            name="id_tipo_circuito"
            label="Tipo Circuito"
            value={formValues.id_tipo_circuito}
            onChangeValue={(value) => handleChange("id_tipo_circuito", value)}
            options={RELACIONES_TIPO_CIRCUITO.map((r) => ({
              text: r.name,
              value: r.id.toString(),
            }))}
            optional
            fullWidth
          />

          {isVisible("client_id") && (
            <div
              onClick={() => {
                setOpenModalCliente(true);
              }}
            >
              <TextField
                id="client_id"
                name="client_id"
                label="Cliente"
                fullWidth
                value={clientName}
                readOnly
                optional
              />
            </div>
          )}

          {/* Estación: se mantiene visible si está en la lista permitida */}
          {isVisible("station_id") && (
            <div
              onClick={() => {
                setOpenModalEstacion(true);
              }}
            >
              <TextField
                id="station_id"
                name="station_id"
                label="Estacion"
                fullWidth
                value={formValues.station_id}
                readOnly
                optional
              />
            </div>
          )}
        </section>

        <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
          <Button variant="secondary" onClick={handleReset}>
            Limpiar
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>
            Buscar
          </Button>
        </footer>
      </div>

      <Modal
        open={openModalCliente}
        onClose={() => {
          setOpenModalCliente(false);
        }}
      >
        <SearchClient
          onSelected={(client) => {
            if (client.id && client.nombreadministrativo) {
              setFormValues((prev) => ({
                ...prev,
                client_id: client.id.toString(),
              }));
              setClientName(client.nombreadministrativo.toString());
            }
          }}
        />
      </Modal>

      <Modal
        open={openModalEstacion}
        onClose={() => {
          setOpenModalEstacion(false);
        }}
      >
        <SearchEstacion
          onSelected={(client) => {
            if (client.id && client.nombre) {
              setFormValues((prev) => ({
                ...prev,
                station_id: client?.idEstacion?.toString(),
              }));
            }
          }}
        />
      </Modal>
    </>
  );
}
