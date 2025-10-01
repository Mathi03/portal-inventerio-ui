// test/app/HomeLayout.test.tsx
import { render, screen } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import HomeLayout from "@/app/(home)/layout";

// Mock del Header
jest.mock('@/app/(home)/Header', () => () => (
  <header data-testid="header">Header</header>
));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

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

describe("HomeLayout", () => {
  it("renderiza el Header y los children correctamente", () => {
    renderWithTheme(
      <HomeLayout>
        <div data-testid="child">Contenido dinámico</div>
      </HomeLayout>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Contenido dinámico");
  });

  it("tiene estructura de layout esperada", () => {
    const { container } = renderWithTheme(
      <HomeLayout>
        <div>Test</div>
      </HomeLayout>
    );

    const main = container.querySelector("main");
    expect(main).toHaveClass("grid grid-rows-[auto_1fr] w-full h-full");
  });
});