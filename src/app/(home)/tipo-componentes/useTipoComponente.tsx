import { CreateTipoComponenteDto } from "@/core/tipo-componente/dto/create.dto";
import { UpdateTipoComponenteDto } from "@/core/tipo-componente/dto/updatev2.dto";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import {
  AllTipoComponenteResponse,
  TipoComponenteType,
} from "@/core/tipo-componente/tipo-componente.type";
import { useSnackbar } from "@telefonica/mistica";
import { useCallback, useState } from "react";
const tipoComponenteService = new TipoComponenteService();

export default function useTipoComponente() {
  const { openSnackbar } = useSnackbar();
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    []
  );
  const [allTipoComponente, setAllTipoComponente] = useState<
    AllTipoComponenteResponse[]
  >([]);
  const [tipoComponente, setTipoComponente] = useState<TipoComponenteType>();
  const [tipoComponenteCount, setTipoComponenteCount] = useState<number>(10);
  const [loadingTipoComponentes, setLoadingTipoComponentes] = useState(true);

  const createTipoComponente = useCallback(
    async (dto: CreateTipoComponenteDto) => {
      await tipoComponenteService
        .create(dto)
        .then(() =>
          openSnackbar({
            message: `Tipo de componente "${dto.createRefComponentTypeRequestDto.name ?? ""}" creado`,
          })
        )
        .catch(() => {
          openSnackbar({
            message: `Ha ocurrido un error al momento de crear el tipo de componente "${name}"`,
            type: "CRITICAL",
          });
        });
    },
    [openSnackbar]
  );

  const getTipoComponentes = useCallback(
    async ({
      search,
      page,
      limit,
    }: {
      search?: string | null;
      page?: number;
      limit?: number;
    }) => {
      setLoadingTipoComponentes(true);
      const { data } = await tipoComponenteService.findAll({
        page,
        limit,
        q: search,
      });
      setTipoComponentes(data.data.data);
      setTipoComponenteCount(data.data.total);
      setLoadingTipoComponentes(false);
    },
    []
  );

  const allTipoComponentes = useCallback(
    async ({ idList }: { idList: Number[] }) => {
      setLoadingTipoComponentes(true);
      const { data } = await tipoComponenteService.All({ idList: idList });
      setAllTipoComponente(data);
    },
    []
  );
  const updateTipoComponente = useCallback(
    async (id: number, dto: UpdateTipoComponenteDto) => {
      await tipoComponenteService
        .update(id, dto)
        .then(() =>
          openSnackbar({
            message: `Tipo componente "${dto.updateRefComponentTypeRequestDto.name ?? ''}" actualizado`,
          })
        )
        .catch(() =>
          openSnackbar({
            message: `Ha ocurrido un error al momento de actualizar el tipo de componente "${name}"`,
            type: "CRITICAL",
          })
        );
    },
    [openSnackbar]
  );

  const deleteTipoComponente = useCallback(
    async (id: number, name: string) => {
      await tipoComponenteService
        .detele(id)
        .then(() =>
          openSnackbar({ message: `Tipo componente "${name}" eliminado` })
        )
        .catch(() =>
          openSnackbar({
            message: `Ha ocurrido un error al momento de eliminar el tipo componente "${name}"`,
            type: "CRITICAL",
          })
        );
    },
    [openSnackbar]
  );

  return {
    tipoComponente,
    tipoComponentes,
    tipoComponenteCount,
    loadingTipoComponentes,
    setTipoComponente,
    getTipoComponentes,
    createTipoComponente,
    updateTipoComponente,
    deleteTipoComponente,
    allTipoComponentes,
    allTipoComponente,
  };
}
