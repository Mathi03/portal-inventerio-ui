import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "@/app/(home)/mantenedor-red/Filter";

// Mocks para evitar dependencias reales
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          label: "Red A",
          name: "Nombre A",
          status: "1",
        });
      }}
    >
      {children}
    </form>
  ),
  TextField: ({ label }: any) => <input placeholder={label} />,
}));
jest.mock("@/components/Select", () => (props: any) => (
  <select data-testid="select" {...props} />
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));

describe("Filter", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Filtro de Búsqueda")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seleccione los filtros necesarios antes de consultar sus mantenedores de redes"
      )
    ).toBeInTheDocument();
  });

  it("llama a onSubmit al hacer click en Buscar", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText("Buscar"));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      label: "Red A",
      name: "Nombre A",
      status: "1",
    });
  });
});