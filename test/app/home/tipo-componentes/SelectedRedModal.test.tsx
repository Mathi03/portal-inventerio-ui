import { render, screen, fireEvent } from "@testing-library/react";
import SelectedRedModal from "@/app/(home)/tipo-componentes/SelectedRedModal";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import { RedType } from "../../../core/red/red.type";

const redesMock: RedType[] = [
  { id: "1", label: "Red LTE" },
  { id: "2", label: "Red 5G" },
  { id: "3", label: "Red Satelital" },
];

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

describe("SelectedRedModal", () => {
  it("renders search input and list of redes", () => {
    renderWithTheme(
      <SelectedRedModal
        onClose={jest.fn()}
        selectedTechs={{}}
        setSelectedTechs={jest.fn()}
        onSave={jest.fn()}
        redes={redesMock}
      />
    );

    expect(screen.getByText("Selecciona una red")).toBeInTheDocument();
    expect(screen.getByLabelText("Buscar red")).toBeInTheDocument();
    expect(screen.getByText("Red LTE")).toBeInTheDocument();
    expect(screen.getByText("Red 5G")).toBeInTheDocument();
    expect(screen.getByText("Red Satelital")).toBeInTheDocument();
  });

  it("filters redes based on search input", () => {
    renderWithTheme(
      <SelectedRedModal
        onClose={jest.fn()}
        selectedTechs={{}}
        setSelectedTechs={jest.fn()}
        onSave={jest.fn()}
        redes={redesMock}
      />
    );

    const searchInput = screen.getByLabelText("Buscar red");
    fireEvent.change(searchInput, { target: { value: "lte" } });

    expect(screen.getByText("Red LTE")).toBeInTheDocument();
    expect(screen.queryByText("Red 5G")).not.toBeInTheDocument();
    expect(screen.queryByText("Red Satelital")).not.toBeInTheDocument();
  });

  it("selects a red and triggers onSave with correct data", () => {
    const mockSetSelectedTechs = jest.fn();
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();

    renderWithTheme(
      <SelectedRedModal
        onClose={mockOnClose}
        selectedTechs={{}}
        setSelectedTechs={mockSetSelectedTechs}
        onSave={mockOnSave}
        redes={redesMock}
      />
    );

    const checkbox = screen.getByText("Red LTE");
    fireEvent.click(checkbox);

    const associateButton = screen.getByText("Asociar");
    fireEvent.click(associateButton);

    expect(mockSetSelectedTechs).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalledWith([{ key: "1", label: "Red LTE" }]);
    expect(mockOnClose).toHaveBeenCalled();
  });
});