import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExportXLS from "@/app/(home)/mantenedor-tipo-componente/ExportXLS";

// Mocks para evitar dependencias reales
jest.mock("@/components/Button", () => (props: any) => (
  <button disabled={props.disabled} onClick={props.onClick}>
    {props.children}
  </button>
));
jest.mock("@/components/Icon", () => () => <span>Icon</span>);
jest.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@telefonica/mistica", () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  Checkbox: ({ children, name, onChange }: any) => (
    <label>
      <input
        type="checkbox"
        defaultChecked
        onChange={(e) => onChange(e.target.checked)}
        data-testid={`checkbox-${name}`}
      />
      {children}
    </label>
  ),
}));

describe("ExportXLS", () => {

  it("deshabilita el botón Descargar si todos los campos están desmarcados", () => {
    render(<ExportXLS />);
    fireEvent.click(screen.getByTestId("checkbox-id"));
    fireEvent.click(screen.getByTestId("checkbox-label"));
    fireEvent.click(screen.getByTestId("checkbox-name"));
    fireEvent.click(screen.getByTestId("checkbox-status"));
    expect(screen.getByText("Descargar")).toBeDisabled();
  });

  it("habilita el botón Descargar si al menos un campo está marcado", () => {
    render(<ExportXLS />);
    fireEvent.click(screen.getByTestId("checkbox-id")); // desmarca id
    fireEvent.click(screen.getByTestId("checkbox-label")); // desmarca label
    fireEvent.click(screen.getByTestId("checkbox-name")); // desmarca name
    // status sigue marcado
    expect(screen.getByText("Descargar")).not.toBeDisabled();
  });
});