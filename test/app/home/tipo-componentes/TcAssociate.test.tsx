import { render, screen, fireEvent } from "@testing-library/react";
import { TcAssociate } from "@/app/(home)/tipo-componentes/TcAssociate";

describe("TcAssociate component", () => {
  it("should render the component", () => {
    render(<TcAssociate onClose={() => {}} />);
    expect(screen.getByText("TcAssociate")).toBeInTheDocument();
  });

});
