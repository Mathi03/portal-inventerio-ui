// test/components/SelectFuentes.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import SelectFuentes from "@/app/crear-componente-red/SelectFuentes";

// Mock del servicio
jest.mock("@/core/fuente/fuente.service", () => ({
  FuenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, label: "Fuente A", status: 1 },
            { id: 2, label: "Fuente B", status: 0 },
            { id: 3, label: "Fuente C", status: 1 },
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

describe("SelectFuentes", () => {
  it("renderiza el select con opciones filtradas y estado de carga", async () => {
    renderWithTheme(<SelectFuentes name="fuente" />);

    // Verifica estado inicial de carga
    const helper = screen.getByText("cargando fuentes...");
    expect(helper).toBeInTheDocument();

    await waitFor(() => {
      const select = screen.getByLabelText("Fuente");
      expect(select).toBeEnabled();

      // Verifica que solo se rendericen las fuentes con status === 1
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent("Fuente A");
      expect(options[1]).toHaveTextContent("Fuente C");
    });
  });
});