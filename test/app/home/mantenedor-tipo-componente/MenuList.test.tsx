import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuList from "@/app/(home)/mantenedor-tipo-componente/MenuList";

// Mocks para evitar dependencias reales
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

describe("MenuList", () => {
  const mockOnEdit = jest.fn();
  const mockOnApproval = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza las opciones básicas", () => {
    render(
      <MenuList
        tc={{ status: 1 } as any}
        onEdit={mockOnEdit}
        onApproval={mockOnApproval}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("renderiza la opción Aprobar si el status es 0", () => {
    render(
      <MenuList
        tc={{ status: 0 } as any}
        onEdit={mockOnEdit}
        onApproval={mockOnApproval}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByText("Aprobar")).toBeInTheDocument();
  });

  it("llama a onEdit al hacer click en Editar", () => {
    render(
      <MenuList
        tc={{ status: 1 } as any}
        onEdit={mockOnEdit}
        onApproval={mockOnApproval}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByText("Editar"));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("llama a onApproval si el status es 0", () => {
    render(
      <MenuList
        tc={{ status: 0 } as any}
        onEdit={mockOnEdit}
        onApproval={mockOnApproval}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByText("Aprobar"));
    expect(mockOnApproval).toHaveBeenCalledTimes(1);
  });

  it("llama a onDelete al hacer click en Eliminar", () => {
    render(
      <MenuList
        tc={{ status: 1 } as any}
        onEdit={mockOnEdit}
        onApproval={mockOnApproval}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByText("Eliminar"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});