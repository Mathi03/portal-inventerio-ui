"use client";
import IconButton from "@/components/IconButton";
import { Avatar, Tabs } from "@telefonica/mistica";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const navigations = useMemo(
    () => [
      "/",
      "/componente-red",
      "/tipo-componentes",
      "/redes",
      "/mantenedor-fuente",
      "/mantenedor-tipo-fuentes",
    ],
    [],
  );
  const onNavigate = useCallback(
    (to: number) => {
      router.push(navigations[to]);
    },
    [router, navigations],
  );
  if (navigations.includes(pathname)) {
    return (
      <header data-testid="header" className="px-14 h-[60px] items-center grid grid-cols-[auto_1fr_auto_auto] gap-6 overflow-hidden bg-white sticky top-0">
        <img src="/logo.svg" alt="telefonica" className="w-6" />
        <Tabs
          selectedIndex={navigations.findIndex((nav) => nav === pathname)}
          onChange={onNavigate}
          tabs={[
            {
              text: "Inicio",
            },
            {
              text: "Componente de redes",
            },
            {
              text: "Tipo componentes",
            },
            {
              text: "Redes",
            },
            {
              text: "Fuentes",
            },
            {
              text: "Tipo Fuentes",
            },
          ]}
        />
        <IconButton icon="notifications_unread" />
        <Avatar
          initials="RM"
          size={40}
          backgroundColor="#0066FF"
          textColor="white"
        />
      </header>
    );
  }
}
