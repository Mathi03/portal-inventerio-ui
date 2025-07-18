import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { CreateFuenteDto } from "@/core/fuente/dto/create.dto";
import { FuenteService } from "@/core/fuente/fuente.service";
import {
  FuenteStatusEnum,
  FuenteStatusEnumOptions,
} from "@/core/fuente/fuente.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { TextField, useSnackbar } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
import Select from "@/components/Select";
import axios from "axios";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { TipoFuenteType } from "@/core/tipo-fuente/tipo-fuente.type";
import SearchableSelect from "@/components/SearchableSelect";

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
  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [isLoadingTF, setIsLoadingTF] = useState(true);

  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    []
  );
  const [tipoFuentes, setTipoFuentes] = useState<TipoFuenteType[]>([]);

  const [formData, setFormData] = useState<CreateFuenteDto>({
    name: "",
    label: "",
    refComponentTypeId: "",
    refNetworkId: "",
    refTypeSourceId: "",
    status: FuenteStatusEnumOptions[0]?.value ?? FuenteStatusEnum.ACTIVO,
    version: "",
    attribute: "",
  });

  const handleChange = (key: keyof CreateFuenteDto, value: any) => {
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
    const fuenteService = new FuenteService();
    try {
      await fuenteService.create({
        ...formData,
        status: Number(formData.status),
        refNetworkId: Number(formData.refNetworkId),
        refComponentTypeId: Number(formData.refComponentTypeId),
        refTypeSourceId: Number(formData.refTypeSourceId),
      });

      onSuccess();
      onClose();
    } catch (err) {
      openSnackbar({
        message:
          axios.isAxiosError(err) && err.response
            ? errorMessageInAPI
            : errorGeneric,
        type: "CRITICAL",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSuccess, onClose, openSnackbar]);

  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    const allData = data.data.data
      .filter((red) => red.status === 1)
      .sort((a, b) => a.label.localeCompare(b.label));
    setRedes(allData);
    setIsLoadingRed(false);
  }, []);

  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    const allData = data.data.data
      .filter((tc) => tc.status === 1)
      .sort((a, b) => a.label.localeCompare(b.label));
    setTipoComponentes(allData);
    setIsLoadingTC(false);
  }, []);

  const getTipoFuente = useCallback(async () => {
    setIsLoadingTF(true);
    const tfService = new TipoFuenteService();
    const { data } = await tfService.findAll({});
    const allData = [...data.data.data].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    setTipoFuentes(allData);
    setIsLoadingTF(false);
  }, []);

  useEffect(() => {
    getRedes();
    getTipoComponente();
    getTipoFuente();
  }, [getRedes, getTipoComponente, getTipoFuente]);

  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-y-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Crear mantenedor de fuente</h4>
        <p>
          Ingrese todos los datos correspondientes para crear con éxito un
          mantenedor de fuente
        </p>
      </header>

      <section className="grid gap-4 px-6 content-start">
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
        <SearchableSelect
          name="refComponentTypeId"
          label="Tipo de componente"
          disabled={isLoadingTC}
          helperText={
            isLoadingTC ? "Cargando tipo de componentes..." : undefined
          }
          options={tipoComponentes.map((tc) => ({
            text: tc.label,
            value: tc.id.toString(),
          }))}
          value={formData.refComponentTypeId.toString()}
          onChangeValue={(value) => handleChange("refComponentTypeId", value)}
          fullWidth
        />
        <SearchableSelect
          name="refNetworkId"
          label="Red"
          disabled={isLoadingRedes}
          helperText={isLoadingRedes ? "Cargando redes..." : undefined}
          options={redes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
          value={formData.refNetworkId.toString()}
          onChangeValue={(value) => handleChange("refNetworkId", value)}
          fullWidth
        />
        <Select
          name="status"
          label="Estado"
          options={FuenteStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          value={formData.status.toString()}
          onChangeValue={(value) => handleChange("status", Number(value))}
          fullWidth
        />
        <SearchableSelect
          name="refTypeSourceId"
          label="Tipo Fuente"
          fullWidth
          disabled={isLoadingTF}
          helperText={isLoadingTF ? "Cargando tipos de fuente..." : undefined}
          options={tipoFuentes.map((tf) => ({
            text: tf.label,
            value: tf.id.toString(),
          }))}
          value={formData.refTypeSourceId.toString()}
          onChangeValue={(value) => handleChange("refTypeSourceId", value)}
        />
        <TextField
          name="version"
          label="Versión"
          fullWidth
          value={formData.version}
          onChangeValue={(value) => handleChange("version", value)}
        />
      </section>

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
