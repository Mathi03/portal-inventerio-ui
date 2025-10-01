import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import ShowColumns from "@/app/(home)/redes/ShowColumns";

describe("ShowColumns", () => {
  const mockOnSubmit = jest.fn();

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza el botón de Columnas", () => {
    renderWithTheme(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    expect(screen.getByText("Columnas")).toBeInTheDocument();
  });

  it("muestra el título y descripción del popover", () => {
    renderWithTheme(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    // Abrir el popover
    fireEvent.click(screen.getByText("Columnas"));
    expect(screen.getByText("Columnas a mostrar")).toBeInTheDocument();
    expect(
      screen.getByText("Selecciones los campos que quieres mostrar en la tabla")
    ).toBeInTheDocument();
  });

  it("llama a onSubmit al hacer submit", () => {
    renderWithTheme(<ShowColumns onSubmit={mockOnSubmit} showColumn={{}} />);
    // Abrir el popover
    fireEvent.click(screen.getByText("Columnas"));
    // Hacer submit directamente
    fireEvent.click(screen.getByText("Aplicar"));
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});