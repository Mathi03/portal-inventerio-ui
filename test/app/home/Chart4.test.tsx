import { render, screen, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { Chart4 } from "@/app/(home)/Chart4";

  beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
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

describe("Chart4", () => {
  it("renderiza título, descripción y footer", () => {
    renderWithTheme(<Chart4 />);
    expect(screen.getByText("Mantenedor de fuentes")).toBeInTheDocument();
    expect(screen.getByText("January - June 2024")).toBeInTheDocument();
    expect(screen.getByText(/Trending up by 5.2%/)).toBeInTheDocument();
    expect(screen.getByText(/Showing total visitors/)).toBeInTheDocument();
  });
});