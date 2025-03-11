import Aside from "@/components/Aside";
import Button from "@/components/Button";
import InputJson from "@/components/InputJson";
import { UpdateTipoComponenteDto } from "@/core/tipo-componente/dto/update.dto";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [configAttributes, setConfigAttributes] = useState<
    UpdateTipoComponenteDto["configAttributes"]
  >(tipoComponente.configAttributes);

  const [configServices, setConfigServices] = useState<
    UpdateTipoComponenteDto["configServices"]
  >(tipoComponente.configServices);

  const onSubmit = useCallback(
    async (form: UpdateTipoComponenteDto) => {
      setIsSubmitting(true);
      const tcService = new TipoComponenteService();
      await tcService.update(tipoComponente.id, {
        ...form,
        status: tipoComponente.status,
        configAttributes,
        configServices,
        commentApproval: "",
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    },
    [tipoComponente, onSuccess, onClose, configAttributes, configServices],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto min-w-[1024px]"
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
        onSubmit={(value) => onSubmit(value as UpdateTipoComponenteDto)}
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
          <Button showSpinner={isSubmitting}>Guardar</Button>
          <Button variant="link" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </Form>
    </Aside>
  );
}
