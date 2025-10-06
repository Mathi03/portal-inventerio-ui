import HomeLayout from "@/app/(home)/tipo-componentes/aprobar/[id]/layout";
import { render, screen } from "@testing-library/react";

jest.mock("material-symbols", () => ({}));


describe("HomeLayout", () => {
  it("renderiza el contenido dentro del layout", () => {
    render(
      <HomeLayout>
        <h1>Contenido de prueba</h1>
      </HomeLayout>
    );

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });

  it("aplica la clase de grid correctamente", () => {
    const { container } = render(
      <HomeLayout>
        <div>Contenido</div>
      </HomeLayout>
    );

    const main = container.querySelector("main");
    expect(main).toHaveClass("grid");
    expect(main).toHaveClass("grid-rows-[auto_1fr]");
  });
});