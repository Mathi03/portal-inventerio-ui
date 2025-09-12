import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContextProvider, getTelefonicaSkin } from "@telefonica/mistica";
import MenuList from "../componente-red/MenuList";

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

const mockTc = { id: 1, name: "Comp A", label: "A", status: 3 };

describe("MenuList", () => {

  it("muestra las opciones al abrir el popover", () => {
    renderWithTheme(
      <MenuList
        tc={mockTc}
        onEdit={() => {}}
        onApproval={() => {}}
        onDelete={() => {}}
      />
    );
    fireEvent.click(screen.getByRole("button")); // abre el popover
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Aprobar")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("ejecuta onEdit al hacer clic en Editar", () => {
    const onEdit = jest.fn();
    renderWithTheme(
      <MenuList
        tc={mockTc}
        onEdit={onEdit}
        onApproval={() => {}}
        onDelete={() => {}}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Editar"));
    expect(onEdit).toHaveBeenCalled();
  });


  it("ejecuta onDelete al hacer clic en Eliminar", () => {
    const onDelete = jest.fn();
    renderWithTheme(
      <MenuList
        tc={mockTc}
        status={2}
        onEdit={() => {}}
        onApproval={() => {}}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Eliminar"));
    expect(onDelete).toHaveBeenCalled();
  });

  it("no muestra Aprobar si status == 1", () => {
    renderWithTheme(
      <MenuList
        tc={{ ...mockTc }}
        status={1}
        onEdit={() => {}}
        onApproval={() => {}}
        onDelete={() => {}}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Aprobar")).not.toBeInTheDocument();
  });
});