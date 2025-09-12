import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import MantenedorRedPage from "@/app/(home)/tipo-componentes/page";


// ✅ Mocks necesarios
jest.mock("@/app/(home)/tipo-componentes/useTipoComponente", () => () => ({
  tipoComponentes: [{ id: 1, name: "Componente A", label: "A", status: "activo" }],
  tipoComponente: null,
  tipoComponenteCount: 1,
  loadingTipoComponentes: false,
  getTipoComponentes: jest.fn(),
  setTipoComponente: jest.fn(),
  deleteTipoComponente: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

jest.mock("@/app/(home)/redes/useColumn", () => () => ({
  columns: () => [],
  showColumn: [],
  setShowColumn: jest.fn(),
}));

jest.mock("@/hooks/usePagination", () => () => ({
  page: 1,
  limit: 10,
  setPage: jest.fn(),
  setLimit: jest.fn(),
}));

jest.mock("@telefonica/mistica", () => ({
  ...jest.requireActual("@telefonica/mistica"),
  useDialog: () => ({
    confirm: jest.fn(),
  }),
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

describe("MantenedorRedPage", () => {
  it("renderiza título y botón de crear", () => {
    renderWithTheme(<MantenedorRedPage />);
    expect(screen.getByText("Crear")).toBeInTheDocument();
    expect(screen.getByText("Cerrar Filtros")).toBeInTheDocument();
  });

  it("permite alternar el filtro", () => {
    renderWithTheme(<MantenedorRedPage />);
    const toggleButton = screen.getByText("Cerrar Filtros");
    fireEvent.click(toggleButton);
    expect(screen.queryByText("Cerrar Filtros")).not.toBeInTheDocument();
  });
});