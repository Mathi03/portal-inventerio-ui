import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { TextField, useSnackbar } from "@telefonica/mistica";
import { useCallback, useState } from "react";
import Select from "@/components/Select";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { CreateTipoFuenteDto } from "@/core/tipo-fuente/dto/create.dto";
import {
  TipoFuenteStatusEnum,
  TipoFuenteStatusEnumOptions,
} from "@/core/tipo-fuente/tipo-fuente.type";
import axios from "axios";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";

const convertirFormato = (texto: string): string => {
  return texto
    .split(" ")
    .map((palabra) => palabra.toUpperCase())
    .join("_");
};

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateTipoFuenteDto>({
    name: "",
    label: "",
    status:
      TipoFuenteStatusEnumOptions[0]?.value ?? TipoFuenteStatusEnum.ACTIVO,
  });

  const handleChange = (key: keyof CreateTipoFuenteDto, value: string) => {
    setFormData((prev) => {
      if (key === "name") {
        return {
          ...prev,
          name: value,
          label: convertirFormato(value),
        };
      } else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });
  };

  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const fuenteService = new TipoFuenteService();

    try {
      await fuenteService.create({
        label: formData.label,
        name: formData.name,
        status: +formData.status,
      });

      onSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        openSnackbar({
          message: errorMessageInAPI,
          type: "CRITICAL",
        });
      } else {
        openSnackbar({
          message: errorGeneric,
          type: "CRITICAL",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSuccess, onClose, openSnackbar]);

  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-y-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Crear mantenedor de tipo fuente</h4>
        <p>
          Ingrese todos los datos correspondientes para crear con éxito un
          mantenedor de tipo fuente
        </p>
      </header>

      <div className="grid gap-4 px-6 content-start">
        <TextField
          name="name"
          label="Nombre"
          fullWidth
          maxLength={255}
          value={formData.name}
          onChangeValue={(value) => handleChange("name", value)}
        />
        <TextField
          name="label"
          label="Etiqueta"
          fullWidth
          maxLength={255}
          value={formData.label}
          onChangeValue={(value) => handleChange("label", value)}
        />
        <Select
          name="status"
          label="Estado"
          options={TipoFuenteStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          value={formData.status.toString()}
          onChangeValue={(value) => handleChange("status", value)}
          fullWidth
        />
      </div>

      <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee]">
        <Button showSpinner={isSubmitting} onClick={onSubmit}>
          Guardar
        </Button>
        <Button variant="link" onClick={onClose}>
          Cerrar
        </Button>
      </footer>
    </Aside>
  );
}
