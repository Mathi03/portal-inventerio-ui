import React from "react";
import { render, screen } from "@testing-library/react";
import ExportXLS from "@/app/(home)/mantenedor-fuente/ExportXLS";

// Mocks para evitar dependencias reales
jest.mock("@/components/Button", () => (props: any) => (
  <button disabled={props.disabled} data-testid="button">
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
  Checkbox: ({ name, children }: any) => (
    <label data-testid={`checkbox-${name}`}>{children}</label>
  ),
}));

describe("ExportXLS", () => {
 it("renderiza el título, descripción y campos", () => {
  render(<ExportXLS />);

  const exportarElements = screen.getAllByText("Exportar XLS");
  expect(exportarElements.length).toBeGreaterThan(1);

  expect(
    screen.getByText("Selecciones los campos que quieres incluir dentro del XLS")
  ).toBeInTheDocument();

  expect(screen.getByText("Descargar")).toBeInTheDocument();

  expect(screen.getByTestId("checkbox-id")).toBeInTheDocument();
  expect(screen.getByTestId("checkbox-label")).toBeInTheDocument();
  expect(screen.getByTestId("checkbox-name")).toBeInTheDocument();
  expect(screen.getByTestId("checkbox-refComponentTypeId")).toBeInTheDocument();
  expect(screen.getByTestId("checkbox-refNetworkId")).toBeInTheDocument();
  expect(screen.getByTestId("checkbox-version")).toBeInTheDocument();
  expect(screen.getByTestId("checkbox-status")).toBeInTheDocument();
});

});