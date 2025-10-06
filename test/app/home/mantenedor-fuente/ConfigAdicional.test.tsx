import React from "react";
import { render, screen } from "@testing-library/react";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import ConfigAdicional from "@/app/(home)/componente-red/ConfigAdicional";

jest.mock("next/link", () => ({ children, href }: any) => (
  <a href={href}>{children}</a>
));
jest.mock("@/components/Icon", () => () => <span data-testid="icon">Icon</span>);
jest.mock("@/components/InputDynamic", () => (props: any) => (
  <div data-testid="input-dynamic">{props.label || "InputDynamic"}</div>
));

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

describe("ConfigAdicional", () => {
  const mockTipoComponente = {
    name: "Componente X",
    configAttributes: [
      { label: "Attr 1", name: "attr1", type: "text" },
      { label: "Attr 2", name: "attr2", type: "number" },
    ],
    configServices: [
      { label: "Service 1", name: "service1", type: "text" },
    ],
  };


  it("no renderiza nada si tipoComponente es null", () => {
    const { container } = renderWithTheme(<ConfigAdicional tipoComponente={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});