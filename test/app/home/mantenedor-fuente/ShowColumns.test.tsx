import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShowColumns from "@/app/(home)/mantenedor-fuente/ShowColumns";

// Mocks para evitar dependencias reales
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
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
        onSubmit({
          id: true,
          label: true,
          name: true,
          refComponentTypeId: true,
          refNetworkId: true,
          version: true,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y los campos", () => {
    render(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    expect(screen.getByText("Columnas a mostrar")).toBeInTheDocument();
    expect(
      screen.getByText("Selecciones los campos que quieres mostrar en la tabla")
    ).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-id")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-label")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-name")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-refComponentTypeId")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-refNetworkId")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-version")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-status")).toBeInTheDocument();
  });

  it("llama a onSubmit al hacer click en Aplicar", () => {
    render(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    fireEvent.click(screen.getByText("Aplicar"));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: true,
      label: true,
      name: true,
      refComponentTypeId: true,
      refNetworkId: true,
      version: true,
      status: true,
    });
  });
});