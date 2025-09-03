import Select from "@/components/Select";
import { msDirecciones } from "@/core/config";
import { RegionType } from "@/core/region/region.type";
import { useCallback, useEffect, useState } from "react";

export default function SelectRegiones({ name }: { name: string }) {
  const [isLoadingRegiones, setIsLoadingRegiones] = useState(true);
  const [regiones, setRegiones] = useState<RegionType[]>([]);
  const getRegiones = useCallback(async () => {
    setIsLoadingRegiones(true);
    const { data } = await msDirecciones
      .get("/api/v1/direcciones/regiones", {
        timeout: 2000,
      })
      .catch((err) => err);
    setRegiones(
      data?.data?.regiones || [
        {
          id: 1,
          nombre: "Gran Caracas",
        },
      ],
    );
    setIsLoadingRegiones(false);
  }, []);
  useEffect(() => {
    getRegiones();
  }, [getRegiones]);
  return (
    <Select
      name={name}
      label="Región"
      disabled={isLoadingRegiones}
      options={regiones.map((region) => ({
        text: region.nombre,
        value: region.id.toString(),
      }))}
      helperText={isLoadingRegiones ? "cargando regiones..." : undefined}
      optional
      fullWidth
    />
  );
}
