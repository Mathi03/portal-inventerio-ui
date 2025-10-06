import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Aprobar from "@/app/(home)/componente-red/Aprobar";

// Mocks
jest.mock("@/components/Aside", () => ({ children, ...props }: any) => (
  <div data-testid="aside" {...props}>
    {children}
  </div>
));

jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} data-testid="button">
    {props.children}
  </button>
));

jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          approvalComment: "Comentario de prueba",
          observation: "Observación de prueba",
        });
      }}
    >
      {children}
      <button type="submit">Aprobar</button>
    </form>
  ),
  TextField: ({ label, name }: any) => (
    <label>
      {label}
      <input name={name} data-testid={`input-${name}`} />
    </label>
  ),
}));

jest.mock("@/core/componente-red/componente-red.service", () => ({
  ComponenteRedService: jest.fn().mockImplementation(() => ({
    approve: jest.fn().mockResolvedValue({}),
  })),
}));

describe("Aprobar", () => {
  const mockOnSuccess = jest.fn();
  const mockOnClose = jest.fn();
  const componenteRed = { id: 123, name: "CompRed A" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza correctamente el Aside y los campos", () => {
    render(
      <Aprobar
        componenteRed={componenteRed}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByText("Aprobación componente de red")).toBeInTheDocument();
    expect(screen.getByText(/CompRed A/)).toBeInTheDocument();
    expect(screen.getByTestId("input-approvalComment")).toBeInTheDocument();
    expect(screen.getByTestId("input-observation")).toBeInTheDocument();
  });

  it("ejecuta onClose al hacer clic en Cerrar", () => {
    render(
      <Aprobar
        componenteRed={componenteRed}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("Cerrar"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});