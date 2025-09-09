"use client";
import {
  ButtonPrimary,
  ButtonSecondary,
  Spinner,
  TextField,
} from "@telefonica/mistica";
import { useEffect, useState } from "react";
import useTipoComponente from "./useTipoComponente";
import usePagination from "@/hooks/usePagination";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { ChildComponentTypeNetwork, ConfigRelationTable } from "./Create";

function ParentAssociationWizardModal({
  onClose,
  childName,
  redesPadre,
  redesHijo,
  onSave,
  initialStep = 1,
  initialParent = null,
  initialParentRed = null,
  initialChildRed = null,
  tipoComponenteId,
  parentAssociations,
}: {
  onClose: () => void;
  childName: any;
  redesPadre: any[];
  redesHijo: ChildComponentTypeNetwork[];
  onSave: (association: ConfigRelationTable) => void;
  initialStep?: number;
  initialParent?: TipoComponenteType | null;
  initialParentRed?: any;
  initialChildRed?: any;
  tipoComponenteId: number;
  parentAssociations: any[];
}) {
  const [step, setStep] = useState(initialStep);
  const [searchParent, setSearchParent] = useState<string>("");
  const [debouncedSearchParent, setDebouncedSearchParent] =
    useState<string>("");
  const [selectedParent, setSelectedParent] =
    useState<TipoComponenteType | null>(initialParent);
  const [selectedParentRed, setSelectedParentRed] =
    useState<RedType>(initialParentRed);
  const [selectedChildRed, setSelectedChildRed] =
    useState<ChildComponentTypeNetwork>(initialChildRed);

  const {
    getTipoComponentes,
    tipoComponentes,
    allTipoComponente,
    allTipoComponentes,
    loadingTipoComponentes,
  } = useTipoComponente({});

  const { page } = usePagination();
  const [networksId, setNetworksId] = useState<any[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchParent(searchParent.length >= 2 ? searchParent : "");
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchParent]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getTipoComponentes(
      { search: debouncedSearchParent, page, limit: 1000 },
      signal
    );

    return () => {
      controller.abort();
    };
  }, [getTipoComponentes, debouncedSearchParent, page]);

  useEffect(() => {
    setNetworksId([]);
    if (selectedParent && step === 2) {
      allTipoComponentes({ idList: [selectedParent.id] });
    }
  }, [selectedParent, allTipoComponentes, step]);

  useEffect(() => {
    if (allTipoComponente.length > 0) {
      const networkIds =
        allTipoComponente[0].configData?.map((c: any) => c.networkId) || [];
      setNetworksId(networkIds);
    }
  }, [allTipoComponente]);

  const renderStep1 = () => {
    let content;

    if (loadingTipoComponentes) {
      content = (
        <section className="flex justify-center items-center w-full h-full min-h-[100px]">
          <Spinner size={56} />
        </section>
      );
    } else if (!tipoComponentes || tipoComponentes.length === 0) {
      content = (
        <div className="text-gray-400 text-center py-4">No hay resultados</div>
      );
    } else {
      content = tipoComponentes
        .filter((tc) => tc.id !== tipoComponenteId)
        .map((tc) => (
          <li
            key={tc.id}
            className="border border-gray-200 rounded hover:bg-gray-50"
          >
            <button
              className={`w-full text-left p-2 rounded ${
                selectedParent?.id === tc.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedParent(tc)}
            >
              {tc.label}
            </button>
          </li>
        ));
    }

    return (
      <>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Selecciona el componente padre
        </h3>
        <TextField
          name="searchParent"
          label="Buscar componente padre"
          value={searchParent}
          onChange={(e) => setSearchParent(e.target.value)}
          fullWidth
        />
        <div
          className="flex-1 overflow-auto border rounded-md p-2"
          style={{ maxHeight: 200 }}
        >
          <ul>{content}</ul>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={onClose}>Cancelar</ButtonSecondary>
          <ButtonPrimary disabled={!selectedParent} onPress={() => setStep(2)}>
            Siguiente
          </ButtonPrimary>
        </div>
      </>
    );
  };

  const renderStep2 = () => {
    let content;

    const redesDisponibles = redesPadre.filter((red) =>
      networksId.includes(red.id)
    );

    if (loadingTipoComponentes) {
      content = (
        <section className="flex justify-center items-center w-full h-full min-h-[100px]">
          <Spinner size={56} />
        </section>
      );
    } else if (!redesDisponibles || redesDisponibles.length === 0) {
      content = (
        <div className="text-gray-400 text-center py-4">
          No hay redes padre disponibles para asociar.
        </div>
      );
    } else {
      content = redesDisponibles.map((red) => (
        <li
          key={red.id}
          className="border border-gray-200 rounded hover:bg-gray-50"
        >
          <button
            className={`w-full text-left p-2 rounded ${
              selectedParentRed?.id === red.id ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelectedParentRed(red)}
          >
            {red.name}
          </button>
        </li>
      ));
    }

    return (
      <>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Selecciona la red del componente padre
        </h3>
        <div
          className="flex-1 overflow-auto border rounded-md p-2"
          style={{ maxHeight: 200 }}
        >
          <ul>{content}</ul>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={() => setStep(1)}>Atrás</ButtonSecondary>
          <ButtonPrimary
            disabled={!selectedParentRed}
            onPress={() => setStep(3)}
          >
            Siguiente
          </ButtonPrimary>
        </div>
      </>
    );
  };

  const renderStep3 = () => {
    const redesDisponibles = redesHijo.filter(
      (redHija) =>
        !parentAssociations.some(
          (a) =>
            a.parentRedId === selectedParentRed.id &&
            a.childRedId === redHija.id
        )
    );

    return (
      <>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Selecciona la red del tipo de componente hijo
        </h3>
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-[#0057b8] mb-2">
            Red del tipo de componente hijo
          </h4>
          <ul>
            {redesDisponibles.length > 0 ? (
              redesDisponibles.map((red) => (
                <li
                  key={red.id}
                  className="border border-gray-200 rounded hover:bg-gray-50"
                >
                  <button
                    className={`w-full text-left p-2 rounded ${
                      selectedChildRed?.id === red.id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setSelectedChildRed(red)}
                  >
                    {red.red}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-500 p-2">
                No hay redes hijas disponibles para asociar.
              </li>
            )}
          </ul>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={() => setStep(2)}>Atrás</ButtonSecondary>
          <ButtonPrimary
            disabled={!selectedChildRed}
            onPress={() => {
              if (selectedParent)
                onSave({
                  parentId: selectedParent?.id,
                  parentLabel: selectedParent?.label,
                  parentRedId: selectedParentRed.id,
                  parentRedName: selectedParentRed?.name,
                  childRedId: selectedChildRed.id,
                  childRedName: selectedChildRed?.red,
                  childType: childName,
                });
              setSearchParent("");
              onClose();
            }}
          >
            Asociar
          </ButtonPrimary>
        </div>
      </>
    );
  };

  /** ---------- Main render ---------- **/
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[400px] w-[800px] min-h-[220px] flex flex-col gap-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}

export default ParentAssociationWizardModal;
