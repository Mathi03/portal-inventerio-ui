import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import Edit from "@/app/(home)/tipo-componentes/Edit";
import useTipoComponente from "@/app/(home)/tipo-componentes/useTipoComponente";

const mockTipoComponente = {
  id: 1,
  label: "Botón",
  name: "Primary",
  status: 2,
  configAttributes: { color: "blue" },
  configServices: { api: "/update" },
};

jest.mock("@/components/InputJson", () => ({ label, onChange }: any) => (
  <div>
    <label>{label}</label>
    <textarea onChange={(e) => onChange(JSON.parse(e.target.value))} />
  </div>
));

jest.mock("@/app/(home)/tipo-componentes/useTipoComponente", () => () => ({
  updateTipoComponente: jest.fn().mockResolvedValue(undefined),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeContextProvider
      theme={{
        skin: getTelefonicaSkin(),
        i18n: { locale: "es-ES", phoneNumberFormattingRegionKey: "ES" },
        colorScheme: "light",
      }}
    >
      {ui}
    </ThemeContextProvider>
  );

describe("Edit", () => {
  it("renderiza título, inputs y botones", () => {
    renderWithTheme(
      <Edit
        tipoComponente={mockTipoComponente}
        onClose={() => {}}
        onSuccess={() => {}}
      />
    );
    expect(
      screen.getByText("Editar mantenedor de tipo de componente")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Etiqueta")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Configuración de Atributos")).toBeInTheDocument();
    expect(screen.getByText("Configuración de servicios")).toBeInTheDocument();
    expect(screen.getByText("Guardar")).toBeInTheDocument();
    expect(screen.getByText("Cerrar")).toBeInTheDocument();
  });

  it("envía el formulario y ejecuta onSuccess y onClose", async () => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    renderWithTheme(
      <Edit
        tipoComponente={mockTipoComponente}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText("Etiqueta"), {
      target: { value: "Nuevo Label" },
    });
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Nuevo Nombre" },
    });

    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });


});