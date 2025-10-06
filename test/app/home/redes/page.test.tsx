import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import MantenedorRedPage from "@/app/(home)/redes/page";

// Mocks simples para todos los subcomponentes y hooks
jest.mock("@/app/(home)/redes/Filter", () => () => <div>Filtro</div>);
jest.mock("@/app/(home)/redes/Edit", () => () => <div>Editar</div>);
jest.mock("@/app/(home)/redes/Create", () => () => <div>Crear</div>);
jest.mock("@/app/(home)/redes/MenuList", () => () => <div>Menú Lista</div>);
jest.mock("@/app/(home)/redes/ExportXLS", () => () => <div>Exportar XLS</div>);
jest.mock("@/app/(home)/redes/ShowColumns", () => () => <div>Mostrar Columnas</div>);
jest.mock("@/app/(home)/redes/useRed", () => () => ({
  redes: [],
  loadingRedes: false,
  red: null,
  redCount: 0,
  getRedes: jest.fn(),
  setRed: jest.fn(),
  deteleRed: jest.fn(),
}));
jest.mock("@/app/(home)/redes/useColumn", () => () => ({
  columns: () => [],
  showColumn: {},
  setShowColumn: jest.fn(),
}));
jest.mock("@/app/(home)/ButtonFilter", () => () => <div>Botón Filtro</div>);
jest.mock("@/components/Table/Table", () => () => <div>Tabla</div>);
jest.mock("@/components/Pagination", () => () => <div>Paginación</div>);
jest.mock("@/components/InputSearch", () => () => <div>Buscador</div>);
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));
jest.mock("@/components/Icon", () => () => <span>Icono</span>);
jest.mock("@/hooks/usePagination", () => () => ({
  page: 1,
  limit: 10,
  setPage: jest.fn(),
  setLimit: jest.fn(),
}));
jest.mock("@telefonica/mistica", () => ({
  useDialog: () => ({ confirm: jest.fn() }),
  ThemeContextProvider: ({ children }: any) => <div>{children}</div>,
  getTelefonicaSkin: jest.fn(() => "movistar"),
}));


describe("MantenedorRedPage", () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(
      <ThemeContextProvider
        theme={{
          skin: getTelefonicaSkin(),
          i18n: { locale: "es-ES", phoneNumberFormattingRegionKey: "ES" },
          colorScheme: "light",
        }}
      >
        {ui}
      </ThemeContextProvider>
    );

  it("renderiza sin errores", () => {
    renderWithTheme(<MantenedorRedPage />);
    expect(screen.getByText("Tabla")).toBeInTheDocument();
    expect(screen.getByText("Filtro")).toBeInTheDocument();
  });
});