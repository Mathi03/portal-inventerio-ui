"use client";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { RedStatusEnumOptions, RedType } from "@/core/red/red.type";
import { Form, TextField } from "@telefonica/mistica";
export type FormType = keyof Pick<RedType, "label" | "name" | "status">;

export default function Filter({
  onSubmit,
}: {
  onSubmit: (values: Record<FormType, string>) => void;
}) {
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
          de redes
        </p>
      </header>
      <section className="scroller grid gap-4 overflow-auto px-4 pb-4 content-start">
        <TextField
          name={"label" as FormType}
          label="Etiqueta"
          fullWidth
          optional
        />
        <TextField
          name={"name" as FormType}
          label="Nombre"
          fullWidth
          optional
        />
        <Select
          name={"status" as FormType}
          label="Estado"
          options={RedStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
          optional
        />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary">Limpiar</Button>
        <Button>Buscar</Button>
      </footer>
    </Form>
  );
}
