import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import DetalleTipoComponente from "@/app/(home)/DetalleTipoComponente";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";

// ✅ Mock del servicio
jest.mock("@/core/tipo-componente/tipo-componente.service", () => {
  return {
    TipoComponenteService: jest.fn().mockImplementation(() => ({
      getById: jest.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                data: {
                  id: 99,
                  label: "Tipo Mock",
                  name: "Componente XYZ",
                  createdAt: "2023-08-15T00:00:00Z",
                },
              }),
            300 // Simula carga para mostrar el spinner
          )
        )
      ),
    })),
  };
});

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

describe("DetalleTipoComponente", () => {
  it("muestra el id como fallback en el trigger", () => {
    renderWithTheme(<DetalleTipoComponente id={99} />);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("carga los datos al abrir el popover", async () => {
    renderWithTheme(<DetalleTipoComponente id={99} />);
    fireEvent.click(screen.getByText("99"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Tipo Mock")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Componente XYZ")).toBeInTheDocument();
      expect(screen.getByDisplayValue("99")).toBeInTheDocument();
    });
  });

  it("muestra el spinner mientras carga", async () => {
    renderWithTheme(<DetalleTipoComponente id={99} />);
    fireEvent.click(screen.getByText("99"));

    // Spinner debe estar visible durante la carga
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });
});