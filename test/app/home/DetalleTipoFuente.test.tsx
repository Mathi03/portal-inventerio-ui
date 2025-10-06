import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import DetalleTipoFuente from "@/app/(home)/DetalleTipoFuente";

jest.mock("@/core/tipo-fuente/tipo-fuente.service");

const mockData = {
  data: {
    data: {
      id: 42,
      label: "Fuente Mock",
      name: "Mock Name",
      createdAt: "2023-09-01T00:00:00Z",
    },
  },
};

(TipoFuenteService as jest.Mock).mockImplementation(() => ({
  getById: jest.fn().mockResolvedValue(mockData),
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

describe("DetalleTipoFuente", () => {
  it("muestra el id como fallback en el trigger", () => {
    renderWithTheme(<DetalleTipoFuente id={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("carga los datos al abrir el popover", async () => {
    renderWithTheme(<DetalleTipoFuente id={42} />);
    const trigger = screen.getByText("42");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Fuente Mock")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Mock Name")).toBeInTheDocument();
      expect(screen.getByDisplayValue("42")).toBeInTheDocument();
    });
  });

  it("muestra el spinner mientras carga", async () => {
    renderWithTheme(<DetalleTipoFuente id={42} />);
    fireEvent.click(screen.getByText("42"));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });
});