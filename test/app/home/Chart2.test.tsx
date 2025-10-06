import { render, screen, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { Chart2 } from "@/app/(home)/Chart2";

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

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

describe("Chart2", () => {
  it("renderiza título, campos de fecha y footer", () => {
    renderWithTheme(<Chart2 />);
    expect(screen.getByText("Mantenedor de red")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de inicio")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de fin")).toBeInTheDocument();
    expect(screen.getByText(/Trending up by 5.2%/)).toBeInTheDocument();
    expect(screen.getByText(/Showing total visitors/)).toBeInTheDocument();
  });


})