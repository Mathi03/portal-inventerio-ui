import Aside from "@/components/Aside";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { UpdateFuenteDto } from "@/core/fuente/dto/update.dto";
import { FuenteService } from "@/core/fuente/fuente.service";
import { FuenteStatusEnumOptions, FuenteType } from "@/core/fuente/fuente.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
type FormItem = keyof UpdateFuenteDto;
export default function Edit({
  fuente,
  onClose,
  onSuccess,
}: {
  fuente: FuenteType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRedes, setIsLoadingRedes] = useState(true);
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );
  const getRedes = useCallback(async () => {
    setIsLoadingRedes(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    setRedes(data.data.data);
    setIsLoadingRedes(false);
  }, []);

  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    setTipoComponentes(data.data.data);
    setIsLoadingTC(false);
  }, []);

  const onSubmit = useCallback(
    async (form: UpdateFuenteDto) => {
      setIsSubmitting(true);
      const fuenteService = new FuenteService();
      await fuenteService
        .update(fuente.id, {
          ...form,
          status: +form.status,
          refNetworkId: +form.refNetworkId,
          refComponentTypeId: +form.refComponentTypeId,
        })
        .finally(() => {
          setIsSubmitting(false);
          onSuccess();
          onClose();
        });
    },
    [fuente, onSuccess, onClose],
  );

  useEffect(() => {
    getRedes();
  }, [getRedes]);

  useEffect(() => {
    getTipoComponente();
  }, [getTipoComponente]);
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Editar mantenedor de fuente</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          mantenedor de fuente
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as UpdateFuenteDto)}
        className="grid gap-4 px-6 content-start"
        initialValues={{
          ...fuente,
          status: fuente.status.toString(),
          refNetworkId: fuente.refNetworkId.toString(),
          refComponentTypeId: fuente.refComponentTypeId.toString(),
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
        <TextField name={"version" as FormItem} label="Versión" fullWidth />
        <TextField name={"attribute" as FormItem} label="Atributo" fullWidth />
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
