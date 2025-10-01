import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import DetalleRed from "@/app/(home)/DetalleRed";

// ✅ Mock del servicio
jest.mock("@/core/red/red.service", () => {
  return {
    RedService: jest.fn().mockImplementation(() => ({
      getById: jest.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                data: {
                  id: 99,
                  label: "Red Mock",
                  name: "Red XYZ",
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

describe("DetalleRed", () => {
  it("muestra el id como fallback en el trigger", () => {
    renderWithTheme(<DetalleRed id={99} />);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("muestra el spinner mientras carga", async () => {
    renderWithTheme(<DetalleRed id={99} />);
    fireEvent.click(screen.getByText("99"));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

});