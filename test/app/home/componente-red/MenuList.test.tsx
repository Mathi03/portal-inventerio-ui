import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuList from "@/app/(home)/componente-red/MenuList";

// Mock de IconButton
jest.mock("@/components/IconButton", () => (props: any) => (
  <button data-testid="icon-button" onClick={props.onClick}>
    {props.children || "IconButton"}
  </button>
));

// Mock de Popover y sus subcomponentes
jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

describe("MenuList", () => {
  const mockApprove = jest.fn();
  const mockEdit = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderMenuList = (status: number) => {
    render(
      <MenuList
        status={status}
        onApprove={mockApprove}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

  };

  it("renderiza todas las opciones cuando status !== 1", () => {
    renderMenuList(0);

    expect(screen.getByText("Aprobar")).toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("no muestra 'Aprobar' cuando status === 1", () => {
    renderMenuList(1);

    expect(screen.queryByText("Aprobar")).not.toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("ejecuta las acciones al hacer clic", () => {
    renderMenuList(0);

    fireEvent.click(screen.getByText("Aprobar"));
    expect(mockApprove).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Editar"));
    expect(mockEdit).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Eliminar"));
    expect(mockDelete).toHaveBeenCalled();
  });
});