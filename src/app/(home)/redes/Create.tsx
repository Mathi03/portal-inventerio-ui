import Aside from "@/components/Aside";
import Select from "@/components/Select";
import { CreateRedDto } from "@/core/red/dto/create.dto";
import { RedStatusEnumOptions } from "@/core/red/red.type";
import {
  ButtonPrimary,
  ButtonSecondary,
  Form,
  TextField,
} from "@telefonica/mistica";
import { useCallback, useState } from "react";
import useRed from "./useRed";

type FormItem = keyof CreateRedDto;

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const { createRed } = useRed();
  const [creating, setCreating] = useState(false);

  const onCreate = useCallback(
    async (form: CreateRedDto) => {
      setCreating(true);
      await createRed(form);
      setCreating(false);
      onSuccess();
      onClose();
    },
    [onSuccess, onClose, createRed],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Crear mantenedor de red</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de red
        </p>
      </header>
      <Form
        onSubmit={(value) => onCreate(value as CreateRedDto)}
        className="grid gap-4 px-6 content-start"
        initialValues={{
          status: "",
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
          name={"status" as FormItem}
          label="Estado"
          options={RedStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
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
