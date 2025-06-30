import InputJson from "@/components/InputJson";
import { ButtonSecondary, ButtonPrimary } from "@telefonica/mistica";
import { useState } from "react";
import { jsonSchema } from "./jsonSchema";

const validateJson = (value: any) => {
  const result = jsonSchema.safeParse(value);
  if (!result.success) {
    console.log("Errores de validación:", result.error.format());
    return false;
  }
  console.log("Validación exitosa ✅");
  return true;
};

function ConfigurationsModal({
  type,
  row,
  onClose,
  onSave,
  mode,
}: {
  type: "attributes" | "services";
  row: any;
  onClose: () => void;
  onSave: (key: string, type: "attributes" | "services", value: any) => void;
  mode?: "view";
}) {
  const [tempValue, setTempValue] = useState<any>(
    type === "attributes"
      ? (row.configAttributes ?? [])
      : (row.configServices ?? [])
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (value: string) => {
    console.log("value json", value);

    const isValid = validateJson(value);
    if (!isValid) {
      setJsonError("JSON inválido");
    } else setJsonError("");

    if (value) {
      setTempValue(value);
    }
    // setJsonError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-[70%] max-h-[80vh] flex flex-col gap-6 relative h-full">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Editar {type === "attributes" ? "Atributos" : "Servicios"} para{" "}
          {row.red && typeof row.red === "object" ? row.red.label : row.red}
        </h3>
        <div className="flex flex-col h-full overflow-auto">
          <InputJson
            readonly={mode === "view"}
            codeDefault={JSON.stringify(
              type === "attributes"
                ? (row.configAttributes ?? [])
                : (row.configServices ?? [])
            )}
            label={
              type === "attributes"
                ? "Configuracion de Atributos"
                : "Configuracion de Servicios"
            }
            onChange={handleJsonChange}
          />
          {jsonError && <div className="text-red-500 mt-2">{jsonError}</div>}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={onClose}>Cerrar</ButtonSecondary>
          {mode !== "view" && (
            <ButtonPrimary
              onPress={() => {
                onSave(row.id, type, tempValue);
                onClose();
              }}
              disabled={!!jsonError}
            >
              Guardar
            </ButtonPrimary>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfigurationsModal;
