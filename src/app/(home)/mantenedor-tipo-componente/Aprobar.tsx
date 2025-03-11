import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";

export default function Aprobar({
  tc,
  onSuccess,
  onClose,
}: {
  tc: TipoComponenteType | null;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = useCallback(
    async (form: any) => {
      setIsSubmitting(true);
      const tipoComponenteService = new TipoComponenteService();
      await tipoComponenteService.approval(tc?.id!, form.commentApproval);
      setIsSubmitting(false);
      onClose();
      onSuccess();
    },
    [onClose, onSuccess, tc],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Aprobación de tipo de componente</h4>
        <p>
          A continuación usted aprobara el componete <b>{tc?.name}</b> para su
          habilitación dentro del sistema.
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value)}
        className="grid content-start gap-4 px-6"
      >
        <TextField
          name={"commentApproval"}
          label="Comentario de aprobación"
          fullWidth
          multiline
        />
        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee]">
          <Button showSpinner={isSubmitting}>Aprobar</Button>
          <Button variant="link" onClick={onClose}>
            Cerrar
          </Button>
        </footer>
      </Form>
    </Aside>
  );
}
