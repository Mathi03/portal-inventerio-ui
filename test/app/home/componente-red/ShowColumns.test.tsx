import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShowColumns from "@/app/(home)/componente-red/ShowColumns";

// Mocks
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} data-testid="button">
    {props.children}
  </button>
));
jest.mock("@/components/Icon", () => () => <span>Icon</span>);
jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          codigo: true,
          id: true,
          nombre: true,
          etiqueta: true,
          tipo_componente: true,
          red: true,
          id_control: true,
          id_estacion: true,
          fuente: true,
          status: true,
        });
      }}
    >
      {children}
    </form>
  ),
  Checkbox: ({ name, children }: any) => (
    <label data-testid={`checkbox-${name}`}>{children}</label>
  ),
}));

describe("ShowColumns", () => {
  const mockOnSubmit = jest.fn();
  const mockInitialValues = {
    codigo: true,
    id: true,
    nombre: true,
    etiqueta: true,
    tipo_componente: true,
    red: true,
    id_control: true,
    id_estacion: true,
    fuente: true,
    status: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza título, descripción y checkboxes", () => {
    render(<ShowColumns showColumn={mockInitialValues} onSubmit={mockOnSubmit} />);

    // Título dentro del header
    expect(
      screen.getByRole("heading", { level: 3, name: "Columnas a mostrar" })
    ).toBeInTheDocument();

    // Descripción
    expect(
      screen.getByText("Selecciones los campos que quieres mostrar en la tabla")
    ).toBeInTheDocument();

    // Checkboxes
    Object.keys(mockInitialValues).forEach((key) => {
      expect(screen.getByTestId(`checkbox-${key}`)).toBeInTheDocument();
    });
  });

  it("llama a onSubmit al hacer submit", () => {
    render(<ShowColumns showColumn={mockInitialValues} onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText("Aplicar"));
    expect(mockOnSubmit).toHaveBeenCalledWith(mockInitialValues);
  });
});