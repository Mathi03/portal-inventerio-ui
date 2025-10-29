import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSnackbar } from '@telefonica/mistica';
import { CreateComponenteRedDto } from '@/core/componente-red/dto/create.dto';
import { UpdateComponenteRedDto } from '@/core/componente-red/dto/update.dto';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { ComponenteRedService } from '@/core/componente-red/componente-red.service';
import { RelacionJerarquicaService } from '@/core/relacion-jerarquica/relacion-jerarquica.service';
import { errorGeneric, errorMessageInAPI } from '@/types/errorMessageInAPI';

export type ModeCreateForm = 'create' | 'update' | 'approve' | 'popup' | 'read';

export type FormValues = (CreateComponenteRedDto | UpdateComponenteRedDto) & {
  commentApproval?: string;
};

export function useComponenteRedForm({
  componenteRed,
  mode
}: {
  componenteRed?: ComponenteRedType;
  mode: ModeCreateForm;
}) {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attribute, setAttribute] = useState<any>({});
  const [service, setService] = useState<any>({});
  const [componenteSeleted, setComponenteSeleted] = useState<
    ComponenteRedType[]
  >([]);
  const [isApproved, setIsApproved] = useState(false);

  const createRelacionJerarquicas = useCallback(
    async (componenteRed: ComponenteRedType) => {
      const relacionJerarquicaService = new RelacionJerarquicaService();
      await Promise.all(
        componenteSeleted.map((selected) =>
          relacionJerarquicaService.create({
            controlId: componenteRed.controlId,
            superiorControlId: selected.controlId,
            refComponentTypeId: componenteRed.refComponentTypeId,
            refNetworkId: componenteRed.refNetworkId,
            status: 1
          })
        )
      );
    },
    [componenteSeleted]
  );

  const buildPayload = useCallback(
    (
      form: CreateComponenteRedDto | UpdateComponenteRedDto,
      isUpdate = false
    ): CreateComponenteRedDto | UpdateComponenteRedDto => {
      const basePayload = {
        observation: form.observation,
        stationId: Number(form.stationId),
        refSourceId: Number(form.refSourceId),
        refComponentTypeId: Number(form.refComponentTypeId),
        refNetworkId: Number(form.refNetworkId),
        regionId: Number(form.regionId),
        status: 1,
        attribute: [attribute],
        service: [service],
        control: {
          id: 0,
          idControl: 0,
          label: form.controlLabel,
          name: form.controlName,
          status: 0
        },
        code: '',
        codigo: '',
        controlId: 1,
        componentId: Number(form.componentId)
      };

      if (isUpdate) {
        return {
          ...basePayload,
          serviceModified: true,
          relationModified: true,
          approvalComment: (form as any).commentApproval ?? ''
        } as UpdateComponenteRedDto;
      }

      return basePayload;
    },
    [attribute, service]
  );

  const onCreate = useCallback(
    async (form: CreateComponenteRedDto) => {
      setIsSubmitting(true);
      const service = new ComponenteRedService();

      try {
        const payload = buildPayload(form);
        const { data } = await service.create(payload);
        await createRelacionJerarquicas(data.data);
        openSnackbar({
          message: 'Componente creado exitosamente',
          type: 'INFORMATIVE'
        });
        router.push('/componente-red');
      } catch (err) {
        console.error(err);
        openSnackbar({
          message:
            axios.isAxiosError(err) && err.response
              ? errorMessageInAPI
              : errorGeneric,
          type: 'CRITICAL'
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [buildPayload, createRelacionJerarquicas, openSnackbar, router]
  );

  const onUpdate = useCallback(
    async (form: UpdateComponenteRedDto) => {
      setIsSubmitting(true);
      const service = new ComponenteRedService();

      try {
        const basePayload = buildPayload(form) as UpdateComponenteRedDto;
        const payload: UpdateComponenteRedDto = {
          ...basePayload,
          serviceModified: true,
          relationModified: true,
          approvalComment: form.approvalComment ?? ''
        };
        const { data } = await service.update(componenteRed?.id!, payload);
        await createRelacionJerarquicas(data.data);
        openSnackbar({
          message: 'Componente actualizado exitosamente',
          type: 'INFORMATIVE'
        });
        router.push('/componente-red');
      } catch (err) {
        console.error(err);
        openSnackbar({
          message:
            axios.isAxiosError(err) && err.response
              ? errorMessageInAPI
              : errorGeneric,
          type: 'CRITICAL'
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      buildPayload,
      createRelacionJerarquicas,
      componenteRed?.id,
      openSnackbar,
      router
    ]
  );

  const onApprove = useCallback(
    async (form: { commentApproval?: string }) => {
      setIsSubmitting(true);
      const service = new ComponenteRedService();

      try {
        await service.approve(
          componenteRed?.id!,
          form.commentApproval ?? '',
          isApproved ? 1 : 4
        );
        openSnackbar({
          message: 'Componente aprobado correctamente',
          type: 'INFORMATIVE'
        });
        router.push('/componente-red');
      } catch (err) {
        console.error(err);
        openSnackbar({
          message:
            axios.isAxiosError(err) && err.response
              ? errorMessageInAPI
              : errorGeneric,
          type: 'CRITICAL'
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [componenteRed?.id, isApproved, openSnackbar, router]
  );

  const onSubmit = useCallback(
    async (form: FormValues) => {
      console.log('forma data', form);

      if (mode === 'create') return onCreate(form as CreateComponenteRedDto);
      if (mode === 'update') return onUpdate(form as UpdateComponenteRedDto);
      if (mode === 'approve') return onApprove(form);
    },
    [mode, onCreate, onUpdate, onApprove]
  );

  return {
    isSubmitting,
    attribute,
    setAttribute,
    service,
    setService,
    componenteSeleted,
    setComponenteSeleted,
    isApproved,
    setIsApproved,
    onSubmit
  };
}
