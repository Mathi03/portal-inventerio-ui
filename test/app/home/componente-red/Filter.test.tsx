import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "@/app/(home)/componente-red/Filter";

// Mocks
jest.mock("@telefonica/mistica", () => ({
  TextField: ({ label, value, onChange, readOnly }: any) => (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => onChange?.(e)}
      readOnly={readOnly}
    />
  ),
}));

jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));

jest.mock("@/components/SearchableSelect", () => (props: any) => (
  <select
    aria-label={props.label}
    value={props.value}
    onChange={(e) => props.onChangeValue(e.target.value)}
  >
    {props.options?.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    ))}
  </select>
));

jest.mock("@/components/Modal", () => ({ children, open }: any) =>
  open ? <div data-testid="modal">{children}</div> : null
);

jest.mock("@/components/SearchClient", () => (props: any) => (
  <div>
    <button onClick={() => props.onSelected({ id: 99, nombreadministrativo: "Cliente X" })}>
      Seleccionar Cliente
    </button>
  </div>
));

jest.mock("@/components/SearchEstacion", () => (props: any) => (
  <div>
    <button onClick={() => props.onSelected({ id: 88, nombre: "Estación Y" })}>
      Seleccionar Estación
    </button>
  </div>
));

describe("Filter", () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza campos y botones", () => {
    render(<Filter onFilter={mockOnFilter} />);
    expect(screen.getByLabelText("Componente Id")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Etiqueta")).toBeInTheDocument();
    expect(screen.getByText("Buscar")).toBeInTheDocument();
    expect(screen.getByText("Limpiar")).toBeInTheDocument();
  });

  it("ejecuta onFilter al hacer clic en Buscar", () => {
    render(<Filter onFilter={mockOnFilter} />);
    fireEvent.click(screen.getByText("Buscar"));
    expect(mockOnFilter).toHaveBeenCalled();
  });

  it("limpia los campos al hacer clic en Limpiar", () => {
    render(<Filter onFilter={mockOnFilter} />);
    fireEvent.click(screen.getByText("Limpiar"));
    expect(mockOnFilter).toHaveBeenCalledWith({
      id: "",
      name: "",
      label: "",
      ref_component_type_id: "",
      ref_network_id: "",
      ref_source_id: "",
      region_id: "",
      client_id: "",
      station_id: "",
    });
  });

  it("abre el modal de cliente y selecciona", () => {
    render(<Filter onFilter={mockOnFilter} />);
    fireEvent.click(screen.getByLabelText("Cliente"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Seleccionar Cliente"));
    expect(screen.getByLabelText("Cliente")).toHaveValue("Cliente X");
  });

  it("abre el modal de estación y selecciona", () => {
    render(<Filter onFilter={mockOnFilter} />);
    fireEvent.click(screen.getByLabelText("Estacion"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Seleccionar Estación"));
    expect(screen.getByLabelText("Estacion")).toHaveValue("88");
  });
});