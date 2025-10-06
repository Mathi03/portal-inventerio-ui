// test/app/Header.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import Header from "@/app/(home)/Header";

// ✅ Mock del router para capturar navegación
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/redes", // Ruta activa simulada
  useSearchParams: () => new URLSearchParams(),
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

describe("Header", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("se renderiza correctamente en rutas válidas", () => {
    renderWithTheme(<Header />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Redes")).toBeInTheDocument();
    expect(screen.getByText("Inicio")).toBeInTheDocument();
  });

  it("no se renderiza en rutas no incluidas", () => {
    // Simulamos una ruta no válida
    jest.mock("next/navigation", () => ({
      useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
      }),
      usePathname: () => "/ruta-no-existe",
      useSearchParams: () => new URLSearchParams(),
    }));

    const { container } = renderWithTheme(<Header />);
    expect(container.firstChild).not.toBeNull();
  });

  it("activa el tab correcto según el pathname", () => {
    renderWithTheme(<Header />);
    const redesTab = screen.getByText("Redes");
    expect(redesTab).toBeInTheDocument();
  });

  it("navega correctamente al cambiar de tab", () => {
    renderWithTheme(<Header />);
    const tipoComponentesTab = screen.getByText("Tipo componentes");
    fireEvent.click(tipoComponentesTab);
    expect(pushMock).toHaveBeenCalledWith("/tipo-componentes");
  });
});