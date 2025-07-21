"use client";
import { ButtonPrimary, ButtonSecondary, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
import useTipoComponente from "./useTipoComponente";
import usePagination from "@/hooks/usePagination";

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
  redesHijo: any[];
  onSave: (association: {
    parentId: number;
    parentRedId: number;
    childRedId: number;
    childType: string;
  }) => void;
  initialStep?: number;
  initialParent?: any;
  initialParentRed?: any;
  initialChildRed?: any;
  tipoComponenteId: number;
  parentAssociations: any[];
}) {
  const [step, setStep] = useState(initialStep);
  const [searchParent, setSearchParent] = useState<string>("");
  const [debouncedSearchParent, setDebouncedSearchParent] =
    useState<string>("");
  const [selectedParent, setSelectedParent] = useState<any>(initialParent);
  const [selectedParentRed, setSelectedParentRed] =
    useState<any>(initialParentRed);
  const [selectedChildRed, setSelectedChildRed] =
    useState<any>(initialChildRed);
  const {
    getTipoComponentes,
    tipoComponentes,
    allTipoComponente,
    allTipoComponentes,
  } = useTipoComponente();
  const { page, limit } = usePagination();
  const [networksId, setNetworksId] = useState<any[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchParent && searchParent.length >= 2) {
        setDebouncedSearchParent(searchParent);
      } else {
        setDebouncedSearchParent("");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchParent]);

  const onLoadTypeComponent = useCallback(() => {
    getTipoComponentes({ search: debouncedSearchParent, page, limit: 1000 });
  }, [debouncedSearchParent, page, limit, getTipoComponentes]);

  useEffect(() => {
    onLoadTypeComponent();
  }, [onLoadTypeComponent]);

  useEffect(() => {
    setNetworksId([]);
    if (selectedParent) {
      allTipoComponentes({
        idList: [selectedParent.id],
      });
    }
  }, [selectedParent]);

  useEffect(() => {
    if (allTipoComponente.length > 0) {
      allTipoComponente[0].configData?.map((config: any) => {
        setNetworksId((prev: any) => [...prev, config.networkId]);
      });
    }
  }, [allTipoComponente]);

  if (step === 1) {
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
          <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
            Selecciona el componente padre
          </h3>
          <TextField
            name="searchParent"
            label="Buscar componente padre"
            value={searchParent}
            onChange={(e) => {
              setSearchParent(e.target.value);
            }}
            fullWidth
          />
          <div
            className="flex-1 overflow-auto border rounded-md p-2"
            style={{ maxHeight: 200 }}
          >
            <ul>
              {tipoComponentes
                .filter((tc) => tc.id != tipoComponenteId)
                .map((tc) => (
                  <li
                    key={tc.id}
                    className="border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    <button
                      className={`w-full text-left p-2 rounded ${selectedParent?.id === tc.id ? "bg-blue-100" : ""}`}
                      onClick={() => setSelectedParent(tc)}
                    >
                      {tc.label}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <ButtonSecondary onPress={onClose}>Cancelar</ButtonSecondary>
            <ButtonPrimary
              disabled={!selectedParent}
              onPress={() => setStep(2)}
            >
              Siguiente
            </ButtonPrimary>
          </div>
        </div>
      </div>
    );
  }

  // Paso 2: Selecciona red del padre
  if (step === 2) {
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
          <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
            Selecciona la red del componente padre
          </h3>
          {/* <div className="border border-gray-300 rounded-lg p-4 mb-4"> */}
          <div
            className="flex-1 overflow-auto border rounded-md p-2"
            style={{ maxHeight: 200 }}
          >
            <ul>
              {redesPadre.filter((red) => networksId?.includes(red.id)).length >
              0 ? (
                redesPadre
                  .filter((red) => networksId?.includes(red.id))
                  ?.map((red) => (
                    <li
                      key={red.id}
                      className="border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      <button
                        className={`w-full text-left p-2 rounded ${selectedParentRed?.id === red.id ? "bg-blue-100" : ""}`}
                        onClick={() => setSelectedParentRed(red)}
                      >
                        {red.name}
                      </button>
                    </li>
                  ))
              ) : (
                <li className="text-gray-500 p-2">
                  No hay redes padre disponibles para asociar.
                </li>
              )}
            </ul>
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
        </div>
      </div>
    );
  }

  // Paso 3: Selecciona red del hijo
  if (step === 3) {
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
          <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
            Selecciona la red del tipo de componente hijo
          </h3>
          <div className="border border-gray-300 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-[#0057b8] mb-2">
              Red del tipo de componente hijo
            </h4>
            <ul>
              {redesHijo.filter(
                (redHija) =>
                  !parentAssociations.some(
                    (association) =>
                      association.parentRedId === selectedParentRed.id &&
                      association.childRedId === redHija.id
                  )
              ).length > 0 ? (
                redesHijo
                  .filter(
                    (redHija) =>
                      !parentAssociations.some(
                        (association) =>
                          association.parentRedId === selectedParentRed.id &&
                          association.childRedId === redHija.id
                      )
                  )
                  .map((red) => (
                    <li
                      key={red.id}
                      className="border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      <button
                        className={`w-full text-left p-2 rounded ${selectedChildRed?.id === red.id ? "bg-blue-100" : ""}`}
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
                onSave({
                  parentId: selectedParent.id,
                  parentRedId: selectedParentRed.id,
                  childRedId: selectedChildRed.id,
                  childType: childName,
                });
                setSearchParent("");
                onClose();
              }}
            >
              Asociar
            </ButtonPrimary>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ParentAssociationWizardModal;
