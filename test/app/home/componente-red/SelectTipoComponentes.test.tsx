import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SelectTipoComponentes from "@/app/(home)/componente-red/SelectTipoComponentes";

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

// Mock del servicio
jest.mock("@/core/tipo-componente/tipo-componente.service", () => ({
  TipoComponenteService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      data: {
        data: {
          data: [
            { id: 1, label: "Componente A", status: 1 },
            { id: 2, label: "Componente B", status: 0 },
            { id: 3, label: "Componente C", status: 1 },
          ],
        },
      },
    }),
  })),
}));

describe("SelectTipoComponentes", () => {
  it("renderiza el select con opciones filtradas por status === 1", async () => {
    render(<SelectTipoComponentes name="refComponentTypeId" />);

    await waitFor(() => {
      const select = screen.getByTestId("select");
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2); // Solo status === 1
      expect(options[0]).toHaveTextContent("Componente A");
      expect(options[1]).toHaveTextContent("Componente C");
    });
  });
});