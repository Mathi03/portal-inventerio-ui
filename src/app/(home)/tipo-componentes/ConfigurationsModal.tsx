import InputJson from "@/components/InputJson";
import { ButtonSecondary, ButtonPrimary } from "@telefonica/mistica";
import { useState } from "react";

function ConfigurationsModal({
  type,
  row,
  onClose,
  onSave,
}: {
  type: 'attributes' | 'services';
  row: any;
  onClose: () => void;
  onSave: (key: string, type: 'attributes' | 'services', value: any) => void;
}) {
  const [tempValue, setTempValue] = useState<any>(
    type === 'attributes'
      ? row.configAttributes ?? []
      : row.configServices ?? []
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (value: string) => {
 if (!value) {
    setJsonError('JSON inválido');
    return;
  }else {
  if(value){
    setTempValue(value);
  }
    setJsonError(null);
  } 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-xl shadow-2xl p-8 min-w-[600px] max-h-[80vh] flex flex-col gap-6 relative"
        style={{ maxHeight: '80vh' }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Editar {type === 'attributes' ? 'Atributos' : 'Servicios'} para {row.red && typeof row.red === 'object' ? row.red.label : row.red}
        </h3>
        <div className="flex-1 overflow-y-auto">
          <InputJson
            codeDefault={JSON.stringify(
              type === 'attributes'
                ? row.configAttributes ?? []
                : row.configServices ?? []
            )}
            label={type === 'attributes' ? "Configuracion de Atributos" : "Configuracion de Servicios"}
            onChange={handleJsonChange}
          />
          {jsonError && (
            <div className="text-red-500 mt-2">{jsonError}</div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={onClose}>Cerrar</ButtonSecondary>
          <ButtonPrimary
            onPress={() => {
              onSave(row.id, type, tempValue);
              onClose();
            }}
            disabled={!!jsonError}
          >
            Guardar
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

export default ConfigurationsModal;