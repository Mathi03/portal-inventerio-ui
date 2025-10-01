import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Edit from "@/app/(home)/mantenedor-red/Edit";

// Mocks para evitar dependencias reales
jest.mock("@/components/Aside", () => ({ children, ...props }: any) => (
  <div data-testid="aside" {...props}>{children}</div>
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} disabled={props.showSpinner}>
    {props.children}
  </button>
));
jest.mock("@/components/Select", () => (props: any) => (
  <select name={props.name} data-testid={`select-${props.name}`}>
    {props.options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>{opt.text}</option>
    ))}
  </select>
));
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ label: "Red A", name: "Nombre A", status: "1" });
      }}
    >
      {children}
    </form>
  ),
  TextField: ({ label }: any) => <input placeholder={label} />,
}));
jest.mock("@/core/red/red.service", () => ({
  RedService: jest.fn().mockImplementation(() => ({
    update: jest.fn().mockResolvedValue({}),
  })),
}));

describe("Edit", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockRed = {
    id: 1,
    label: "Red A",
    name: "Nombre A",
    status: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Edit red={mockRed} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText("Editar mantenedor de red")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Actualice todo los datos correspondiente para editar con éxito un mantenedor de red"
      )
    ).toBeInTheDocument();
  });

 
});