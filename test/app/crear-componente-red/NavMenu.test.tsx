// test/components/NavMenu.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import '@testing-library/jest-dom';
import NavMenu from "@/app/crear-componente-red/NavMenu";

// Wrapper con ThemeContextProvider
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

describe("NavMenu", () => {
  it("debe renderizar el título de navegación", () => {
    renderWithTheme(<NavMenu />);
    expect(screen.getByText("Navegacion")).toBeInTheDocument();
  });

  it("debe renderizar las secciones y enlaces correctamente", () => {
    renderWithTheme(<NavMenu />);

    // Verifica que la sección esté presente
    expect(screen.getByText("Información Basíca")).toBeInTheDocument();

    // Verifica que los enlaces estén presentes
    expect(screen.getByText("Datos del componente de red")).toBeInTheDocument();
    expect(screen.getByText("Configuración adicional")).toBeInTheDocument();
    expect(screen.getByText("Relación jerarquica")).toBeInTheDocument();
    expect(screen.getByText("Observación")).toBeInTheDocument();
  });

  it("debe contener botones dentro de los enlaces", () => {
    renderWithTheme(<NavMenu />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(buttons[0]).toHaveTextContent("Información Basíca");
  });
});