import { render, screen, fireEvent } from "@testing-library/react";
import ShowColumns from "@/app/(home)/tipo-componentes/ShowColumns";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import { ShowColumnType } from "@/app/(home)/tipo-componentes/useColumn";

describe("ShowColumns component", () => {
  const defaultValues = {
    id: true,
    label: false,
    name: true,
    status: false,
  };

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

  it("should render trigger button", () => {
    renderWithTheme(<ShowColumns showColumn={defaultValues} onSubmit={jest.fn()} />);
    expect(screen.getByText("Columnas")).toBeInTheDocument();
  });

});