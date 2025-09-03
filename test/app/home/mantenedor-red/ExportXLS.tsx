import Button from "@/components/Button";
import Icon from "@/components/Icon";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RedType } from "@/core/red/red.type";
import { Checkbox, Form } from "@telefonica/mistica";
import { useMemo, useState } from "react";
export type FormType = keyof Pick<RedType, "id" | "label" | "name" | "status">;
export default function ExportXLS() {
  const [form, setForm] = useState({
    id: true,
    label: true,
    name: true,
    status: true,
  } as Record<FormType, boolean>);
  const canSubmit = useMemo(() => {
    return form.id || form.label || form.name || form.status;
  }, [form]);
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
            disabled={!canSubmit}
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
          <Checkbox
            name={"id" as FormType}
            onChange={(checked) => setForm({ ...form, id: checked })}
          >
            Id
          </Checkbox>
          <Checkbox
            name={"label" as FormType}
            onChange={(checked) => setForm({ ...form, label: checked })}
          >
            Etiqueta
          </Checkbox>
          <Checkbox
            name={"name" as FormType}
            onChange={(checked) => setForm({ ...form, name: checked })}
          >
            Nombre
          </Checkbox>
          <Checkbox
            name={"status" as FormType}
            onChange={(checked) => setForm({ ...form, status: checked })}
          >
            Estado
          </Checkbox>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
