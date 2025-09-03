import Select from "@/components/Select";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { useCallback, useEffect, useState } from "react";

export default function SelectTipoComponentes({ name }: { name: string }) {
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );
  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    setTipoComponentes(data.data.data);
    setIsLoadingTC(false);
  }, []);
  useEffect(() => {
    getTipoComponente();
  }, [getTipoComponente]);
  return (
    <Select
      disabled={isLoadingTC}
      name={name}
      label="Tipo de componente"
      options={tipoComponentes
        .filter((tc) => tc.status === 1)
        .map((tc) => ({
          text: tc.label,
          value: tc.id.toString(),
        }))}
      helperText={isLoadingTC ? "cargando tipo de componentes..." : undefined}
      optional
      fullWidth
    />
  );
}
