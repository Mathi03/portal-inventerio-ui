import Icon from "@/components/Icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Spinner, TextField } from "@telefonica/mistica";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
const tipoComponenteService = new TipoComponenteService();
export default function DetalleTipoComponente({ id }: { id: number }) {
  const [tipoComponente, setTipoComponente] = useState<TipoComponenteType>();
  const [loading, setLoading] = useState(true);
  const getTipoComponente = useCallback(async () => {
    setLoading(true);
    const { data } = await tipoComponenteService.getById(id);
    setTipoComponente(data.data);
    setLoading(false);
  }, [id]);
  return (
    <Popover onOpenChange={() => !tipoComponente && getTipoComponente()}>
      <PopoverTrigger asChild>
        <div className="bg-[#e5f0ff] text-[#0066ff] flex gap-2 py-1 px-4 items-center rounded-3xl">
          {tipoComponente?.label || id.toString()}{" "}
          <Icon icon="multimodal_hand_eye" style={{ fontSize: "16px" }} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] bg-[white] rounded-[24px]">
        <header className="py-4">
          <h1 className="text-xl">Detalle de tipo de componente</h1>
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
                value={tipoComponente?.label}
                disabled
                fullWidth
              />
              <TextField
                name="name"
                label="Nombre"
                value={tipoComponente?.name}
                disabled
                fullWidth
              />
              <TextField
                name="id"
                label="ID"
                value={tipoComponente?.id.toString()}
                disabled
                fullWidth
              />
              <TextField
                name="label"
                label="Fecha de creación"
                value={dayjs(tipoComponente?.createdAt).format("DD/MM/YYYY")}
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
