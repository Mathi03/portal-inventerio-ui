import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShowColumns from "@/app/(home)/mantenedor-tipo-componente/ShowColumns";

// Mocks para evitar dependencias reales
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));
jest.mock("@/components/Icon", () => () => <span>Icon</span>);
jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({});
      }}
    >
      {children}
    </form>
  ),
  Checkbox: ({ children }: any) => <label>{children}</label>,
}));

describe("ShowColumns", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    expect(screen.getByText("Columnas")).toBeInTheDocument();
    expect(screen.getByText("Columnas a mostrar")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Selecciones los campos que quieres mostrar en la tabla"
      )
    ).toBeInTheDocument();
  });

  it("llama a onSubmit al hacer click en Aplicar", () => {
    render(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    fireEvent.click(screen.getByText("Aplicar"));
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});