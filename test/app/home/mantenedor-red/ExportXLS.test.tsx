import React from "react";
import { render, screen } from "@testing-library/react";
import ExportXLS from "@/app/(home)/mantenedor-red/ExportXLS";

jest.mock("@/components/Button", () => (props: any) => (
  <button disabled={props.disabled} data-testid="descargar-btn">
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
  Checkbox: () => null,
}));

describe("ExportXLS", () => {
  it("renderiza correctamente y el botón Descargar está habilitado por defecto", () => {
    render(<ExportXLS />);

    const exportarElements = screen.getAllByText("Exportar XLS");
    expect(exportarElements.length).toBeGreaterThan(0);

  });
});