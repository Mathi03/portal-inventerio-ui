import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { CreateFuenteDto } from "@/core/fuente/dto/create.dto";
import { FuenteService } from "@/core/fuente/fuente.service";
import { FuenteStatusEnumOptions } from "@/core/fuente/fuente.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
import ConfigAdicional from "./ConfigAdicional";
import Select from "@/components/Select";

type FormItem = keyof CreateFuenteDto;

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );
  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>();
  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    setRedes(data.data.data);
    setIsLoadingRed(false);
  }, []);
  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    setTipoComponentes(data.data.data);
    setIsLoadingTC(false);
  }, []);
  const onSubmit = useCallback(
    async ({
      label,
      name,
      refComponentTypeId,
      refNetworkId,
      status,
      version,
    }: CreateFuenteDto) => {
      setIsSubmitting(true);
      const fuenteService = new FuenteService();
      await fuenteService
        .create({
          label,
          name,
          version,
          status: +status,
          refNetworkId: +refNetworkId,
          refComponentTypeId: +refComponentTypeId,
          attribute: "test",
        })
        .finally(() => {
          setIsSubmitting(false);
          onSuccess();
          onClose();
        });
    },
    [onSuccess, onClose],
  );
  useEffect(() => {
    getRedes();
  }, [getRedes]);

  useEffect(() => {
    getTipoComponente();
  }, [getTipoComponente]);
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-y-auto"
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
          onChangeValue={(value) =>
            setTipoComponente(tipoComponentes.find((tc) => tc.id === +value))
          }
          options={tipoComponentes
            .filter((tc) => tc.status === 1)
            .map((tc) => ({
              text: tc.label,
              value: tc.id.toString(),
            }))}
          fullWidth
        />
        <Select
          disabled={isLoadingRedes}
          name={"refNetworkId" as FormItem}
          label="Red"
          options={redes
            .filter((red) => red.status === 1)
            .map((red) => ({
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
        <TextField name={"version" as FormItem} label="Versión" fullWidth />
        <ConfigAdicional tipoComponente={tipoComponente} />
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
