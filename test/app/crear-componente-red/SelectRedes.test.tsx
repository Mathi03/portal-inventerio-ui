// test/components/SelectRedes.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import { userEvent } from "@testing-library/user-event";
import SelectRedes from "@/app/crear-componente-red/SelectRedes";

// Mock del servicio
jest.mock("@/core/red/red.service", () => ({
  RedService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, label: "Red A", status: 1 },
            { id: 2, label: "Red B", status: 0 },
            { id: 3, label: "Red C", status: 1 },
          ],
        },
      },
    }),
  })),
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

describe("SelectRedes", () => {
  it("renderiza el select con opciones filtradas y estado de carga", async () => {
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<SelectRedes name="red" onChange={mockOnChange} />);

    // Verifica helper de carga
    expect(screen.getByText("cargando redes...")).toBeInTheDocument();

    await waitFor(() => {
      const select = screen.getByLabelText("Red");
      expect(select).toBeEnabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent("Red A");
      expect(options[1]).toHaveTextContent("Red C");
    });

    // Simula selección
    const select = screen.getByLabelText("Red");
    await user.selectOptions(select, "1");

    expect(mockOnChange).toHaveBeenCalledWith({ id: 1, label: "Red A", status: 1 });
  });
});