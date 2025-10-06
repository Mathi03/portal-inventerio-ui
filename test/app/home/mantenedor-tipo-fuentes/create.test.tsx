import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Create from "@/app/(home)/mantenedor-tipo-fuentes/create";

// Mocks para evitar dependencias reales
jest.mock("@/components/Aside", () => ({ children, ...props }: any) => (
  <div data-testid="aside" {...props}>
    {children}
  </div>
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));
jest.mock("@/components/Select", () => (props: any) => (
  <select data-testid="select" {...props} />
));
jest.mock("@telefonica/mistica", () => ({
  TextField: ({ label, value, onChangeValue }: any) => (
    <input
      placeholder={label}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
    />
  ),
  useSnackbar: () => ({ openSnackbar: jest.fn() }),
}));
jest.mock("@/core/tipo-fuente/tipo-fuente.service", () => ({
  TipoFuenteService: jest.fn().mockImplementation(() => ({
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
      screen.getByText("Crear mantenedor de tipo fuente")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ingrese todos los datos correspondientes para crear con éxito un mantenedor de tipo fuente"
      )
    ).toBeInTheDocument();
  });


});