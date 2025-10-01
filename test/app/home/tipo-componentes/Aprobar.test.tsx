import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import Aprobar from "@/app/(home)/tipo-componentes/Aprobar";

jest.mock("@/core/tipo-componente/tipo-componente.service", () => ({
  TipoComponenteService: jest.fn().mockImplementation(() => ({
    approval: jest.fn().mockResolvedValue(undefined),
  })),
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

const mockTc = {
  id: 1,
  name: "Componente LTE",
  label: "LTE",
  status: 2,
};

describe("Aprobar", () => {
  it("renderiza correctamente el modal", () => {
    renderWithTheme(
      <Aprobar tc={mockTc} onClose={() => {}} onSuccess={() => {}} />
    );
    expect(
      screen.getByText("Aprobación de tipo de componente")
    ).toBeInTheDocument();
    expect(screen.getByText(/Componente LTE/)).toBeInTheDocument();
    expect(screen.getByLabelText("Comentario de aprobación")).toBeInTheDocument();
    expect(screen.getByText("Aprobar")).toBeInTheDocument();
    expect(screen.getByText("Cerrar")).toBeInTheDocument();
  });

  it("ejecuta onSuccess y onClose al aprobar", async () => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    renderWithTheme(
      <Aprobar tc={mockTc} onClose={onClose} onSuccess={onSuccess} />
    );

    fireEvent.change(screen.getByLabelText("Comentario de aprobación"), {
      target: { value: "Todo correcto" },
    });

    fireEvent.click(screen.getByText("Aprobar"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

 
});