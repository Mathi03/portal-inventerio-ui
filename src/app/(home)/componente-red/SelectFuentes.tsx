import Select from "@/components/Select";
import { FuenteService } from "@/core/fuente/fuente.service";
import { FuenteType } from "@/core/fuente/fuente.type";
import { useCallback, useEffect, useState } from "react";

export default function SelectFuentes({ name }: { name: string }) {
  const [isLoadingFuentes, setIsLoadingFuentes] = useState(true);
  const [fuentes, setFuentes] = useState<FuenteType[]>([]);

  const getFuentes = useCallback(async () => {
    setIsLoadingFuentes(true);
    const fuenteService = new FuenteService();
    const { data } = await fuenteService.findAll({});
    setFuentes(data.data.data);
    setIsLoadingFuentes(false);
  }, []);

  useEffect(() => {
    getFuentes();
  }, [getFuentes]);

  return (
    <Select
      disabled={isLoadingFuentes}
      name={name}
      label="Fuente"
      options={fuentes
        .filter((fuente) => fuente.status === 1)
        .map((fuente) => ({
          text: fuente.label,
          value: fuente.id.toString(),
        }))}
      helperText={isLoadingFuentes ? "cargando fuentes..." : undefined}
      optional
      fullWidth
    />
  );
}
