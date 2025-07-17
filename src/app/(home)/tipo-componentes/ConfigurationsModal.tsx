import InputJson from "@/components/InputJson";
import { ButtonSecondary, ButtonPrimary } from "@telefonica/mistica";
import { useState } from "react";
import { jsonSchemaAttribute } from "./jsonSchemaAttribute";
import { ZodError, ZodIssue } from "zod";

const validateJson = (value: any, type: "attributes" | "services") => {
  const result =
    type === "attributes"
      ? jsonSchemaAttribute.safeParse(value)
      : jsonSchemaAttribute.safeParse(value);

  if (!result.success) {
    const error = result.error;
    return { success: false, error };
  }

  return { success: true, error: null };
};

const traducirLiteral = (issue: ZodIssue) => {
  if (issue.code === "invalid_literal") {
    return `Valor no permitido. Se esperaba "${issue.expected}", pero se recibió "${issue.received}"`;
  }
  return issue.message;
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
    try {
      const { success, error } = validateJson(value, type);
      console.log("error", error);

      if (!success && error instanceof ZodError) {
        const messages: string[] = [];

        error.errors.forEach((err) => {
          const path =
            err.path.length > 0 ? err.path.join(".") : "raíz del objeto";

          if (err.code === "invalid_union" && "unionErrors" in err) {
            const allLiterals = err.unionErrors.every((unionErr: ZodError) =>
              unionErr.errors.every((issue) => issue.code === "invalid_literal")
            );

            if (allLiterals) {
              const expectedValues = err.unionErrors.flatMap(
                (unionErr: ZodError) =>
                  unionErr.errors
                    .filter((i) => i.code === "invalid_literal")
                    .map((i) => `"${i.expected}"`)
              );

              const receivedValue = err.unionErrors[0]?.errors[0]?.received;

              messages.push(
                `- Error en "${path}": Valor no permitido.\n  Se esperaba uno de: ${[...new Set(expectedValues)].join(", ")}.\n  Se recibió: "${receivedValue}".`
              );
            } else {
              const unionMessages = err.unionErrors.flatMap(
                (unionErr: ZodError) =>
                  unionErr.errors.map(
                    (issue) => `- Error en "${path}": ${issue.message}`
                  )
              );
              messages.push(...unionMessages);
            }
          } else {
            messages.push(`- Error en "${path}": ${err.message}`);
          }
        });

        setJsonError(messages.join("\n"));
      } else {
        setJsonError("");
        setTempValue(value);
      }
    } catch (_e: any) {
      setJsonError("El contenido no es un JSON válido.");
    }
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
          {jsonError && <div className="text-red-500 mt-2 whitespace-pre-line">{jsonError}</div>}
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
