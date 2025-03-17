import Button from "@/components/Button";
import Icon from "@/components/Icon";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox, Form } from "@telefonica/mistica";

export default function ExportXLS() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button
            variant="link"
            StartIcon={() => <Icon icon="cloud_download" />}
          >
            Exportar XLS
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] bg-[white] rounded-[24px]">
        <header className="flex justify-between items-center border-b-[1px] border-[#D1D5E4] py-4">
          <h3 className="text-[24px]">Exportar XLS</h3>
          <Button
            variant="primary"
            StartIcon={() => <Icon icon="cloud_download" />}
          >
            Descargar
          </Button>
        </header>
        <Form onSubmit={console.log} className="mt-4 grid grid-cols-2 gap-4">
          <p className="col-span-2 text-base">
            Selecciones los campos que quieres incluir dentro del XLS
          </p>
          <Checkbox name="codigo">Codigo</Checkbox>
          <Checkbox name="codigo">Componente id</Checkbox>
          <Checkbox name="codigo">Nombre</Checkbox>
          <Checkbox name="codigo">Etiqueta</Checkbox>
          <Checkbox name="codigo">Tipo</Checkbox>
          <Checkbox name="codigo">Red</Checkbox>
          <Checkbox name="codigo">Control</Checkbox>
          <Checkbox name="codigo">Estación</Checkbox>
          <Checkbox name="codigo">Fuente</Checkbox>
          <Checkbox name="codigo">Estado</Checkbox>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
