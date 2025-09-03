// test/components/SelectRegiones.test.tsx
import { render, screen, waitFor } from "@testing-library/react";

import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import userEvent from "@testing-library/user-event";
import SelectRegiones from "@/app/crear-componente-red/SelectRegiones";

// Mock del cliente msDirecciones
jest.mock("@/core/config", () => ({
  msDirecciones: {
    get: jest.fn().mockResolvedValue({
      data: {
        data: {
          regiones: [
            { id: 10, nombre: "Andes" },
            { id: 20, nombre: "Oriente" },
          ],
        },
      },
    }),
  },
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

describe("SelectRegiones", () => {
  it("renderiza regiones desde API y muestra opciones", async () => {
    renderWithTheme(<SelectRegiones name="region" />);

    expect(screen.getByText("cargando regiones...")).toBeInTheDocument();

    await waitFor(() => {
      const select = screen.getByLabelText("Región");
      expect(select).toBeEnabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent("Andes");
      expect(options[1]).toHaveTextContent("Oriente");
    });
  });

  it("usa fallback si la API falla", async () => {
    const { msDirecciones } = require("@/core/config");
    msDirecciones.get.mockRejectedValueOnce(new Error("timeout"));

    renderWithTheme(<SelectRegiones name="region" />);

    await waitFor(() => {
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("Gran Caracas");
    });
  });
});