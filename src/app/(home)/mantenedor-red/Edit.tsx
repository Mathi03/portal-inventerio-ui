import Aside from "@/components/Aside";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { UpdateRedDto } from "@/core/red/dto/update.dto";
import { RedService } from "@/core/red/red.service";
import { RedStatusEnumOptions, RedType } from "@/core/red/red.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";
type FormItem = keyof UpdateRedDto;
export default function Edit({
  red,
  onClose,
  onSuccess,
}: {
  red: RedType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = useCallback(
    async (form: UpdateRedDto) => {
      setIsSubmitting(true);
      const redService = new RedService();
      await redService.update(red.id, {
        ...form,
        status: +form.status,
      });
      setIsSubmitting(false);
      onSuccess();
      onClose();
    },
    [red, onSuccess, onClose],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Editar mantenedor de red</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          mantenedor de red
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as UpdateRedDto)}
        className="grid gap-4 px-6 content-start"
        initialValues={{
          ...red,
          status: red.status.toString(),
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
          <Button showSpinner={isSubmitting}>Guardar</Button>
          <Button variant="link" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </Form>
    </Aside>
  );
}
