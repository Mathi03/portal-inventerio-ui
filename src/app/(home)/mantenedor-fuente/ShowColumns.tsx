import Button from "@/components/Button";
import Icon from "@/components/Icon";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FuenteType } from "@/core/fuente/fuente.type";
import { Checkbox, Form, FormValues } from "@telefonica/mistica";

export type ShowColumnType = keyof FuenteType;

export default function ShowColumns({
  showColumn,
  onSubmit,
}: {
  showColumn?: FormValues;
  onSubmit: (values: Record<ShowColumnType, boolean>) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button variant="link" StartIcon={() => <Icon icon="table_eye" />}>
            Columnas
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] bg-[white] rounded-[8px]">
        <Form
          onSubmit={(value) =>
            onSubmit(value as Record<ShowColumnType, boolean>)
          }
          className="grid grid-cols-2 gap-4"
          initialValues={{ ...showColumn }}
        >
          <header className="flex justify-between items-center border-b-[1px] border-[#D1D5E4] py-4 col-span-2">
            <h3 className="text-[24px]">Columnas a mostrar</h3>
            <Button
              variant="primary"
              StartIcon={() => <Icon icon="table_eye" />}
            >
              Aplicar
            </Button>
          </header>
          <p className="col-span-2 text-base">
            Selecciones los campos que quieres mostrar en la tabla
          </p>
          <Checkbox name={"id" as ShowColumnType}>Id</Checkbox>
          <Checkbox name={"label" as ShowColumnType}>Etiqueta</Checkbox>
          <Checkbox name={"name" as ShowColumnType}>Nombre</Checkbox>
          <Checkbox name={"refComponentTypeId" as ShowColumnType}>
            Tipo de componente
          </Checkbox>
          <Checkbox name={"refNetworkId" as ShowColumnType}>Red</Checkbox>
          <Checkbox name={"version" as ShowColumnType}>Versión</Checkbox>
          <Checkbox name={"status" as ShowColumnType}>Estado</Checkbox>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
