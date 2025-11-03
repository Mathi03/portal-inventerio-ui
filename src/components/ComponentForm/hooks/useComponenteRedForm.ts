import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSnackbar } from '@telefonica/mistica';
import { CreateComponenteRedDto } from '@/core/componente-red/dto/create.dto';
import { UpdateComponenteRedDto } from '@/core/componente-red/dto/update.dto';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { ComponenteRedService } from '@/core/componente-red/componente-red.service';
import { RelacionJerarquicaService } from '@/core/relacion-jerarquica/relacion-jerarquica.service';
import { errorGeneric, errorMessageInAPI } from '@/types/errorMessageInAPI';
import { useHierarchyRelations } from './useHierarchyRelations';

export type ModeCreateForm = 'create' | 'update' | 'approve' | 'popup' | 'read';

export type FormValues = (CreateComponenteRedDto | UpdateComponenteRedDto) & {
  commentApproval?: string;
};

export function useComponenteRedForm({
  componenteRed,
  mode,
  parsedAttributes,
  parsedServices
}: {
  componenteRed?: ComponenteRedType;
  mode: ModeCreateForm;
  parsedAttributes: any;
  parsedServices: any;
}) {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attribute, setAttribute] = useState<any>(parsedAttributes);
  const [service, setService] = useState<any>(parsedServices);
  const [componenteSeleted, setComponenteSeleted] = useState<
    ComponenteRedType[]
  >([]);
  const [isApproved, setIsApproved] = useState(false);

  const { parents, isLoading: loadingRelations } = useHierarchyRelations({
    componenteRedId: componenteRed?.id,
    mode,
    shouldLoad: mode !== 'create' && mode !== 'popup'
  });

  useEffect(() => {
    if (mode === 'create' || mode === 'popup' || loadingRelations) return;

    if (parents.length > 0 && componenteSeleted.length === 0) {
      setComponenteSeleted(parents);
    }
  }, [parents, loadingRelations, mode]);

  const createRelacionJerarquicas = useCallback(
    async (componenteRed: ComponenteRedType) => {
      if (componenteSeleted.length === 0) return;

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

  // PREPARADO: Función para eliminar relaciones
  const deleteRelacionJerarquicas = useCallback(
    async (componenteRed: ComponenteRedType, toDelete: ComponenteRedType[]) => {
      if (toDelete.length === 0) return;

      const relacionJerarquicaService = new RelacionJerarquicaService();

      // Implementar cuando el servicio tenga el método delete
      // await Promise.all(
      //   toDelete.map((selected) =>
      //     relacionJerarquicaService.delete({
      //       controlId: componenteRed.controlId,
      //       superiorControlId: selected.controlId
      //     })
      //   )
      // );
    },
    []
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

        const existingIds = new Set(parents.map((p) => p.id));
        const selectedIds = new Set(componenteSeleted.map((c) => c.id));

        // Componentes a agregar (nuevos)
        const toCreate = componenteSeleted.filter(
          (c) => !existingIds.has(c.id)
        );

        // Componentes a eliminar (desseleccionados) - preparado para futuro
        // const toDelete = parents.filter(p => !selectedIds.has(p.id));

        // Crear nuevas relaciones
        if (toCreate.length > 0) {
          await createRelacionJerarquicas(data.data);
        }

        // PREPARADO: Eliminar relaciones (cuando esté disponible)
        // if (toDelete.length > 0) {
        //   await deleteRelacionJerarquicas(data.data, toDelete);
        // }

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
      router,
      parents,
      componenteSeleted
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
    onSubmit,
    loadingRelations
  };
}
