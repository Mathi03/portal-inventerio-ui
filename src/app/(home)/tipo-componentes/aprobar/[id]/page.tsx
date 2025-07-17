"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Create from "../../Create";
import useTipoComponente from "../../useTipoComponente";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";

const Aprobar = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const { getTipoComponentes } = useTipoComponente();
  const tipoComponenteService = new TipoComponenteService();

  const fetchTipoComponente = useCallback(async () => {
    try {
      const response = await tipoComponenteService.All({ idList: [id] });
      const tipoComponente = response?.data?.[0];

      if (!tipoComponente || tipoComponente.status === 1) {
        router.push("/tipo-componentes");
      }
    } catch (error) {
      console.error("Error al obtener el tipo de componente:", error);
      router.push("/tipo-componentes");
    }
  }, [id, tipoComponenteService, router]);

  const handleSuccess = useCallback(() => {
    getTipoComponentes({});
  }, [getTipoComponentes]);

  useEffect(() => {
    fetchTipoComponente();
  }, [fetchTipoComponente]);

  return (
    <div>
      <Create
        tipoComponente={{ id } as TipoComponenteType}
        onClose={() => router.push("/tipo-componentes")}
        onSuccess={handleSuccess}
        mode="approve"
      />
    </div>
  );
};

export default Aprobar;
