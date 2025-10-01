import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Create from "@/app/(home)/mantenedor-fuente/create";

// Mocks para evitar dependencias reales
jest.mock("@/components/Aside", () => ({ children }: any) => (
  <div data-testid="aside">{children}</div>
));
jest.mock("@/components/Button", () => (props: any) => (
  <button onClick={props.onClick} disabled={props.showSpinner}>
    {props.children}
  </button>
));
jest.mock("@/components/Select", () => (props: any) => (
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
  TextField: ({ label, value, onChangeValue }: any) => (
    <input
      placeholder={label}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
    />
  ),
  useSnackbar: () => ({
    openSnackbar: jest.fn(),
  }),
}));
jest.mock("@/core/fuente/fuente.service", () => ({
  FuenteService: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({}),
  })),
}));
jest.mock("@/core/red/red.service", () => ({
  RedService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: { data: { data: [] } },
    }),
  })),
}));
jest.mock("@/core/tipo-componente/tipo-componente.service", () => ({
  TipoComponenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: { data: { data: [] } },
    }),
  })),
}));
jest.mock("@/core/tipo-fuente/tipo-fuente.service", () => ({
  TipoFuenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: { data: { data: [] } },
    }),
  })),
}));

describe("Create Fuente", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Create onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText("Crear mantenedor de fuente")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ingrese todos los datos correspondientes para crear con éxito un mantenedor de fuente"
      )
    ).toBeInTheDocument();
  });

 
});