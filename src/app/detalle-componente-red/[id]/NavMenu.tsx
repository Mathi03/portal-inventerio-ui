"use client";
import { Accordion, AccordionItem } from "@telefonica/mistica";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  href: string;
};

const navItems: Record<string, NavItem[]> = {
  "Información Basíca": [
    {
      title: "Datos del componente de red",
      href: "/estaciones/[id]/info-basica",
    },
    { title: "Control", href: "/estaciones/[id]/info-basica-test" },
    {
      title: "Configuración adicional",
      href: "/estaciones/[id]/info-basica-test1",
    },
  ],
};

export default function NavMenu() {
  const pathname = usePathname();
  const stationId = pathname.split("/")[2];

  const isActive = (href: string) => {
    const fullPath = href.replace("[id]", stationId);
    return pathname === fullPath;
  };

  return (
    <nav className="w-full h-full bg-white border-[#dddd] border-[1px] border-solid overflow-auto content-start rounded-[8px] scroller">
      <header className="px-4 py-8 border-[#dddd] border-b-[1px] border-solid sticky top-0 bg-white z-10">
        <h5 className="text-2xl">Navegacion</h5>
      </header>
      <Accordion defaultIndex={0}>
        {Object.entries(navItems).map(([section, items]) => (
          <AccordionItem
            key={section}
            title={section}
            content={
              <ul className="grid gap-4">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href.replace("[id]", stationId)}>
                      <span
                        className={`text-lg rounded-2xl ${isActive(item.href) ? "font-semibold text-[#0066FF]" : ""}`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            }
          />
        ))}
      </Accordion>
    </nav>
  );
}
