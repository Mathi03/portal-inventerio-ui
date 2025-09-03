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

export default function useTipoComponente({
  onSuccess,
  onClose,
  setCreating,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
  setCreating?: any;
}) {
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
      try {
        await tipoComponenteService.create(dto);
        openSnackbar({
          message: `Tipo de componente "${dto.createRefComponentTypeRequestDto.name ?? ""}" creado`,
        });
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } catch (err) {
        openSnackbar({
          message: `Ha ocurrido un error al momento de crear el tipo de componente "${name}"`,
          type: "CRITICAL",
        });
      } finally {
        if (setCreating) setCreating(false);
      }
    },
    [openSnackbar, onSuccess, onClose]
  );

  const getTipoComponentes = useCallback(
    async (params: {
      search?: string | null;
      page?: number;
      limit?: number;
      [key: string]: any;
    }) => {
      setLoadingTipoComponentes(true);

      const { search, ...restFilters } = params;

      const cleanedFilters = Object.fromEntries(
        Object.entries(restFilters).filter(
          ([, value]) => value !== "" && value !== null
        )
      );

      const { data } = await tipoComponenteService.findAll({
        q: search,
        ...cleanedFilters,
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
      try {
        await tipoComponenteService.update(id, dto);
        openSnackbar({
          message: `Tipo componente "${dto.updateRefComponentTypeRequestDto.name ?? ""}" actualizado`,
        });
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } catch (err) {
        openSnackbar({
          message: `Ha ocurrido un error al momento de actualizar el tipo de componente "${name}"`,
          type: "CRITICAL",
        });
      } finally {
        if (setCreating) setCreating(false);
      }
    },
    [openSnackbar, onSuccess, onClose]
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
