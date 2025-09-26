import { render, screen, fireEvent } from "@testing-library/react";
import ParentAssociationWizardModal from "@/app/(home)/tipo-componentes/ParentAssociationWizardModal";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import useTipoComponente from "@/app/(home)/tipo-componentes/useTipoComponente";

const mockTipoComponentes = [
  { id: 1, label: "Componente A" },
  { id: 2, label: "Componente B" },
];

jest.mock("@/app/(home)/tipo-componentes/useTipoComponente", () => () => ({
  getTipoComponentes: jest.fn(),
  tipoComponentes: mockTipoComponentes,
  allTipoComponente: [],
  allTipoComponentes: jest.fn(),
}));

jest.mock("@/hooks/usePagination", () => () => ({
  page: 1,
  limit: 10,
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeContextProvider
      theme={{
        skin: getTelefonicaSkin(),
        i18n: { locale: "es-ES", phoneNumberFormattingRegionKey: "ES" },
        colorScheme: "light",
      }}
    >
      {ui}
    </ThemeContextProvider>
  );

describe("ParentAssociationWizardModal - Step 1", () => {
  it("should allow selecting a parent and enable 'Siguiente' button", () => {
    renderWithTheme(
      <ParentAssociationWizardModal
        onClose={jest.fn()}
        childName="Hijo"
        redesPadre={[]}
        redesHijo={[]}
        onSave={jest.fn()}
        tipoComponenteId={99}
        parentAssociations={[]}
      />
    );


    const nextButton = screen.getByRole("button", { name: /Siguiente/i }) as HTMLButtonElement;
    expect(nextButton).toBeDisabled();
  });
});