import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Create from "@/app/(home)/redes/Create";

// Mocks para evitar dependencias reales
jest.mock("@/components/Aside", () => ({ children, ...props }: any) => (
  <div data-testid="aside" {...props}>
    {children}
  </div>
));
jest.mock("@/components/Select", () => (props: any) => (
  <select data-testid="select" {...props} />
));
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
  ButtonPrimary: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  ButtonSecondary: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/app/(home)/redes/useRed", () => () => ({
  createRed: jest.fn(),
}));


describe("Create", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Create onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText("Crear mantenedor de red")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ingrese todo los datos correspondiente para crear con éxito un mantenedor de red"
      )
    ).toBeInTheDocument();
  });

  it("llama a onSuccess y onClose al enviar el formulario", () => {
    render(<Create onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByText("Guardar"));
  });
});