import Icon from "@/components/Icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ControlService } from "@/core/control/control.service";
import { ControlType } from "@/core/control/control.type";
import { Spinner, TextField } from "@telefonica/mistica";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
const controlService = new ControlService();

export default function DetalleControl({ id }: { id: number }) {
  const [control, setControl] = useState<ControlType>();
  const [loading, setLoading] = useState(true);
  const getControl = useCallback(async () => {
    setLoading(true);
    const data = await controlService.findById(id);
    setControl(data);
    setLoading(false);
  }, [id]);
  return (
    <Popover onOpenChange={() => !control && getControl()}>
      <PopoverTrigger asChild>
        <div className="bg-[#e5f0ff] text-[#0066ff] flex gap-2 py-1 px-4 items-center rounded-3xl">
          {control?.label || id.toString()}{" "}
          <Icon icon="multimodal_hand_eye" style={{ fontSize: "16px" }} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] bg-[white] rounded-[24px]">
        <header className="py-4">
          <h1 className="text-xl">Detalle del control</h1>
        </header>
        <section className="grid grid-cols-2 gap-2 w-full mt-4">
          {loading && (
            <div className="flex justify-center w-full col-span-2 p-6">
              <Spinner size={56} />
            </div>
          )}
          {!loading && (
            <>
              <TextField
                name="label"
                label="Etiqueta"
                value={control?.label}
                disabled
                fullWidth
              />
              <TextField
                name="name"
                label="Nombre"
                value={control?.name}
                disabled
                fullWidth
              />
              <TextField
                name="id"
                label="ID"
                value={control?.id.toString()}
                disabled
                fullWidth
              />
              <TextField
                name="label"
                label="Fecha de creación"
                value={dayjs(control?.createdAt).format("DD/MM/YYYY")}
                disabled
                fullWidth
              />
            </>
          )}
        </section>
      </PopoverContent>
    </Popover>
  );
}
