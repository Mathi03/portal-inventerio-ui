import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Edit from "@/app/(home)/mantenedor-tipo-fuentes/Edit";

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
  useSnackbar: () => ({ openSnackbar: jest.fn() }),
}));
jest.mock("@/core/tipo-fuente/tipo-fuente.service", () => ({
  TipoFuenteService: jest.fn().mockImplementation(() => ({
    update: jest.fn().mockResolvedValue({}),
  })),
}));

describe("Edit", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockFuente = { id: 1, label: "Test", name: "Fuente Test", status: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(
      <Edit fuente={mockFuente} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(screen.getByText("Editar mantenedor de fuente")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Actualice todo los datos correspondiente para editar con éxito un mantenedor de fuente"
      )
    ).toBeInTheDocument();
  });

});