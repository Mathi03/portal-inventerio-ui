import { render, screen, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { ChartRedes } from "@/app/(home)/ChartRedes";

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
          { name: "Red Alfa", quantity: 10 },
          { name: "Red Beta", quantity: 5 },
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

describe("ChartRedes", () => {
  it("renderiza título y campos de fecha", () => {
    renderWithTheme(<ChartRedes />);
    expect(screen.getByText("Redes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de inicio")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de fin")).toBeInTheDocument();
  });

});