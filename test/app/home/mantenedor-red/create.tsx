import Aside from "@/components/Aside";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { CreateRedDto } from "@/core/red/dto/create.dto";
import { RedService } from "@/core/red/red.service";
import { TCStatusEnumOptions } from "@/core/tipo-componente/tipo-componente.type";

import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";

type FormItem = keyof CreateRedDto;

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = useCallback(
    async (form: CreateRedDto) => {
      setIsSubmitting(true);
      const redService = new RedService();
      await redService.create({ ...form, status: +form.status });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    },
    [onSuccess, onClose],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto w-[520px]"
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
        onSubmit={(value) => onSubmit(value as CreateRedDto)}
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
          name={"status" as FormItem}
          label="Estado"
          options={TCStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
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
