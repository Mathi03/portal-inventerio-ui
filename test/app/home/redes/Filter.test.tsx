import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "@/app/(home)/redes/Filter";

// Mocks simples para evitar dependencias reales de Mistica
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
  Select: ({ label }: any) => <select aria-label={label}></select>,
  ButtonPrimary: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  ButtonSecondary: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe("@/app/(home)/redes/Filter", () => {
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

  it("llama a onSubmit al enviar el formulario", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText("Buscar"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});