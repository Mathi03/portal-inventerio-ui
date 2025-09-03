import Button from "@/components/Button";
import Icon from "@/components/Icon";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FuenteType } from "@/core/fuente/fuente.type";
import { Checkbox, Form } from "@telefonica/mistica";
import { useState } from "react";
export type FormType = keyof Pick<
  FuenteType,
  | "id"
  | "label"
  | "name"
  | "status"
  | "refNetworkId"
  | "refComponentTypeId"
  | "version"
>;
export default function ExportXLS() {
  const [form] = useState({
    id: true,
    label: true,
    name: true,
    status: true,
    refNetworkId: true,
    refComponentTypeId: true,
    version: true,
    attribute: true,
  } as Record<FormType, boolean>);
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
      <PopoverContent className="w-[420px] bg-[white] rounded-[8px]">
        <header className="flex justify-between items-center border-b-[1px] border-[#D1D5E4] py-4">
          <h3 className="text-[24px]">Exportar XLS</h3>
          <Button
            variant="primary"
            StartIcon={() => <Icon icon="cloud_download" />}
          >
            Descargar
          </Button>
        </header>
        <Form
          onSubmit={console.log}
          className="mt-4 grid grid-cols-2 gap-4"
          initialValues={form}
        >
          <p className="col-span-2 text-base">
            Selecciones los campos que quieres incluir dentro del XLS
          </p>
          <Checkbox name={"id" as FormType}>Id</Checkbox>
          <Checkbox name={"label" as FormType}>Etiqueta</Checkbox>
          <Checkbox name={"name" as FormType}>Nombre</Checkbox>
          <Checkbox name={"refComponentTypeId" as FormType}>
            Tipo de componente
          </Checkbox>
          <Checkbox name={"refNetworkId" as FormType}>Red</Checkbox>
          <Checkbox name={"version" as FormType}>Versión</Checkbox>
          <Checkbox name={"status" as FormType}>Estado</Checkbox>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
