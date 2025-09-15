import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SelectRegiones from "@/app/(home)/componente-red/SelectRegiones";

// Mock del componente Select
jest.mock("@/components/Select", () => (props: any) => (
  <select name={props.name} disabled={props.disabled} data-testid="select">
    {props.options?.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    ))}
  </select>
));

// Mock del servicio msDirecciones
jest.mock("@/core/config", () => ({
  msDirecciones: {
    get: jest.fn().mockResolvedValue({
      data: {
        data: {
          regiones: [
            { id: 1, nombre: "Gran Caracas" },
            { id: 2, nombre: "Andes" },
            { id: 3, nombre: "Oriente" },
          ],
        },
      },
    }),
  },
}));

describe("SelectRegiones", () => {
  it("renderiza el select con las regiones cargadas", async () => {
    render(<SelectRegiones name="regionId" />);

    await waitFor(() => {
      const select = screen.getByTestId("select");
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent("Gran Caracas");
      expect(options[1]).toHaveTextContent("Andes");
      expect(options[2]).toHaveTextContent("Oriente");
    });
  });
});