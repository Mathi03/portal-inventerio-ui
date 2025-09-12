import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Aprobar from "@/app/(home)/mantenedor-tipo-componente/Aprobar";

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
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ commentApproval: "Aprobado" });
      }}
    >
      {children}
    </form>
  ),
  TextField: ({ label }: any) => <textarea placeholder={label} />,
}));
jest.mock("@/core/tipo-componente/tipo-componente.service", () => ({
  TipoComponenteService: jest.fn().mockImplementation(() => ({
    approval: jest.fn().mockResolvedValue({}),
  })),
}));

describe("Aprobar", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockTC = { id: 1, name: "Componente Test" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y el nombre del componente", () => {
    render(<Aprobar tc={mockTC} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(
      screen.getByText(/Aprobación de tipo de componente/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes("Componente Test"))
    ).toBeInTheDocument();
  });
});