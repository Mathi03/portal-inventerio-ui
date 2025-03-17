import Aside from "@/components/Aside";
import InputJson from "@/components/InputJson";
import { CreateTipoComponenteDto } from "@/core/tipo-componente/dto/create.dto";
import {
  ButtonPrimary,
  ButtonSecondary,
  Form,
  TextField,
} from "@telefonica/mistica";
import { useCallback, useState } from "react";
import useTipoComponente from "./useTipoComponente";

type FormItem = keyof CreateTipoComponenteDto;

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const { createTipoComponente } = useTipoComponente();
  const [creating, setCreating] = useState(false);

  const [configAttributes, setConfigAttributes] = useState<
    CreateTipoComponenteDto["configAttributes"]
  >([]);

  const [configServices, setConfigServices] = useState<
    CreateTipoComponenteDto["configServices"]
  >([]);

  const onCreate = useCallback(
    async ({
      label,
      name,
    }: Pick<CreateTipoComponenteDto, "label" | "name">) => {
      setCreating(true);
      await createTipoComponente({
        label,
        name,
        status: 0,
        configAttributes,
        configServices,
        commentApproval: "",
      });
      setCreating(false);
      onSuccess();
      onClose();
    },
    [
      onSuccess,
      onClose,
      createTipoComponente,
      configAttributes,
      configServices,
    ],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto min-w-[1280px]"
      onClose={onClose}
    >
      <header className="p-6 grid">
        <h4 className="text-[28px]">Crear tipo de componente</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de tipo de componente
        </p>
      </header>
      <Form
        onSubmit={(value) => onCreate(value as CreateTipoComponenteDto)}
        className="grid px-6 content-start"
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
        <h4 className="text-[22px]">Configuración dinamica</h4>
        <p>
          las configuraciones estaran asociada a cada componnente de red, por lo
          cual se debera agregar las configuraciones iniciales que tendra cada
          modulo
        </p>
        <br />
        <InputJson
          codeDefault="[]"
          label="Configuracion de Atributos"
          onChange={setConfigAttributes}
        />
        <br />
        <InputJson
          codeDefault="[]"
          label="Configuracion de servicios"
          onChange={setConfigServices}
        />
        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee]">
          <ButtonPrimary submit showSpinner={creating}>
            Guardar
          </ButtonPrimary>
          <ButtonSecondary onPress={onClose}>Cerrar</ButtonSecondary>
        </footer>
      </Form>
    </Aside>
  );
}
