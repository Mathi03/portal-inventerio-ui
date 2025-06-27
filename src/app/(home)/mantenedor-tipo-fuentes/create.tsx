import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";
import Select from "@/components/Select";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { CreateTipoFuenteDto } from "@/core/tipo-fuente/dto/create.dto";
import { TipoFuenteStatusEnumOptions } from "@/core/tipo-fuente/tipo-fuente.type";

type FormItem = keyof CreateTipoFuenteDto;

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async ({ label, name, status }: CreateTipoFuenteDto) => {
      setIsSubmitting(true);
      const fuenteService = new TipoFuenteService();
      await fuenteService
        .create({
          label,
          name,
          status: +status,
        })
        .finally(() => {
          setIsSubmitting(false);
          onSuccess();
          onClose();
        });
    },
    [onSuccess, onClose]
  );

  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-y-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Crear mantenedor de tipo fuente</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de tipo fuente
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as CreateTipoFuenteDto)}
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
          options={TipoFuenteStatusEnumOptions.map((option) => ({
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
