import Aside from "@/components/Aside";
import Button from "@/components/Button";
import InputJson from "@/components/InputJson";
import Select from "@/components/Select";
import { CreateTipoComponenteDto } from "@/core/tipo-componente/dto/create.dto";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TCStatusEnumOptions } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";

type FormItem = keyof CreateTipoComponenteDto;

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configAttributes, setConfigAttributes] = useState<
    CreateTipoComponenteDto["configAttributes"]
  >([]);
  const [configServices, setConfigServices] = useState<
    CreateTipoComponenteDto["configServices"]
  >([]);
  const [configRelations, setConfigRelations] =
    useState<CreateTipoComponenteDto["configRelations"]>();
  const onSubmit = useCallback(
    async (form: CreateTipoComponenteDto) => {
      setIsSubmitting(true);
      const tcService = new TipoComponenteService();
      await tcService.create({
        ...form,
        status: +form.status,
        configAttributes,
        configServices,
        configRelations,
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    },
    [onSuccess, onClose, configAttributes, configServices, configRelations],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto w-[720px]"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Crear mantenedor de tipo de componente</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de tipo de componente
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as CreateTipoComponenteDto)}
        className="grid gap-4 px-6 content-start"
      >
        <TextField name={"label" as FormItem} label="Etiqueta" fullWidth />
        <TextField name={"name" as FormItem} label="Nombre" fullWidth />
        <Select
          name={"status" as FormItem}
          label="Estado"
          options={TCStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        <h4 className="text-[22px]">Configuración dinamica</h4>
        <p>
          las configuraciones estaran asociada a cada componnente de red, por lo
          cual se debera agregar las configuraciones iniciales que tendra cada
          modulo
        </p>
        <InputJson
          codeDefault="[]"
          label="Configuracion de Atributos"
          onChange={setConfigAttributes}
        />
        <InputJson
          codeDefault="[]"
          label="Configuracion de servicios"
          onChange={setConfigServices}
        />
        <InputJson
          codeDefault="{}"
          label="Configuracion de relacion"
          onChange={setConfigRelations}
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
