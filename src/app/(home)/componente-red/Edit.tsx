import Aside from "@/components/Aside";
import Select from "@/components/Select";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useState } from "react";
import ConfigAdicional from "./ConfigAdicional";
import Button from "@/components/Button";
import { RedType } from "@/core/red/red.type";
import { CreateComponenteRedDto } from "@/core/componente-red/dto/create.dto";
import { RedService } from "@/core/red/red.service";
import { FuenteService } from "@/core/fuente/fuente.service";
import { FuenteType } from "@/core/fuente/fuente.type";
import {
  ComponenteRedType,
  CRStatusEnumOptions,
} from "@/core/componente-red/componente-red.type";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
type FormItem = keyof CreateComponenteRedDto;
export default function Edit({
  componenteRed,
  onSuccess,
  onClose,
}: {
  componenteRed: ComponenteRedType | null;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [isLoadingFuentes, setIsLoadingFuentes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );
  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>();
  const [fuentes, setFuentes] = useState<FuenteType[]>([]);
  const [attribute, setAttribute] = useState<any>({});
  const [service, setService] = useState<any>({});

  console.log(JSON.parse(componenteRed?.attribute)[0]);

  const getTipoComponente = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({});
    setTipoComponentes(data.data.data);
    setTipoComponente(
      data.data.data.find(
        (data) => data.id === componenteRed?.refComponentTypeId,
      ),
    );
    setIsLoadingTC(false);
  }, [componenteRed]);

  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    setRedes(data.data.data);
    setIsLoadingRed(false);
  }, []);

  const getFuentes = useCallback(async () => {
    setIsLoadingFuentes(true);
    const fuenteService = new FuenteService();
    const { data } = await fuenteService.findAll({ page: 1, limit: 20 });
    setFuentes(data.data.data);
    setIsLoadingFuentes(false);
  }, []);

  const onSubmit = useCallback(
    async (form: any) => {
      const {
        label,
        name,
        stationId,
        refSourceId,
        refComponentTypeId,
        refNetworkId,
        regionId,
        observation,
        control_label,
        control_name,
        control_status,
        service_label,
        service_name,
        service_status,
      } = form;
      // setIsSubmitting(true);
      const componenteRedService = new ComponenteRedService();
      await componenteRedService.create({
        label,
        name,
        stationId: +stationId,
        refSourceId: +refSourceId,
        refComponentTypeId: +refComponentTypeId,
        refNetworkId: +refNetworkId,
        regionId: +regionId,
        status: +form.status,
        // componentId: 1,
        attribute: JSON.stringify([attribute]),
        observation,
        service: {
          label: service_label,
          name: service_name,
          status: +service_status,
          attribute: JSON.stringify([service]),
        },
        control: {
          label: control_label,
          name: control_name,
          status: +control_status,
        },
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    },
    [onSuccess, onClose, attribute, service],
  );

  useEffect(() => {
    getTipoComponente();
  }, [getTipoComponente]);

  useEffect(() => {
    getRedes();
  }, [getRedes]);

  useEffect(() => {
    getFuentes();
  }, [getFuentes]);
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Editar componente de red</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          componente de red
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as CreateComponenteRedDto)}
        className="grid content-start gap-4 px-6"
        initialValues={{
          ...componenteRed,
          status: componenteRed?.status.toString(),
          ...JSON.parse(componenteRed?.attribute)[0],
        }}
      >
        <TextField name={"code" as FormItem} label="Código" fullWidth />
        <TextField name={"name" as FormItem} label="Nombre" fullWidth />
        <TextField name={"label" as FormItem} label="Etiqueta" fullWidth />
        <Select
          name={"regionId" as FormItem}
          label="Región"
          options={[
            {
              text: "Caracas",
              value: "1",
            },
            {
              text: "Valencia",
              value: "2",
            },
          ]}
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
          disabled={isLoadingFuentes}
          name={"refSourceId" as FormItem}
          label="Fuente"
          options={fuentes
            .filter((fuente) => fuente.status === 1)
            .map((fuente) => ({
              text: fuente.label,
              value: fuente.id.toString(),
            }))}
          fullWidth
        />
        <Select
          name={"stationId" as FormItem}
          label="Estación"
          options={[
            {
              text: "Estación valencia",
              value: "1",
            },
          ]}
          fullWidth
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
          name={"status" as FormItem}
          label="Status"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        {/* <hr />
        <h4 className="text-[20px]">Control</h4>
        <p>
          Asegurece de dejar todo el detalle de las observaciones previas antes
          de la creación
        </p>
        <TextField name="control_label" label="Control etiqueta" fullWidth />
        <TextField name="control_name" label="Control nombre" fullWidth />
        <Select
          name="control_status"
          label="Control estado"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        /> */}
        <ConfigAdicional
          tipoComponente={tipoComponente}
          onAttributes={(name, value) => {
            attribute[name] = value;
            setAttribute({ ...attribute });
          }}
          onServices={(name, value) => {
            service[name] = value;
            setService({ ...service });
          }}
        />
        <hr />
        <h4 className="text-[20px]">Observación</h4>
        <p>
          Asegurece de dejar todo el detalle de las observaciones previas antes
          de la creación
        </p>
        <TextField
          name={"observation" as FormItem}
          label="Observación"
          fullWidth
          multiline
        />
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
