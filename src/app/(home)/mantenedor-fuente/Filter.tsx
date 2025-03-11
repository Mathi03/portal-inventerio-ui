"use client";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { FuenteStatusEnumOptions, FuenteType } from "@/core/fuente/fuente.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
export type FormType = keyof Pick<
  FuenteType,
  | "label"
  | "name"
  | "status"
  | "version"
  | "refNetworkId"
  | "refComponentTypeId"
>;

export default function Filter({
  onSubmit,
}: {
  onSubmit: (values: Record<FormType, string>) => void;
}) {
  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );
  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    setRedes(data.data.data);
    setIsLoadingRed(false);
  }, []);
  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    setTipoComponentes(data.data.data);
    setIsLoadingTC(false);
  }, []);
  useEffect(() => {
    getRedes();
  }, [getRedes]);

  useEffect(() => {
    getTipoComponente();
  }, [getTipoComponente]);
  return (
    <Form
      onSubmit={(value) => onSubmit(value as Record<FormType, string>)}
      className="max-w-[360px] bg-white grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden rounded-[8px] "
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
        <TextField name={"label" as FormType} label="Etiqueta" fullWidth />
        <TextField name={"name" as FormType} label="Nombre" fullWidth />
        <Select
          disabled={isLoadingTC}
          name={"refComponentTypeId" as FormType}
          label="Tipo de componente"
          options={tipoComponentes.map((tc) => ({
            text: tc.label,
            value: tc.id.toString(),
          }))}
          fullWidth
        />
        <Select
          disabled={isLoadingRedes}
          name={"refNetworkId" as FormType}
          label="Red"
          options={redes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
          fullWidth
        />
        <Select
          name={"status" as FormType}
          label="Estado"
          options={FuenteStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        <TextField name={"version" as FormType} label="Versión" fullWidth />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary">Limpiar</Button>
        <Button>Buscar</Button>
      </footer>
    </Form>
  );
}
