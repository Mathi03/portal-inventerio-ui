import Aside from "@/components/Aside";
import InputJson from "@/components/InputJson";
import { UpdateTipoComponenteDto } from "@/core/tipo-componente/dto/update.dto";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import {
  ButtonPrimary,
  ButtonSecondary,
  Form,
  TextField,
} from "@telefonica/mistica";
import { useCallback, useState } from "react";
import useTipoComponente from "./useTipoComponente";
type FormItem = keyof UpdateTipoComponenteDto;
export default function Edit({
  tipoComponente,
  onClose,
  onSuccess,
}: {
  tipoComponente: TipoComponenteType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { updateTipoComponente } = useTipoComponente({});
  const [updating, setUpdating] = useState(false);
  const [configAttributes, setConfigAttributes] = useState<
    UpdateTipoComponenteDto["configAttributes"]
  >(tipoComponente.configAttributes);

  const [configServices, setConfigServices] = useState<
    UpdateTipoComponenteDto["configServices"]
  >(tipoComponente.configServices);

  const onUpdate = useCallback(
    async ({
      label,
      name,
    }: Pick<UpdateTipoComponenteDto, "label" | "name">) => {
      setUpdating(true);
      await updateTipoComponente(tipoComponente.id, {
        label,
        name,
        status: tipoComponente.status,
        configAttributes,
        configServices,
        commentApproval: "",
      });
      setUpdating(false);
      onSuccess();
      onClose();
    },
    [
      tipoComponente,
      configAttributes,
      configServices,
      onSuccess,
      onClose,
      updateTipoComponente,
    ],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto min-w-[1280px]"
      onClose={onClose}
    >
      <header className="p-6 grid gap-1">
        <h4 className="text-[28px]">Editar mantenedor de tipo de componente</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          mantenedor de tipo de componente
        </p>
      </header>
      <Form
        onSubmit={(value) => onUpdate(value as UpdateTipoComponenteDto)}
        className="grid px-6 content-start"
        initialValues={{
          ...tipoComponente,
          status: tipoComponente.status.toString(),
        }}
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
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
        </div>
        <h4 className="text-[22px]">Actualización Configuración dinamica</h4>
        <p className="mb-4">
          las configuraciones estaran asociada a cada componnente de red, por lo
          cual se debera agregar las configuraciones iniciales que tendra cada
          modulo
        </p>
        <InputJson
          codeDefault={JSON.stringify(configAttributes)}
          label="Configuración de Atributos"
          onChange={setConfigAttributes}
        />
        <br />
        <InputJson
          codeDefault={JSON.stringify(configServices)}
          label="Configuración de servicios"
          onChange={setConfigServices}
        />
        <br />
        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee]">
          <ButtonPrimary submit showSpinner={updating}>
            Guardar
          </ButtonPrimary>
          <ButtonSecondary onPress={onClose}>Cerrar</ButtonSecondary>
        </footer>
      </Form>
    </Aside>
  );
}
