import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import Filter from "@/app/(home)/tipo-componentes/Filter";
 "@/app/(home)/Filter";

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

describe("Filter", () => {

  it("ejecuta onSubmit con valores al hacer clic en Buscar", () => {
  const onSubmit = jest.fn();
  renderWithTheme(<Filter onSubmit={onSubmit} />);

  const inputs = screen.getAllByRole("textbox");
  fireEvent.change(inputs[0], { target: { value: "Botón" } }); // Etiqueta
  fireEvent.change(inputs[1], { target: { value: "Primary" } }); // Nombre

  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "1" } }); // Estado

  fireEvent.click(screen.getByText("Buscar"));

  expect(onSubmit).toHaveBeenCalledWith({
    label: "Botón",
    name: "Primary",
    status: "1",
  });
});


  it("ejecuta onSubmit con valores vacíos al hacer clic en Limpiar", () => {
    const onSubmit = jest.fn();
    renderWithTheme(<Filter onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText("Limpiar"));
    expect(onSubmit).toHaveBeenCalledWith({
      label: "",
      name: "",
      status: "",
    });
  });

  it("envía el formulario al presionar Enter", () => {
  const onSubmit = jest.fn();
  renderWithTheme(<Filter onSubmit={onSubmit} />);

  const nombreInput = screen.getByRole("textbox", { name: /Nombre/i });
  fireEvent.keyDown(nombreInput, { key: "Enter", code: "Enter" });

  expect(onSubmit).toHaveBeenCalled();
});

});