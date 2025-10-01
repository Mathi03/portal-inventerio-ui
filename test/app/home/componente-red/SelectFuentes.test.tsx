import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SelectFuentes from "@/app/(home)/componente-red/SelectFuentes";

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

// Mock del servicio FuenteService
jest.mock("@/core/fuente/fuente.service", () => ({
  FuenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, label: "Fuente A", status: 1 },
            { id: 2, label: "Fuente B", status: 0 },
            { id: 3, label: "Fuente C", status: 1 },
          ],
        },
      },
    }),
  })),
}));

describe("SelectFuentes", () => {
  it("renderiza el select con fuentes activas", async () => {
    render(<SelectFuentes name="fuenteId" />);

    await waitFor(() => {
      const select = screen.getByTestId("select");
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2); // Solo fuentes con status === 1
      expect(options[0]).toHaveTextContent("Fuente A");
      expect(options[1]).toHaveTextContent("Fuente C");
    });
  });
});