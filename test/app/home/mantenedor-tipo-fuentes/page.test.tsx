import React from "react";
import { render, screen } from "@testing-library/react";
import MantenedorFuentePage from "@/app/(home)/mantenedor-tipo-fuentes/page";

// Mocks con rutas corregidas
jest.mock("@/components/Table/Table", () => () => <div>Tabla</div>);
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));
jest.mock("@/components/Icon", () => () => <span>Icono</span>);
jest.mock("@/components/InputSearch", () => () => <div>Buscador</div>);
jest.mock("@/app/(home)/mantenedor-tipo-fuentes/ShowColumns", () => () => <div>Mostrar Columnas</div>);
jest.mock("@/hooks/useStorage", () => () => [
  { id: true, label: true, name: true, status: true },
  jest.fn(),
  false
]);
jest.mock("@/app/(home)/mantenedor-tipo-fuentes/MenuList", () => () => <div>MenuList</div>);
jest.mock("@/app/(home)/mantenedor-tipo-fuentes/create", () => () => <div>Crear</div>);
jest.mock("@/app/(home)/mantenedor-tipo-fuentes/Edit", () => () => <div>Editar</div>);
jest.mock("@telefonica/mistica", () => ({
  Tag: ({ children }: any) => <span>{children}</span>,
  useDialog: () => ({ confirm: jest.fn() }),
  useSnackbar: () => ({ openSnackbar: jest.fn() }),
}));
jest.mock("@/components/Pagination", () => () => <div>Paginación</div>);
jest.mock("@/app/(home)/mantenedor-tipo-fuentes/Filter", () => () => <div>Filtro</div>);
jest.mock("@/core/tipo-fuente/tipo-fuente.service", () => ({
  TipoFuenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({ data: { data: { data: [], total: 0 } } }),
    delete: jest.fn().mockResolvedValue({}),
  })),
}));

describe("MantenedorFuentePage", () => {
  it("renderiza sin errores y muestra elementos clave", () => {
    render(<MantenedorFuentePage />);
    expect(screen.getByText("Tabla")).toBeInTheDocument();
    expect(screen.getByText("Filtro")).toBeInTheDocument();
  });
});