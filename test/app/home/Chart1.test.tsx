import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import { Chart1 } from "@/app/(home)/Chart1";

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

describe("Chart1", () => {
  it("renderiza título, descripción y botones de selección", () => {
    renderWithTheme(<Chart1 />);
    expect(screen.getByText("Componentes de red")).toBeInTheDocument();
    expect(screen.getByText("Mostrar el total de tres meses")).toBeInTheDocument();
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

});