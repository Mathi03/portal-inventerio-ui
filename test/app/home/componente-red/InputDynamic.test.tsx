import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputDynamic from "@/app/(home)/componente-red/InputDynamic";

// Mocks
jest.mock("@telefonica/mistica", () => ({
  TextField: ({ label, name, value, onChange }: any) => (
    <input
      aria-label={label}
      name={name}
      value={value}
      onChange={(e) => onChange(e)}
    />
  ),
  IntegerField: ({ label, name, value, onChange }: any) => (
    <input
      aria-label={label}
      name={name}
      type="number"
      value={value}
      onChange={(e) => onChange(e)}
    />
  ),
  Select: ({ label, name, value, onChangeValue, options }: any) => (
    <select
      aria-label={label}
      name={name}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.text}
        </option>
      ))}
    </select>
  ),
  DateField: ({ label, name, value, onChange }: any) => (
    <input
      aria-label={label}
      name={name}
      type="date"
      value={value}
      onChange={(e) => onChange(e)}
    />
  ),
}));

jest.mock("react-select-async-paginate", () => ({
  AsyncPaginate: ({ loadOptions, onChange }: any) => (
    <input
      aria-label="async-select"
      onChange={() =>
        onChange({ label: "Async Option", value: "async-value" })
      }
    />
  ),
}));

jest.mock("@/components/SelectField", () => (props: any) => (
  <select
    aria-label={props.label}
    onChange={(e) => props.onChangeValue(e.target.value)}
  >
    {props.options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    ))}
  </select>
));

jest.mock("@/components/Modal", () => ({ children, open }: any) =>
  open ? <div data-testid="modal">{children}</div> : null
);

jest.mock("@/app/crear-componente-red/CreateForm", () => () => (
  <div>Formulario de creación</div>
));

describe("InputDynamic", () => {
  const baseProps = {
    name: "testField",
    label: "Campo de prueba",
    onChange: jest.fn(),
    networkId: 1,
    regionId: 2,
    stationId: 3,
  };

  it("renderiza un TextField cuando html_form_type es 'input'", () => {
    render(<InputDynamic {...baseProps} html_form_type="input" />);
    expect(screen.getByLabelText("Campo de prueba")).toBeInTheDocument();
  });

  it("renderiza un IntegerField cuando type es 'number'", () => {
    render(
      <InputDynamic {...baseProps} html_form_type="input" type="number" />
    );
    expect(screen.getByLabelText("Campo de prueba")).toHaveAttribute(
      "type",
      "number"
    );
  });

  it("renderiza un Select cuando html_form_type es 'select'", () => {
    render(
      <InputDynamic
        {...baseProps}
        html_form_type="select"
        selectOptions={[{ text: "Opción 1", value: "1" }]}
      />
    );
    expect(screen.getByLabelText("Campo de prueba")).toBeInTheDocument();
  });

  it("renderiza un DateField cuando html_form_type es 'date'", () => {
    render(<InputDynamic {...baseProps} html_form_type="date" />);
    expect(screen.getByLabelText("Campo de prueba")).toHaveAttribute(
      "type",
      "date"
    );
  });

  it("renderiza un SelectField cuando html_form_type es 'multiple'", () => {
    render(
      <InputDynamic
        {...baseProps}
        html_form_type="multiple"
        selectOptions={[{ text: "Opción M", value: "M" }]}
      />
    );
    expect(screen.getByLabelText("Campo de prueba")).toBeInTheDocument();
  });

  it("abre el modal de creación cuando isCreate es true", () => {
    render(
      <InputDynamic
        {...baseProps}
        html_form_type="input"
        isCreate
      />
    );
    fireEvent.click(screen.getByText("Crear"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Formulario de creación")).toBeInTheDocument();
  });
});