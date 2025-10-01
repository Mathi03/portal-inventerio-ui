import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import ConfigurationsModal from "@/app/(home)/tipo-componentes/ConfigurationsModal";

jest.mock("@/components/InputJson", () => ({ label, codeDefault, onChange, readonly }: any) => (
  <div>
    <label>{label}</label>
    <textarea
      aria-label={label}
      defaultValue={codeDefault}
      readOnly={readonly}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
));

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

const mockRow = {
  id: "comp-1",
  red: { label: "Red LTE" },
  configAttributes: [{ key: "color", value: "blue" }],
  configServices: [{ endpoint: "/api", method: "GET" }],
};

describe("ConfigurationsModal", () => {
  it("renderiza correctamente el modal para atributos", () => {
    renderWithTheme(
      <ConfigurationsModal
        type="attributes"
        row={mockRow}
        onClose={() => {}}
        onSave={() => {}}
      />
    );
    expect(screen.getByText(/Editar Atributos para Red LTE/)).toBeInTheDocument();
    expect(screen.getByLabelText("Configuracion de Atributos")).toBeInTheDocument();
    expect(screen.getByText("Guardar")).toBeInTheDocument();
  });

  it("renderiza correctamente el modal en modo view", () => {
    renderWithTheme(
      <ConfigurationsModal
        type="services"
        row={mockRow}
        onClose={() => {}}
        onSave={() => {}}
        mode="view"
      />
    );
    expect(screen.getByText(/Editar Servicios para Red LTE/)).toBeInTheDocument();
    expect(screen.getByLabelText("Configuracion de Servicios")).toHaveAttribute("readonly");
    expect(screen.queryByText("Guardar")).not.toBeInTheDocument();
  });


 it("ejecuta onSave y onClose si el JSON es válido", () => {
  const onSave = jest.fn();
  const onClose = jest.fn();

  renderWithTheme(
    <ConfigurationsModal
      type="attributes"
      row={mockRow}
      onClose={onClose}
      onSave={onSave}
    />
  );

  const validJson = JSON.stringify([{ key: "color", value: "blue" }]); // ajusta según schema

  fireEvent.change(screen.getByLabelText("Configuracion de Atributos"), {
    target: { value: validJson },
  });

  fireEvent.click(screen.getByText("Guardar"));

expect(onSave).toHaveBeenCalledWith(
  "comp-1",
  "attributes",
  [{ key: "color", value: "blue" }]
);
  expect(onClose).toHaveBeenCalled();
});

});
