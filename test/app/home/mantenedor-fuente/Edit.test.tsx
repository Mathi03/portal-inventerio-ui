import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Edit from "@/app/(home)/mantenedor-fuente/Edit";

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
  <select name={props.name} disabled={props.disabled}>
    {props.options?.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    ))}
  </select>
));
jest.mock("@/components/SearchableSelect", () => (props: any) => (
  <select name={props.name} disabled={props.disabled}>
    {props.options?.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    ))}
  </select>
));
jest.mock("@telefonica/mistica", () => ({
  Form: ({ onSubmit, children }: any) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          label: "Fuente A",
          name: "Nombre A",
          status: "1",
          refNetworkId: "2",
          refComponentTypeId: "3",
          refTypeSourceId: "4",
          version: "v1.0",
        });
      }}
    >
      {children}
    </form>
  ),
  TextField: ({ label }: any) => <input placeholder={label} />,
  useSnackbar: () => ({
    openSnackbar: jest.fn(),
  }),
}));

jest.mock("@/core/fuente/fuente.service", () => ({
  FuenteService: jest.fn().mockImplementation(() => ({
    update: jest.fn().mockResolvedValue({}),
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

describe("Edit Fuente", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockFuente = {
    id: 1,
    label: "Fuente A",
    name: "Nombre A",
    status: 1,
    refNetworkId: 2,
    refComponentTypeId: 3,
    refTypeSourceId: 4,
    version: "v1.0",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    render(<Edit fuente={mockFuente} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText("Editar mantenedor de fuente")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Actualice todo los datos correspondiente para editar con éxito un mantenedor de fuente"
      )
    ).toBeInTheDocument();
  });
 
});