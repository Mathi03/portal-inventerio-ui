"use client";
import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { useParams } from "next/navigation";
import NavMenu from "./NavMenu";
import CreateForm from "@/app/crear-componente-red/CreateForm";
import useErrorHandler from '@/hooks/useErrorHandler';

export default function DetalleComponenteRed() {
  const { id } = useParams();
  const [componenteRed, setComponenteRed] = useState<ComponenteRedType | null>(
    null,
  );
  const { notifyError } = useErrorHandler(
    'No se pudo obtener el detalle del componente.'
  );
  const getComponenteRed = useCallback(async () => {
    if (!id) return;

    try {
      const componenteRedService = new ComponenteRedService();
      const data = await componenteRedService.getById(+id);
      setComponenteRed(data);
    } catch (error) {
      setComponenteRed(null);
      notifyError(error);
    }
  }, [id, notifyError]);

  useEffect(() => {
    getComponenteRed();

  }, [getComponenteRed]);
  return (
    <main className="grid grid-rows-[auto_1fr] w-full h-full grid-cols-1">
      <Header componenteRed={componenteRed} />
      <section className="w-full h-full grid gap-2 grid-cols-[280px_1fr] overflow-hidden p-2">
        <NavMenu />
        {componenteRed && <CreateForm mode="update" componenteRed={componenteRed} />}
      </section>
    </main>
  );
}
