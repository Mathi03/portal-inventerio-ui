import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "@/app/(home)/mantenedor-fuente/Filter";

// Mocks para evitar dependencias reales
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick}>{props.children}</button>
));
jest.mock("@/components/Select", () => (props: any) => (
  <select
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
jest.mock("@/components/SearchableSelect", () => (props: any) => (
  <select
    value={props.value}
    onChange={(e) => props.onChangeValue(e.target.value)}
    disabled={props.disabled}
  >
    {props.options?.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    ))}
  </select>
));
jest.mock("@telefonica/mistica", () => ({
  TextField: ({ label, value, onChange }: any) => (
    <input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e)}
    />
  ),
}));

describe("Filter", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    expect(screen.getByText("Filtro de Búsqueda")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seleccione los filtros necesarios antes de consultar sus mantenedores de fuentes"
      )
    ).toBeInTheDocument();
  });

  it("llama a onSubmit con datos al hacer click en Buscar", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText("Buscar"));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      label: "",
      name: "",
      status: "",
      version: "",
      refNetworkId: "",
      refComponentTypeId: "",
      refTypeSourceId: "",
    });
  });

  it("llama a onSubmit con campos vacíos al hacer click en Limpiar", () => {
    render(<Filter onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText("Limpiar"));
    expect(mockOnSubmit).toHaveBeenCalledWith({
      label: "",
      name: "",
      status: "",
      version: "",
      refNetworkId: "",
      refComponentTypeId: "",
      refTypeSourceId: "",
    });
  });
});