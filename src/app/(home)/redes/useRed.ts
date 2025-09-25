import { CreateRedDto } from "@/core/red/dto/create.dto";
import { UpdateRedDto } from "@/core/red/dto/update.dto";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";
import { useSnackbar } from "@telefonica/mistica";
import axios from "axios";
import { useCallback, useState } from "react";
const redService = new RedService();

export default function useRed() {
  const { openSnackbar } = useSnackbar();
  const [redes, setRedes] = useState<RedType[]>([]);
  const [red, setRed] = useState<RedType>();
  const [redCount, setRedCount] = useState<number>(10);
  const [loadingRedes, setLoadingRedes] = useState(true);

  const createRed = useCallback(
    async ({ label, name, status }: CreateRedDto) => {
      await redService
        .create({ label, name, status: +status })
        .then(() =>
          openSnackbar({
            message: `Red "${name}" creado`,
          })
        )
        .catch(() => {
          openSnackbar({
            message: `Ha ocurrido un error al momento de crear la red "${name}"`,
            type: "CRITICAL",
          });
        });
    },
    [openSnackbar]
  );

  const getRedes = useCallback(
    async ({
      search,
      page,
      limit,
    }: {
      search?: string | null;
      page?: number;
      limit?: number;
    }) => {
      setLoadingRedes(true);
      try {
        const { data } = await redService.findAll({ page, limit, q: search });
        setRedes(data.data.data);
        setRedCount(data.data.total);
      } catch (err) {
        openSnackbar({
          message:
            axios.isAxiosError(err) && err.response
              ? errorMessageInAPI
              : errorGeneric,
          type: "CRITICAL",
        });
      } finally {
        setLoadingRedes(false);
      }
    },
    [openSnackbar]
  );

  const updateRed = useCallback(
    async (id: number, { label, name, status }: UpdateRedDto) => {
      await redService
        .update(id, {
          label,
          name,
          status: +status,
        })
        .then(() =>
          openSnackbar({
            message: `Red ${name} actualizado`,
          })
        )
        .catch(() =>
          openSnackbar({
            message: `Ha ocurrido un error al momento de actualizar la red "${name}"`,
            type: "CRITICAL",
          })
        );
    },
    [openSnackbar]
  );

  const deteleRed = useCallback(
    async (id: number, name: string) => {
      await redService
        .detele(id)
        .then(() => openSnackbar({ message: `Red "${name}" eliminado` }))
        .catch(() =>
          openSnackbar({
            message: `Ha ocurrido un error al momento de eliminar la red "${name}"`,
            type: "CRITICAL",
          })
        );
    },
    [openSnackbar]
  );

  return {
    loadingRedes,
    redes,
    red,
    redCount,
    setRed,
    createRed,
    getRedes,
    deteleRed,
    updateRed,
  };
}
