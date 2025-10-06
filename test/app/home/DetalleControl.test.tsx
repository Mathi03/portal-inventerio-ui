import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import DetalleControl from "@/app/(home)/DetalleControl";

jest.mock("@/core/control/control.service", () => {
  return {
    ControlService: jest.fn().mockImplementation(() => ({
      findById: jest.fn().mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                id: 42,
                label: "Control Mock",
                name: "Control ABC",
                createdAt: "2023-07-01T00:00:00Z",
              }),
            300
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

describe("DetalleControl", () => {
  it("muestra el id como fallback en el trigger", () => {
    renderWithTheme(<DetalleControl id={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("muestra el spinner mientras carga", async () => {
    renderWithTheme(<DetalleControl id={42} />);
    fireEvent.click(screen.getByText("42"));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("muestra los datos del control después de cargar", async () => {
    renderWithTheme(<DetalleControl id={42} />);
    fireEvent.click(screen.getByText("42"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Control Mock")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Control ABC")).toBeInTheDocument();
      expect(screen.getByDisplayValue("42")).toBeInTheDocument();
    });
  });
});