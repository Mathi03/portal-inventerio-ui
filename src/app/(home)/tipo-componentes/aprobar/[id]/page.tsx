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

  const {
    getTipoComponentes,
    allTipoComponente,
    allTipoComponentes,
  } = useTipoComponente({});

  const handleSuccess = useCallback(() => {
    getTipoComponentes({});
  }, [getTipoComponentes]);

  const onError = () => {
    router.push("/tipo-componentes");
  };

  useEffect(() => {
    allTipoComponentes({ idList: [Number(id)], onError });
  }, [allTipoComponentes]);

  useEffect(() => {
    const validateStatus = async () => {
      const tipoComponente = allTipoComponente?.[0];
      if (!tipoComponente || tipoComponente.status === 1) {
        router.push("/tipo-componentes");
      }
    };
    if (allTipoComponente?.length > 0) validateStatus();
  }, [allTipoComponente, router]);

  return (
    <div>
      <Create
        tipoComponente={{ id } as TipoComponenteType}
        onClose={() => router.push("/tipo-componentes")}
        onSuccess={handleSuccess}
        mode="approve"
        allTipoComponente={allTipoComponente}
      />
    </div>
  );
};

export default Aprobar;
