// test/components/Header.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/app/crear-componente-red/Header";
import { useRouter } from "next/navigation";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";

// Mock del router de Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Header", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Función para renderizar con el ThemeContextProvider
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

  it("debe renderizar correctamente los elementos del header", () => {
    renderWithTheme(<Header />);

    // Verifica que el logo esté presente
    expect(screen.getByAltText("telefonica")).toBeInTheDocument();

    // Verifica que los botones estén presentes
    expect(screen.getAllByRole("button")).toHaveLength(2);

    // Verifica que el avatar esté presente
    expect(screen.getByText("RM")).toBeInTheDocument();
  });

  it("debe navegar al hacer clic en el botón de retroceso", () => {
    renderWithTheme(<Header />);

    const backButton = screen.getAllByRole("button")[0];
    fireEvent.click(backButton);

    expect(pushMock).toHaveBeenCalledWith("/componente-red");
  });
});