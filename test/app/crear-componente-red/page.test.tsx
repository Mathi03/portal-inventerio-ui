import React from "react";
import { render, screen } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import "@testing-library/jest-dom";
import DetalleComponenteRed from "@/app/crear-componente-red/page";


// Mocks de los subcomponentes
jest.mock("@/app/crear-componente-red/Header", () => () => <header data-testid="mock-header">Header</header>);
jest.mock("@/app/crear-componente-red/NavMenu", () => () => <nav data-testid="mock-nav">NavMenu</nav>);
jest.mock("@/app/crear-componente-red/CreateForm", () => () => <form data-testid="mock-form">CreateForm</form>);

// Render con contexto de Mistica
  const renderWithTheme = (ui: React.ReactElement) =>
    render(
      <ThemeContextProvider theme={{
      skin: getTelefonicaSkin(),
      i18n: { locale: 'es-ES', phoneNumberFormattingRegionKey: 'ES' },
      colorScheme: 'light'
      }}>
        {ui}
      </ThemeContextProvider>
    );

describe("DetalleComponenteRed", () => {
  it("debe renderizar correctamente los subcomponentes", () => {
    renderWithTheme(<DetalleComponenteRed />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-nav")).toBeInTheDocument();
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
  });

  it("debe tener estructura de layout esperada", () => {
    const { container } = renderWithTheme(<DetalleComponenteRed />);
    const main = container.querySelector("main");
    const section = container.querySelector("section");

    expect(main).toHaveClass("grid grid-rows-[auto_1fr] w-full h-full grid-cols-1");
    expect(section).toHaveClass("w-full h-full grid gap-2 grid-cols-[360px_1fr] overflow-hidden p-2");
  });
});