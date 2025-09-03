import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import ButtonFilter from "@/app/(home)/ButtonFilter";

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

describe("ButtonFilter", () => {
 

  it("ejecuta onClick al hacer clic", () => {
    const handleClick = jest.fn();
    renderWithTheme(<ButtonFilter openFilter={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});