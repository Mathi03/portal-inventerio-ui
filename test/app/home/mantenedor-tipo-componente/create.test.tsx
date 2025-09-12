import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Create from "@/app/(home)/mantenedor-tipo-componente/create";

// Mocks para evitar dependencias reales
jest.mock("@/components/Aside", () => ({ children, ...props }: any) => (
  <div data-testid="aside" {...props}>
    {children}
  </div>
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} disabled={props.showSpinner}>
    {props.children}
  </button>
));
jest.mock("@/components/InputJson", () => () => <div>InputJson</div>);
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
  TextField: ({ label }: any) => <input placeholder={label} />,
}));
jest.mock("@/core/tipo-componente/tipo-componente.service", () => ({
  TipoComponenteService: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({}),
  })),
}));

describe("Create", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Create onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(
      screen.getByText("Crear mantenedor de tipo de componente")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ingrese todo los datos correspondiente para crear con éxito un mantenedor de tipo de componente"
      )
    ).toBeInTheDocument();
  });

});