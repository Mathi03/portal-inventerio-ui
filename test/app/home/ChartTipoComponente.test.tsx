import { render, screen, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { ChartTipoComponente } from "@/app/(home)/ChartTipoComponente";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// ✅ Mock del servicio BFF
jest.mock("@/core/config", () => ({
  bff: {
    post: jest.fn().mockResolvedValue({
      data: {
        data: [
          { name: "Botón", quantity: 12 },
          { name: "Input", quantity: 8 },
        ],
      },
    }),
  },
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

describe("ChartTipoComponente", () => {
  it("renderiza título y campos de fecha", () => {
    renderWithTheme(<ChartTipoComponente />);
    expect(screen.getByText("Tipo de componentes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de inicio")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de fin")).toBeInTheDocument();
  });

 
});
