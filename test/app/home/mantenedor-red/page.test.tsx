import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MantenedorTipoComponentePage from "@/app/(home)/mantenedor-red/page";

// Mocks para evitar dependencias reales
jest.mock("@/components/Table/Table", () => (props: any) => (
  <div data-testid="table">{props.header}{props.pagination}</div>
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} disabled={props.showSpinner}>
    {props.children}
  </button>
));
jest.mock("@/components/Icon", () => () => <span>Icon</span>);
jest.mock("@/components/InputSearch", () => (props: any) => (
  <input
    placeholder="Buscar"
    onChange={(e) => props.onSearch(e.target.value)}
  />
));
jest.mock("@/components/Pagination", () => () => <div>Paginación</div>);
jest.mock("@/components/Aside", () => ({ children }: any) => (
  <div data-testid="aside">{children}</div>
));
jest.mock("@/components/Select", () => () => <select />);
jest.mock("@/hooks/useStorage", () => () => [
  { id: true, label: true, name: true, status: true },
  jest.fn(),
  false,
]);
jest.mock("@telefonica/mistica", () => ({
  Tag: ({ children }: any) => <span>{children}</span>,
  useDialog: () => ({
    confirm: jest.fn(),
  }),
  useSnackbar: () => ({
    openSnackbar: jest.fn(),
  }),
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ label: "Red A", name: "Nombre A", status: "1" });
      }}
    >
      {children}
    </form>
  ),
  TextField: ({ label }: any) => <input placeholder={label} />,
}));
jest.mock("@/core/red/red.service", () => ({
  RedService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [],
          total: 0,
        },
      },
    }),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    detele: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock("@/app/(home)/mantenedor-red/Filter", () => () => <div>Filtro</div>);
jest.mock("@/app/(home)/mantenedor-red/ExportXLS", () => () => <div>ExportXLS</div>);
jest.mock("@/app/(home)/mantenedor-red/ShowColumns", () => (props: any) => (
  <div>ShowColumns</div>
));
jest.mock("@/app/(home)/mantenedor-red/MenuList", () => () => <div>MenuList</div>);
jest.mock("@/app/(home)/mantenedor-red/Create", () => (props: any) => (
  <div data-testid="create-modal">
    <button onClick={props.onClose}>Cerrar modal</button>
    <button onClick={props.onSuccess}>Confirmar creación</button>
  </div>
));
jest.mock("@/app/(home)/mantenedor-red/Edit", () => () => <div>Editar</div>);

describe("MantenedorTipoComponentePage", () => {
  it("renderiza el título principal", async () => {
    render(<MantenedorTipoComponentePage />);
    expect(screen.getByText("Mantenedor de Redes")).toBeInTheDocument();
    expect(screen.getByText("Crear")).toBeInTheDocument();
  });

});