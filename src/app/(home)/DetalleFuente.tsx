import Icon from "@/components/Icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FuenteService } from "@/core/fuente/fuente.service";
import { FuenteType } from "@/core/fuente/fuente.type";
import { Spinner, TextField } from "@telefonica/mistica";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
const fuenteService = new FuenteService();

export default function DetalleFuente({ id }: { id: number }) {
  const [fuente, setFuente] = useState<FuenteType>();
  const [loading, setLoading] = useState(true);
  const getFuente = useCallback(async () => {
    setLoading(true);
    const { data } = await fuenteService.getById(id);
    setFuente(data.data);
    setLoading(false);
  }, [id]);
  return (
    <Popover onOpenChange={() => !fuente && getFuente()}>
      <PopoverTrigger asChild>
        <div className="bg-[#e5f0ff] text-[#0066ff] flex gap-2 py-1 px-4 items-center rounded-3xl">
          {fuente?.label || id.toString()}{" "}
          <Icon icon="multimodal_hand_eye" style={{ fontSize: "16px" }} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] bg-[white] rounded-[24px]">
        <header className="py-4">
          <h1 className="text-xl">Detalle de fuente</h1>
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
                value={fuente?.label}
                disabled
                fullWidth
              />
              <TextField
                name="name"
                label="Nombre"
                value={fuente?.name}
                disabled
                fullWidth
              />
              <TextField
                name="id"
                label="ID"
                value={fuente?.id.toString()}
                disabled
                fullWidth
              />
              <TextField
                name="label"
                label="Fecha de creación"
                value={dayjs(fuente?.createdAt).format("DD/MM/YYYY")}
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
