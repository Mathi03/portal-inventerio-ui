"use client";
import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { useParams } from "next/navigation";
import UpdateForm from "./UpdateForm";
import NavMenu from "./NavMenu";

export default function DetalleComponenteRed() {
  const { id } = useParams();
  const [componenteRed, setComponenteRed] = useState<ComponenteRedType | null>(
    null,
  );
  const getComponenteRed = useCallback(async () => {
    const componenteRed = new ComponenteRedService();
    const data = await componenteRed.getById(+id!);
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
        {componenteRed && <UpdateForm componenteRed={componenteRed} />}
      </section>
    </main>
  );
}
