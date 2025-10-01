import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuList from "@/app/(home)/mantenedor-red/MenuList";

// Mocks para evitar dependencias reales
jest.mock("@/components/IconButton", () => (props: any) => (
  <button data-testid="icon-button">{props.icon}</button>
));
jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));

describe("MenuList", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza los botones Editar y Eliminar", () => {
    render(<MenuList onEdit={mockOnEdit} onDelete={mockOnDelete} />);
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

  it("no rompe si onDelete no está definido", () => {
    render(<MenuList onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText("Eliminar")); // No debe lanzar error
    expect(mockOnEdit).not.toHaveBeenCalledWith("Eliminar");
  });
});