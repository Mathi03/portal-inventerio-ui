import { render, screen, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { ChartFuentes } from "@/app/(home)/ChartFuentes";

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
          { name: "Fuente A", quantity: 15 },
          { name: "Fuente B", quantity: 7 },
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

describe("ChartFuentes", () => {
  it("renderiza título y campos de fecha", () => {
    renderWithTheme(<ChartFuentes />);
    expect(screen.getByText("Fuentes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de inicio")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de fin")).toBeInTheDocument();
  });
});