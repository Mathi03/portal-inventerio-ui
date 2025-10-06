import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComponenteRedPage from "@/app/(home)/componente-red/page";

// Mocks
jest.mock("@/components/Table/Table", () => (props: any) => (
  <div data-testid="table">{props.header}{props.pagination}</div>
));

jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));

jest.mock("@/components/Icon", () => (props: any) => (
  <span>{props.icon}</span>
));

jest.mock("@/components/InputSearch", () => (props: any) => (
  <input
    placeholder="Buscar"
    onChange={(e) => props.onSearch(e.target.value)}
  />
));

jest.mock("@/components/Pagination", () => () => (
  <div data-testid="pagination">Paginación</div>
));

jest.mock("@/components/ShowColumns", () => () => (
  <div data-testid="show-columns">ShowColumns</div>
));

jest.mock("@/app/(home)/componente-red/ExportXLS", () => () => (
  <div data-testid="export-xls">ExportXLS</div>
));

jest.mock("@/app/(home)/componente-red/Filter", () => () => (
  <div data-testid="filter">Filter</div>
));

jest.mock("@/app/(home)/componente-red/MenuList", () => () => (
  <div data-testid="menu-list">MenuList</div>
));

jest.mock("@/app/(home)/componente-red/Aprobar", () => () => (
  <div data-testid="aprobar">Aprobar</div>
));

jest.mock("@/core/componente-red/componente-red.service", () => ({
  ComponenteRedService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            {
              id: 1,
              controlName: "Comp A",
              controlLabel: "Etiqueta A",
              regionId: 10,
              refComponentTypeId: 100,
              refNetworkId: 200,
              refSourceId: 300,
              controlId: 400,
              stationId: 500,
              status: 1,
            },
          ],
          total: 1,
        },
      },
    }),
    getByClientId: jest.fn().mockResolvedValue({ data: { data: { data: [], total: 0 } } }),
    detele: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock("@telefonica/mistica", () => ({
  Tag: ({ children }: any) => <span>{children}</span>,
  useDialog: () => ({
    confirm: jest.fn(),
  }),
  useSnackbar: () => ({
    openSnackbar: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/hooks/useStorage", () => () => [
  {
    id: true,
    controlName: true,
    controlLabel: true,
    regionId: true,
    refComponentTypeId: true,
    refNetworkId: true,
    refSourceId: true,
    controlId: true,
    stationId: true,
  },
  jest.fn(),
  false,
]);

describe("ComponenteRedPage", () => {
  it("renderiza título, botones y tabla", async () => {
    render(<ComponenteRedPage />);

    expect(screen.getByText("Componente de redes")).toBeInTheDocument();
    expect(screen.getByText("Crear")).toBeInTheDocument();
    expect(screen.getByText("Cerrar Filtros")).toBeInTheDocument();
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByTestId("filter")).toBeInTheDocument();

  });

  it("oculta filtros al hacer clic en 'Cerrar Filtros'", () => {
    render(<ComponenteRedPage />);
    fireEvent.click(screen.getByText("Cerrar Filtros"));
    expect(screen.queryByTestId("filter")).toBeNull(); // Estado no simulado
  });
});