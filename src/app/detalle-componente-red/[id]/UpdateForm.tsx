import Select from "@/components/Select";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField, useSnackbar } from "@telefonica/mistica";
import { useCallback, useState } from "react";
import Button from "@/components/Button";
import { RedType } from "@/core/red/red.type";
import { CreateComponenteRedDto } from "@/core/componente-red/dto/create.dto";
import {
  ComponenteRedType,
  CRStatusEnumOptions,
} from "@/core/componente-red/componente-red.type";
import RelacionJerarquica from "../Relatcion-jerarquica";
import SelectFuentes from "./SelectFuentes";
import SelectRedes from "./SelectRedes";
import SelectTipoComponentes from "./SelectTipoComponentes";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import ConfigAdicional from "./ConfigAdicional";
import SelectRegiones from "./SelectRegiones";
import { RelacionJerarquicaService } from "@/core/relacion-jerarquica/relacion-jerarquica.service";
type FormItem = keyof CreateComponenteRedDto;
export default function UpdateForm({
  componenteRed,
}: {
  componenteRed: ComponenteRedType;
}) {
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>();
  const [red, setRed] = useState<RedType | null>();
  const [attribute, setAttribute] = useState<any>(
    JSON.parse(componenteRed.attribute),
  );
  console.log(attribute);
  const [service, setService] = useState<any>(
    JSON.parse(componenteRed.service?.attribute as string),
  );

  const [componenteSeleted, setComponenteSeleted] = useState<
    ComponenteRedType[]
  >([]);

  const createRelacionJerarquicas = useCallback(async () => {
    const relacionJerarquicaService = new RelacionJerarquicaService();
    await Promise.all(
      componenteSeleted.map(async (selected) => {
        relacionJerarquicaService.create({
          controlId: componenteRed.controlId,
          superiorControlId: selected.controlId,
          refComponentTypeId: componenteRed.refComponentTypeId,
          refNetworkId: componenteRed.refNetworkId,
          status: 1,
        });
      }),
    );
  }, [componenteSeleted, componenteRed]);

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
        status,
      } = form;
      // setIsSubmitting(true);
      const componenteRedService = new ComponenteRedService();
      await componenteRedService.update(componenteRed.id, {
        label,
        name,
        stationId: +stationId,
        refSourceId: +refSourceId,
        refComponentTypeId: +refComponentTypeId,
        refNetworkId: +refNetworkId,
        regionId: +regionId,
        status: status,
        serviceModified: false,
        relationModified: false,
        approvalComment: "",
        // componentId: 1,
        attribute: JSON.stringify(attribute),
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
      createRelacionJerarquicas();
      setIsSubmitting(false);
      openSnackbar({
        message: "Componente de red actualizado exitosamente",
        type: "INFORMATIVE",
      });
    },
    [
      attribute,
      service,
      openSnackbar,
      componenteRed,
      createRelacionJerarquicas,
    ],
  );

  return (
    <section className="grid content-start overflow-auto bg-[white] w-full h-full rounded-[8px] scroller scroll-smooth">
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Detalle de componente de red</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          componente de red
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value)}
        className="grid grid-cols-3 content-start gap-4 px-6"
        initialValues={{
          label: componenteRed.label,
          name: componenteRed.name,
          code: componenteRed.code,
          observation: componenteRed.observation,
          regionId: componenteRed?.regionId.toString(),
          stationId: componenteRed?.stationId.toString(),
          refNetworkId: componenteRed?.refNetworkId.toString(),
          refComponentTypeId: componenteRed?.refComponentTypeId.toString(),
          refSourceId: componenteRed?.refSourceId.toString(),
          status: componenteRed?.status.toString(),
          control_label: componenteRed.control?.label,
          control_name: componenteRed.control?.name,
          control_status: componenteRed.control?.status.toString(),
          service_label: componenteRed.service?.label,
          service_name: componenteRed.service?.name,
          service_status: componenteRed.service?.status.toString(),
          ...JSON.parse(componenteRed?.service?.attribute as string)[0],
          ...JSON.parse(componenteRed?.attribute)[0],
        }}
      >
        <h1 className="col-span-3 text-xl" id="datos">
          Datos de componente de red
        </h1>
        <TextField
          name="control_label"
          label="Control etiqueta"
          fullWidth
          maxLength={255}
        />
        <TextField
          name="control_name"
          label="Control nombre"
          fullWidth
          maxLength={255}
        />
        <Select
          name="control_status"
          label="Control estado"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        <TextField
          name={"code" as FormItem}
          label="Código"
          fullWidth
          maxLength={255}
        />
        <TextField
          name={"name" as FormItem}
          label="Nombre"
          fullWidth
          maxLength={255}
        />
        <TextField
          name={"label" as FormItem}
          label="Etiqueta"
          fullWidth
          maxLength={255}
        />
        <hr className="col-span-3" />
        <SelectRegiones name={"regionId" as FormItem} />
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
        <hr className="col-span-3" />
        <SelectRedes
          name={"refNetworkId" as FormItem}
          componenteRed={componenteRed}
          onChange={(red) => setRed(red)}
        />
        <SelectTipoComponentes
          name={"refComponentTypeId" as FormItem}
          componenteRed={componenteRed}
          onChange={(tc) => setTipoComponente(tc)}
        />
        <SelectFuentes name={"refSourceId" as FormItem} />
        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="relacion-jerarquica">
          <h4 className="text-[20px]">Relación jerarquica (opcional)</h4>
          <p>En esta sección podra relacionar componentes de red entre si</p>
        </hgroup>
        <RelacionJerarquica
          componenteRed={componenteRed}
          tipoComponente={tipoComponente}
          red={red}
          onSelected={(componente) =>
            setComponenteSeleted([...componenteSeleted, componente])
          }
          onDeselected={(componente) => {
            setComponenteSeleted(
              componenteSeleted.filter(
                (selected) => selected.id !== componente.id,
              ),
            );
          }}
        />
        <hr className="col-span-3" />
        <Select
          name={"status" as FormItem}
          label="Status"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        <ConfigAdicional
          className="col-span-3"
          tipoComponente={tipoComponente}
          onAttributes={(name, value) => {
            attribute[0][name] = value;
            setAttribute([...attribute]);
          }}
          onServices={(name, value) => {
            service[0][name] = value;
            setService({ ...service });
          }}
        />
        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="observacion">
          <h4 className="text-[20px]">Observación</h4>
          <p>
            Asegurece de dejar todo el detalle de las observaciones previas
            antes de la creación
          </p>
        </hgroup>

        <div className="col-span-3">
          <TextField
            name={"observation" as FormItem}
            label="Observación"
            fullWidth
            multiline
          />
        </div>

        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee] col-span-3 justify-center">
          <Button showSpinner={isSubmitting}>Guardar</Button>
        </footer>
      </Form>
    </section>
  );
}
