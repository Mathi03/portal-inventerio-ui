// test/components/SelectTipoComponentes.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import userEvent from "@testing-library/user-event";
import SelectTipoComponentes from "@/app/crear-componente-red/SelectTipoComponentes";

// Mock del servicio
jest.mock("@/core/tipo-componente/tipo-componente.service", () => ({
  TipoComponenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, label: "Botón", status: 1 },
            { id: 2, label: "Input", status: 0 },
            { id: 3, label: "Select", status: 1 },
          ],
        },
      },
    }),
  })),
}));

  const renderWithTheme = (ui: React.ReactElement) =>
    render(
      <ThemeContextProvider theme={{
      skin: getTelefonicaSkin(),
      i18n: { locale: 'es-ES', phoneNumberFormattingRegionKey: 'ES' },
      colorScheme: 'light'
      }}>
        {ui}
      </ThemeContextProvider>
    );

describe("SelectTipoComponentes", () => {
  it("renderiza opciones filtradas y ejecuta onChange correctamente", async () => {
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<SelectTipoComponentes name="tipo" onChange={mockOnChange} />);

    // Estado de carga inicial
    expect(screen.getByText("cargando tipo de componentes...")).toBeInTheDocument();

    await waitFor(() => {
      const select = screen.getByLabelText("Tipo de componente");
      expect(select).toBeEnabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent("Botón");
      expect(options[1]).toHaveTextContent("Select");
    });

    // Simula selección
    const select = screen.getByLabelText("Tipo de componente");
    await user.selectOptions(select, "3");

    expect(mockOnChange).toHaveBeenCalledWith({ id: 3, label: "Select", status: 1 });
  });
});