import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "@/app/(home)/mantenedor-tipo-componente/Filter";

// Mocks para evitar dependencias reales
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          label: "",
          name: "",
          status: "",
        });
      }}
    >
      {children}
    </form>
  ),
  TextField: ({ label }: any) => <input placeholder={label} />,
}));
jest.mock("@/components/Select", () => (props: any) => (
  <select data-testid="select" {...props} />
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));

describe("Filter", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Filtro de Búsqueda")).toBeInTheDocument();
   
  });

 
});