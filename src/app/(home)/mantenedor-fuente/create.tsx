import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { CreateFuenteDto } from "@/core/fuente/dto/create.dto";
import { FuenteService } from "@/core/fuente/fuente.service";
import { FuenteStatusEnumOptions } from "@/core/fuente/fuente.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField, useSnackbar } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
import ConfigAdicional from "./ConfigAdicional";
import Select from "@/components/Select";
import axios from "axios";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { TipoFuenteType } from "@/core/tipo-fuente/tipo-fuente.type";

type FormItem = keyof CreateFuenteDto;

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

  const onSubmit = useCallback(
    async ({
      label,
      name,
      refComponentTypeId,
      refNetworkId,
      status,
      version,
      attribute,
      refTypeSourceId,
    }: CreateFuenteDto) => {
      setIsSubmitting(true);
      const fuenteService = new FuenteService();

      try {
        await fuenteService.create({
          label,
          name,
          version,
          status: +status,
          refNetworkId: +refNetworkId,
          refComponentTypeId: +refComponentTypeId,
          refTypeSourceId: +refTypeSourceId,
          attribute,
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
    },
    [onSuccess, onClose, openSnackbar]
  );

  useEffect(() => {
    getRedes();
  }, [getRedes]);

  useEffect(() => {
    getTipoComponente();
  }, [getTipoComponente]);

  useEffect(() => {
    getTipoFuente();
  }, [getTipoFuente]);

  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-y-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Crear mantenedor de fuente</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de fuente
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as CreateFuenteDto)}
        className="grid gap-4 px-6 content-start"
        initialValues={{
          label: "",
          name: "",
          refComponentTypeId: "",
          refNetworkId: "",
          refTypeSourceId: "",
          status: FuenteStatusEnumOptions[0]?.value.toString() ?? "1",
          version: "",
        }}
      >
        <TextField
          name={"label" as FormItem}
          label="Etiqueta"
          fullWidth
          maxLength={255}
        />
        <TextField
          name={"name" as FormItem}
          label="Nombre"
          fullWidth
          maxLength={255}
        />
        <Select
          disabled={isLoadingTC}
          name={"refComponentTypeId" as FormItem}
          label="Tipo de componente"
          options={tipoComponentes.map((tc) => ({
            text: tc.label,
            value: tc.id.toString(),
          }))}
          fullWidth
        />
        <Select
          disabled={isLoadingRedes}
          name={"refNetworkId" as FormItem}
          label="Red"
          options={redes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
          fullWidth
        />
        <Select
          name={"status" as FormItem}
          label="Estado"
          options={FuenteStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        <Select
          name="refTypeSourceId"
          label="Tipo Fuente"
          fullWidth
          disabled={isLoadingTF}
          options={tipoFuentes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
        />
        <TextField name={"version" as FormItem} label="Versión" fullWidth />
        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee]">
          <Button showSpinner={isSubmitting}>Guardar</Button>
          <Button variant="link" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </Form>
    </Aside>
  );
}
