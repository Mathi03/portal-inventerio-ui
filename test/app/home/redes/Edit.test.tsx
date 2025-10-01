import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Edit from "@/app/(home)/redes/Edit";

// Mocks para evitar dependencias reales
jest.mock("@/components/Aside", () => ({ children, ...props }: any) => (
  <div data-testid="aside" {...props}>
    {children}
  </div>
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
  ButtonPrimary: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  ButtonSecondary: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/app/(home)/redes/useRed", () => () => ({
  updateRed: jest.fn(),
}));
describe("@/app/(home)/redes/Edit", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockRed = { id: 1, label: "Test", name: "Red Test", status: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(
      <Edit red={mockRed} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(
      screen.getByText("Editar mantenedor de red")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Actualice todo los datos correspondiente para editar con éxito un mantenedor de red"
      )
    ).toBeInTheDocument();
  });


});