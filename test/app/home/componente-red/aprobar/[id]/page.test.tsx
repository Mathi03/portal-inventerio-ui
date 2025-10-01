import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AprobarComponenteRed from "@/app/(home)/componente-red/aprobar/[id]/page";

// Mocks
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "123" }),
}));

jest.mock("@/core/componente-red/componente-red.service", () => ({
  ComponenteRedService: jest.fn().mockImplementation(() => ({
    getById: jest.fn().mockResolvedValue({
      id: 123,
      name: "CompRed A",
      label: "Etiqueta A",
      status: 1,
    }),
  })),
}));

jest.mock("@/app/detalle-componente-red/[id]/Header", () => (props: any) => (
  <div data-testid="header">Header: {props.componenteRed?.name}</div>
));

jest.mock("@/app/detalle-componente-red/[id]/NavMenu", () => () => (
  <div data-testid="nav-menu">NavMenu</div>
));

jest.mock("@/app/crear-componente-red/CreateForm", () => (props: any) => (
  <div data-testid="create-form">CreateForm: {props.mode}</div>
));

describe("AprobarComponenteRed", () => {
  it("renderiza Header, NavMenu y CreateForm con datos cargados", async () => {
    render(<AprobarComponenteRed />);

    await waitFor(() => {
      expect(screen.getByTestId("header")).toHaveTextContent("CompRed A");
      expect(screen.getByTestId("nav-menu")).toBeInTheDocument();
      expect(screen.getByTestId("create-form")).toHaveTextContent("approve");
    });
  });
});