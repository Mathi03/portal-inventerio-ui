// test/components/RelacionJerarquica.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import RelacionJerarquica from "@/app/crear-componente-red/Relatcion-jerarquica";
import { userEvent } from '@testing-library/user-event';


// Mock del servicio
jest.mock("@/core/componente-red/componente-red.service", () => ({
  ComponenteRedService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            {
              id: 1,
              controlName: "Router",
              controlLabel: "RTR-001",
            },
            {
              id: 2,
              controlName: "Switch",
              controlLabel: "SW-002",
            },
          ],
        },
      },
    }),
  })),
}));

// Mock de Mistica Snackbar
const mockSnackbar = jest.fn();
jest.mock("@telefonica/mistica", () => ({
  ...jest.requireActual("@telefonica/mistica"),
  useSnackbar: () => ({ openSnackbar: mockSnackbar }),
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

describe("RelacionJerarquica", () => {
  const red = { id: 123, name: "Red Principal" };
  const tipoComponenteId = 456;

  const onSelected = jest.fn();
  const onDeselected = jest.fn();

  it("renderiza la tabla con datos y permite seleccionar/deseleccionar", async () => {
    renderWithTheme(
      <RelacionJerarquica
        red={red}
        tipoComponenteId={tipoComponenteId}
        onSelected={onSelected}
        onDeselected={onDeselected}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Router")).toBeInTheDocument();
      expect(screen.getByText("RTR-001")).toBeInTheDocument();
      expect(screen.getByText("Switch")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);

    await userEvent.click(checkboxes[0]);
    expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ controlName: "Router" }));

    await userEvent.click(checkboxes[0]);
    expect(onDeselected).toHaveBeenCalledWith(expect.objectContaining({ controlName: "Router" }));
  });

  it("muestra snackbar en caso de error genérico", async () => {
    const { ComponenteRedService } = require("@/core/componente-red/componente-red.service");
    ComponenteRedService.mockImplementationOnce(() => ({
      findAll: jest.fn().mockRejectedValue(new Error("Network error")),
    }));

    renderWithTheme(
      <RelacionJerarquica
        red={red}
        tipoComponenteId={tipoComponenteId}
        onSelected={onSelected}
        onDeselected={onDeselected}
      />
    );

    await waitFor(() => {
      expect(mockSnackbar).toHaveBeenCalledWith({
        message: expect.any(String),
        type: "CRITICAL",
      });
    });
  });
});