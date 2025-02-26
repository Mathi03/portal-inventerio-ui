import Aside from "@/components/Aside";
import Button from "@/components/Button";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { Form, TextField } from "@telefonica/mistica";
import { useCallback, useState } from "react";

export default function Aprobar({
  componenteRed,
  onSuccess,
  onClose,
}: {
  componenteRed: ComponenteRedType | null;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = useCallback(
    async (form: any) => {
      setIsSubmitting(true);
      const componenteRedService = new ComponenteRedService();
      await componenteRedService.approve(
        componenteRed?.id!,
        form.approvalComment,
        form.observation,
      );
      setIsSubmitting(false);
      onClose();
      onSuccess();
    },
    [onClose, onSuccess, componenteRed],
  );
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto"
      onClose={onClose}
    >
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Aprobación componente de red</h4>
        <p>
          A continuación usted aprobara el componete{" "}
          <b>{componenteRed?.name}</b> para su habilitación dentro del sistema.
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value)}
        className="grid content-start gap-4 px-6"
      >
        <TextField
          name={"approvalComment"}
          label="Comentario de aprobación"
          fullWidth
          multiline
        />
        <TextField
          name={"observation"}
          label="Observación"
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
