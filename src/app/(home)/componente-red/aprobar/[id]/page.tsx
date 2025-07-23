"use client";
import { useCallback, useEffect, useState } from "react";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { useParams } from "next/navigation";
import Header from "@/app/detalle-componente-red/[id]/Header";
import NavMenu from "@/app/detalle-componente-red/[id]/NavMenu";
import UpdateForm from "@/app/detalle-componente-red/[id]/UpdateForm";
import CreateForm from "@/app/crear-componente-red/CreateForm";

export default function AprobarComponenteRed() {
  const { id } = useParams();
  const [componenteRed, setComponenteRed] = useState<ComponenteRedType | null>(
    null,
  );
  const getComponenteRed = useCallback(async () => {
    const componenteRed = new ComponenteRedService();
    const data = await componenteRed.getById(+id!);
    console.log("guillermo", data)
    setComponenteRed(data);
  }, [id]);

  useEffect(() => {
    getComponenteRed();

  }, [getComponenteRed]);
  return (
    <main className="grid grid-rows-[auto_1fr] w-full h-full grid-cols-1">
      <Header componenteRed={componenteRed} />
      <section className="w-full h-full grid gap-2 grid-cols-[280px_1fr] overflow-hidden p-2">
        <NavMenu />
        {componenteRed && <CreateForm componenteRed={componenteRed} mode="approve"/>}
      </section>
    </main>
  );
}
