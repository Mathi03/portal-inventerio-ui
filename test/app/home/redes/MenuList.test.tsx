import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuList from "@/app/(home)/redes/MenuList";

// Mocks simples para evitar dependencias reales
jest.mock("@/components/IconButton", () => (props: any) => (
  <button data-testid="icon-button" {...props}>
    IconButton
  </button>
));
jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));

describe("@/app/(home)/redes/MenuList", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza sin errores", () => {
    render(<MenuList onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("llama a onEdit al hacer click en Editar", () => {
    render(<MenuList onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText("Editar"));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("llama a onDelete al hacer click en Eliminar", () => {
    render(<MenuList onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText("Eliminar"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});