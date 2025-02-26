"use client";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { Form, TextField } from "@telefonica/mistica";

export default function Filter() {
  return (
    <Form
      onSubmit={console.log}
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
        <TextField id="codigo" name="codigo" label="Código" fullWidth />
        <TextField
          id="componente_id"
          name="componente_id"
          label="Componente Id"
          fullWidth
        />
        <TextField id="nombre" name="nombre" label="Nombre" fullWidth />
        <Select
          id="etiqueta"
          name="etiqueta"
          label="Etiqueta"
          options={[
            {
              text: "Option 1",
              value: "1",
            },
          ]}
          fullWidth
        />
        <Select
          id="tipo_componente"
          name="tipo_componente"
          label="Tipo de componente"
          options={[
            {
              text: "Option 1",
              value: "1",
            },
          ]}
          fullWidth
        />
        <Select
          id="status"
          name="status"
          label="Status"
          options={[
            {
              text: "Option 1",
              value: "1",
            },
          ]}
          fullWidth
        />
        <TextField id="red" name="red" label="Red" fullWidth />
        <TextField
          id="id_control"
          name="id_control"
          label="Id Control"
          fullWidth
        />
        <TextField id="fuente" name="fuente" label="Fuente" fullWidth />
      </section>
      <footer className="grid gap-4 grid-cols-2 p-4 border-t-[1px] border-[#eee]">
        <Button variant="secondary">Limpiar</Button>
        <Button>Buscar</Button>
      </footer>
    </Form>
  );
}
