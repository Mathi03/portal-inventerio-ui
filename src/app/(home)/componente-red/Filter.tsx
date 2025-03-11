"use client";
import Button from "@/components/Button";
import { Form, TextField } from "@telefonica/mistica";
import SelectFuentes from "./SelectFuentes";
import SelectRedes from "./SelectRedes";
import SelectTipoComponentes from "./SelectTipoComponentes";
import SelectRegiones from "./SelectRegiones";
import { QueryComponenteRedDto } from "@/core/componente-red/dto/search.dto";
export type FormFilterType = Omit<
  QueryComponenteRedDto,
  "page" | "limit" | "q"
>;
export type FilterType = keyof FormFilterType;

export default function Filter({
  onFilter,
}: {
  onFilter: (form: FormFilterType) => void;
}) {
  return (
    <Form
      onSubmit={(value) => onFilter(value as FormFilterType)}
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
          name={"id" as FilterType}
          label="Componente Id"
          fullWidth
          optional
        />
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          fullWidth
          optional
        />
        <TextField
          name={"label" as FilterType}
          label="Etiqueta"
          fullWidth
          optional
        />
        <SelectTipoComponentes name={"ref_component_type_id" as FilterType} />
        <SelectRedes name={"ref_network_id" as FilterType} />
        <SelectRegiones name={"region_id" as FilterType} />
        <TextField
          name={"control_id" as FilterType}
          label="Id Control"
          fullWidth
          optional
        />
        <SelectFuentes name={"ref_source_id" as FilterType} />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary">Limpiar</Button>
        <Button>Buscar</Button>
      </footer>
    </Form>
  );
}
