import Aside from "@/components/Aside";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { UpdateTipoFuenteDto } from "@/core/tipo-fuente/dto/update.dto";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { TipoFuenteStatusEnumOptions, TipoFuenteType } from "@/core/tipo-fuente/tipo-fuente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";

type FormItem = keyof UpdateTipoFuenteDto;

export default function Edit({
  fuente,
  onClose,
  onSuccess,
}: {
  fuente: TipoFuenteType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (form: UpdateTipoFuenteDto) => {
      setIsSubmitting(true);
      const fuenteService = new TipoFuenteService();
      await fuenteService
        .update(fuente.id, {
          ...form,
          status: +form.status,
        })
        .finally(() => {
          setIsSubmitting(false);
          onSuccess();
          onClose();
        });
    },
    [fuente, onSuccess, onClose]
  );

  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] w-[520px] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Editar mantenedor de fuente</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          mantenedor de fuente
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as UpdateTipoFuenteDto)}
        className="grid gap-4 px-6 content-start"
        initialValues={{
          ...fuente,
          status: fuente.status.toString(),
          refNetworkId: fuente.refNetworkId.toString(),
          refComponentTypeId: fuente.refComponentTypeId.toString(),
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
