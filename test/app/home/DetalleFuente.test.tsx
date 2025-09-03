import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import DetalleFuente from "@/app/(home)/DetalleFuente";

// ✅ Mock del servicio con estructura esperada por el componente
jest.mock("@/core/fuente/fuente.service", () => {
  return {
    FuenteService: jest.fn().mockImplementation(() => ({
      getById: jest.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                data: {
                  data: {
                    id: 77,
                    label: "Fuente Mock",
                    name: "Fuente ABC",
                    createdAt: "2023-09-01T00:00:00Z",
                  },
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

describe("DetalleFuente", () => {
  it("muestra el id como fallback en el trigger", () => {
    renderWithTheme(<DetalleFuente id={77} />);
    expect(screen.getByText("77")).toBeInTheDocument();
  });

  it("muestra el spinner mientras carga", async () => {
    renderWithTheme(<DetalleFuente id={77} />);
    fireEvent.click(screen.getByText("77"));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("carga y muestra los datos al abrir el popover", async () => {
    renderWithTheme(<DetalleFuente id={77} />);
    fireEvent.click(screen.getByText("77"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Fuente Mock")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Fuente ABC")).toBeInTheDocument();
      expect(screen.getByDisplayValue("77")).toBeInTheDocument();
    });
  });
});