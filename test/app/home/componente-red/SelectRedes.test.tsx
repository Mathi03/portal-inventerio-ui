import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SelectRedes from "@/app/(home)/componente-red/SelectRedes";

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

// Mock del servicio RedService
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

describe("SelectRedes", () => {
  it("renderiza el select con redes activas", async () => {
    render(<SelectRedes name="redId" />);

    await waitFor(() => {
      const select = screen.getByTestId("select");
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(2); // Solo redes con status === 1
      expect(options[0]).toHaveTextContent("Red A");
      expect(options[1]).toHaveTextContent("Red C");
    });
  });
});