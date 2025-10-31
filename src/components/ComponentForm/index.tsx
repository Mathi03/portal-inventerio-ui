import Select from '@/components/Select';
import { Form, IntegerField, Switch, TextField } from '@telefonica/mistica';
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import Button from '@/components/Button';
import { CreateComponenteRedDto } from '@/core/componente-red/dto/create.dto';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { RedService } from '@/core/red/red.service';
import { TipoComponenteService } from '@/core/tipo-componente/tipo-componente.service';
import { FuenteService } from '@/core/fuente/fuente.service';
import { estaciones as estacionesInstance, msDirecciones } from '@/core/config';

import { RedType } from '@/core/red/red.type';
import { TipoComponenteType } from '@/core/tipo-componente/tipo-componente.type';
import { FuenteType } from '@/core/fuente/fuente.type';
import Table from '@/components/Table/Table';
import { UpdateComponenteRedDto } from '@/core/componente-red/dto/update.dto';
import {
  ModeCreateForm,
  useComponenteRedForm
} from './hooks/useComponenteRedForm';
import { useModalStore } from '@/hooks/modalStorage';
import RelacionJerarquica from './Relatcion-jerarquica';
import { RegionType } from '@/core/region/region.type';
import ConfigData from './ConfigData';
import TreeView from './TreeView';
import { SelectPaginate } from '../SelectPaginate';
import AttributeRelation from './AttributeRelation';
import useErrorHandler from '@/hooks/useErrorHandler';
import SearchableSelect from '../SearchableSelect';

type FormItem = keyof CreateComponenteRedDto;

type FormValues = (CreateComponenteRedDto | UpdateComponenteRedDto) & {
  commentApproval?: string;
};

interface BaseCreateFormProps {
  mode?: ModeCreateForm;
  componentTypeId?: number;
}

interface PopUpModeProps extends BaseCreateFormProps {
  mode?: 'popup';
  networkId: number | null;
  regionId: number | null;
  stationId: number | null;
  componenteRed?: never;
}

interface CreateModeProps extends BaseCreateFormProps {
  mode?: 'create';
  componenteRed?: never;
  networkId?: never;
  regionId?: never;
  stationId?: never;
}

interface UpdateOrApproveModeProps extends BaseCreateFormProps {
  mode: 'update' | 'approve';
  componenteRed: ComponenteRedType;
  networkId?: never;
  regionId?: never;
  stationId?: never;
}

interface ReadModeProps extends BaseCreateFormProps {
  mode: 'read';
  componenteRed: ComponenteRedType;
  networkId?: never;
  regionId?: never;
  stationId?: never;
}

type CreateFormProps =
  | CreateModeProps
  | UpdateOrApproveModeProps
  | PopUpModeProps
  | ReadModeProps;

// ============================================
// 🔥 OPTIMIZACIÓN 1: Memoizar componentes pesados
// ============================================
const MemoizedConfigData = memo(ConfigData);
const MemoizedTreeView = memo(TreeView);
const MemoizedRelacionJerarquica = memo(RelacionJerarquica);
const MemoizedAttributeRelation = memo(AttributeRelation);

// ============================================
// 🔥 OPTIMIZACIÓN 2: Helper para parsing seguro
// ============================================
const safeParseJSON = <T,>(json: string | undefined, defaultValue: T): T => {
  if (!json) return defaultValue;
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) && parsed[0] ? parsed[0] : defaultValue;
  } catch {
    return defaultValue;
  }
};

// ============================================
// 🔥 OPTIMIZACIÓN 3: Reducir estados redundantes
// ============================================
interface FormState {
  red: RedType | null;
  tipoComponente: TipoComponenteType | null;
  fuente: FuenteType | null;
  region: RegionType | null;
  estacion: string | null;
  redFather: RedType | null;
  componentTypeFatherId: number | null;
  childName: string;
  label: string;
}

interface LoadingState {
  redes: boolean;
  tipoComponentes: boolean;
  fuentes: boolean;
  regiones: boolean;
}

interface DataState {
  redes: RedType[];
  tipoComponentes: TipoComponenteType[];
  fuentes: FuenteType[];
  regiones: RegionType[];
}

interface ErrorState {
  redes: string | null;
  tipoComponentes: string | null;
  fuentes: string | null;
  regiones: string | null;
}

export default function CreateForm({
  mode = 'create',
  componenteRed,
  networkId,
  componentTypeId,
  regionId,
  stationId
}: CreateFormProps) {
  const { closeModal } = useModalStore();
  const { notifyError } = useErrorHandler();

  // ============================================
  // 🔥 OPTIMIZACIÓN 4: Consolidar estados relacionados
  // ============================================
  const [formState, setFormState] = useState<FormState>(() => ({
    red: null,
    tipoComponente: null,
    fuente: null,
    region: null,
    estacion:
      stationId?.toString() ?? componenteRed?.stationId?.toString() ?? null,
    redFather: null,
    componentTypeFatherId: null,
    childName: componenteRed?.controlName ?? '',
    label: componenteRed?.controlLabel ?? ''
  }));

  const [loading, setLoading] = useState<LoadingState>({
    redes: false,
    tipoComponentes: false,
    fuentes: false,
    regiones: false
  });

  const [data, setData] = useState<DataState>({
    redes: [],
    tipoComponentes: [],
    fuentes: [],
    regiones: []
  });

  const [errors, setErrors] = useState<ErrorState>({
    redes: null,
    tipoComponentes: null,
    fuentes: null,
    regiones: null
  });

  const [commentPage, setCommentPage] = useState(1);
  const commentLimit = 5;

  // ============================================
  // 🔥 OPTIMIZACIÓN 5: Parsear attributes/services SOLO en initialValues
  // ============================================
  const parsedAttributes = useMemo(
    () => safeParseJSON(componenteRed?.attribute, {}),
    [componenteRed?.attribute]
  );

  const parsedServices = useMemo(
    () => safeParseJSON(componenteRed?.service, {}),
    [componenteRed?.service]
  );

  const {
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
  } = useComponenteRedForm({
    componenteRed,
    mode,
    parsedAttributes,
    parsedServices
  });

  const convertirFormato = useCallback((texto: string): string => {
    return texto
      .split(' ')
      .map((palabra) => palabra.toUpperCase())
      .join('_');
  }, []);

  const handleInputName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nuevoValor = e.target.value;
      setFormState((prev) => ({
        ...prev,
        childName: nuevoValor,
        label: convertirFormato(nuevoValor)
      }));
    },
    [convertirFormato]
  );

  const handleInputLabel = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        label: convertirFormato(e.target.value)
      }));
    },
    [convertirFormato]
  );

  const initialValues = useMemo(
    () => ({
      componentId: componenteRed?.componentId?.toString().trim(),
      code: componenteRed?.code,
      observation: componenteRed?.observation?.toString() || '',
      regionId:
        componenteRed?.regionId?.toString() || regionId?.toString() || '',
      stationId:
        componenteRed?.stationId?.toString() || stationId?.toString() || '',
      refNetworkId:
        componenteRed?.refNetworkId?.toString() || networkId?.toString() || '',
      refComponentTypeId:
        componenteRed?.refComponentTypeId?.toString() ||
        componentTypeId?.toString() ||
        '',
      refSourceId: componenteRed?.refSourceId?.toString() || '',
      status: componenteRed?.status?.toString() || '',
      label: componenteRed?.controlLabel,
      name: componenteRed?.controlName
    }),
    [
      componenteRed,
      networkId,
      componentTypeId,
      stationId,
      regionId,
      parsedAttributes,
      parsedServices
    ]
  );

  // ============================================
  // 🔥 OPTIMIZACIÓN 6: Evitar fetching innecesario en modo read/approve
  // ============================================
  const shouldFetchData = useMemo(
    () =>
      mode === 'create' ||
      mode === 'popup' ||
      mode === 'update' ||
      mode === 'read',
    [mode]
  );

  const getRedes = useCallback(async () => {
    if (!shouldFetchData && mode !== 'update') return;

    setLoading((prev) => ({ ...prev, redes: true }));
    setErrors((prev) => ({ ...prev, redes: null }));
    const redService = new RedService();

    try {
      if (mode === 'create') {
        const { data: response } = await redService.findAll({});
        const activeNetworks = response.data.data.filter(
          (r: RedType) => r.status === 1
        );
        setData((prev) => ({ ...prev, redes: activeNetworks }));
        if (networkId) {
          setFormState((prev) => ({
            ...prev,
            red: activeNetworks.find((r) => r.id === networkId) ?? null
          }));
        }
      } else if (mode === 'popup') {
        if (networkId !== null) {
          const { data: response } = await redService.getById(
            Number(networkId)
          );
          setData((prev) => ({ ...prev, redes: [response?.data] }));
          setFormState((prev) => ({ ...prev, red: response?.data ?? null }));
        }
      } else {
        const { data: response } = await redService.getById(
          Number(componenteRed?.refNetworkId)
        );
        setData((prev) => ({ ...prev, redes: [response?.data] }));
        setFormState((prev) => ({ ...prev, red: response?.data ?? null }));
      }
    } catch (error) {
      setData((prev) => ({ ...prev, redes: [] }));
      setFormState((prev) => ({ ...prev, red: null }));
      setErrors((prev) => ({
        ...prev,
        redes: 'No se pudieron cargar las redes.'
      }));
      notifyError(error, 'No se pudieron cargar las redes.');
    } finally {
      setLoading((prev) => ({ ...prev, redes: false }));
    }
  }, [
    componenteRed?.refNetworkId,
    mode,
    networkId,
    notifyError,
    shouldFetchData
  ]);

  const getTipoComponentes = useCallback(async () => {
    if (!shouldFetchData && mode !== 'update') return;

    setLoading((prev) => ({ ...prev, tipoComponentes: true }));
    setErrors((prev) => ({ ...prev, tipoComponentes: null }));
    const tcService = new TipoComponenteService();

    try {
      if (mode === 'create' || mode === 'popup') {
        const response = await tcService.findAll({});
        const activeTypes = response?.data?.data?.data.filter(
          (t: TipoComponenteType) => t.status === 1
        );
        setData((prev) => ({ ...prev, tipoComponentes: activeTypes }));
        if (mode !== 'create' && componenteRed) {
          setFormState((prev) => ({
            ...prev,
            tipoComponente:
              activeTypes.find(
                (t: TipoComponenteType) =>
                  t.id === +componenteRed.refComponentTypeId
              ) ?? null
          }));
        }
      } else {
        const response = await tcService.getById(
          Number(componenteRed?.refComponentTypeId)
        );
        setData((prev) => ({ ...prev, tipoComponentes: [response?.data] }));
        setFormState((prev) => ({ ...prev, tipoComponente: response?.data }));
      }
    } catch (error) {
      setData((prev) => ({ ...prev, tipoComponentes: [] }));
      setFormState((prev) => ({ ...prev, tipoComponente: null }));
      setErrors((prev) => ({
        ...prev,
        tipoComponentes: 'No se pudieron cargar los tipos de componente.'
      }));
      notifyError(error, 'No se pudieron cargar los tipos de componente.');
    } finally {
      setLoading((prev) => ({ ...prev, tipoComponentes: false }));
    }
  }, [componenteRed, mode, notifyError, shouldFetchData]);

  const getFuentes = useCallback(async () => {
    if (!formState.red || (!shouldFetchData && mode !== 'update')) return;

    setLoading((prev) => ({ ...prev, fuentes: true }));
    setErrors((prev) => ({ ...prev, fuentes: null }));
    const fuenteService = new FuenteService();

    try {
      const { data: response } = await fuenteService.findAll({
        refNetworkId: formState.red?.id
      });
      const activeSources: FuenteType[] = response?.data?.data || [];
      const filtered = activeSources.filter((f: FuenteType) => f.status === 1);
      setData((prev) => ({ ...prev, fuentes: filtered }));

      if (mode !== 'create' && mode !== 'popup') {
        setFormState((prev) => ({
          ...prev,
          fuente:
            activeSources?.find((r) => r.id === componenteRed?.refSourceId) ??
            null
        }));
      }
    } catch (error) {
      setData((prev) => ({ ...prev, fuentes: [] }));
      setErrors((prev) => ({
        ...prev,
        fuentes: 'No se pudieron cargar las fuentes.'
      }));
      notifyError(error, 'No se pudieron cargar las fuentes.');
    } finally {
      setLoading((prev) => ({ ...prev, fuentes: false }));
    }
  }, [
    notifyError,
    formState.red,
    mode,
    componenteRed?.refSourceId,
    shouldFetchData
  ]);

  const getRegiones = useCallback(async () => {
    if (!shouldFetchData && mode !== 'update') return;

    setLoading((prev) => ({ ...prev, regiones: true }));
    setErrors((prev) => ({ ...prev, regiones: null }));

    try {
      if (mode === 'popup') {
        if (regionId !== null) {
          const { data: response } = await msDirecciones.get(
            '/api/v1/direcciones/regiones/' + regionId,
            {}
          );
          const activeRegion: RegionType = response?.data;
          setFormState((prev) => ({ ...prev, region: activeRegion }));
          setData((prev) => ({ ...prev, regiones: [activeRegion] }));
        }
      } else {
        const { data: response } = await msDirecciones.get(
          '/api/v1/direcciones/regiones',
          {}
        );
        const activeRegions: RegionType[] = response?.data?.data || [];
        if (regionId) {
          setFormState((prev) => ({
            ...prev,
            region: activeRegions.find((r) => r.id === regionId) ?? null
          }));
        }
        setData((prev) => ({ ...prev, regiones: activeRegions }));
      }
    } catch (error) {
      setData((prev) => ({ ...prev, regiones: [] }));
      setFormState((prev) => ({ ...prev, region: null }));
      setErrors((prev) => ({
        ...prev,
        regiones: 'No se pudieron cargar las regiones.'
      }));
      notifyError(error, 'No se pudieron cargar las regiones.');
    } finally {
      setLoading((prev) => ({ ...prev, regiones: false }));
    }
  }, [notifyError, regionId, mode, shouldFetchData]);

  // ============================================
  // 🔥 OPTIMIZACIÓN 7: Ejecutar fetch solo cuando es necesario
  // ============================================
  useEffect(() => {
    if (shouldFetchData || mode === 'update') {
      getRedes();
      getRegiones();
      getTipoComponentes();
    }
  }, [shouldFetchData, mode]); // Dependencias simplificadas

  useEffect(() => {
    if (formState.red && (shouldFetchData || mode === 'update')) {
      getFuentes();
    }
  }, [formState.red, shouldFetchData, mode]);

  // ============================================
  // 🔥 OPTIMIZACIÓN 8: Simplificar getConfigRelation
  // ============================================
  useEffect(() => {
    if (!formState.tipoComponente) return;

    const getConfigRelation = async () => {
      const tcService = new TipoComponenteService();
      const { data: response } = await tcService.All({
        idList: [formState.tipoComponente?.id]
      });

      if (response?.length > 0 && response[0].configRelation?.length > 0) {
        const { networkFatherId, componentTypeFatherId } =
          response[0].configRelation[0];
        const findNetwork = data.redes.find((r) => r.id === networkFatherId);

        if (findNetwork) {
          setFormState((prev) => ({
            ...prev,
            redFather: findNetwork,
            componentTypeFatherId
          }));
        }
      } else {
        setFormState((prev) => ({
          ...prev,
          redFather: null,
          componentTypeFatherId: null
        }));
      }
    };

    getConfigRelation();
  }, [formState.tipoComponente?.id, data.redes]);

  // ============================================
  // 🔥 OPTIMIZACIÓN 9: Remover useEffect innecesario
  // Ya no es necesario porque parsedAttributes y parsedServices
  // se calculan con useMemo y se pasan directamente a ConfigData
  // ============================================

  const parsedComments = useMemo(() => {
    return (
      componenteRed?.approvalComment
        ?.split('|')
        .filter((entry) => entry.trim() !== '')
        .map((entry, index) => {
          const [date, userId, comment] = entry.split('$');
          return {
            id: index,
            date: date?.trim(),
            userId: userId?.trim(),
            comment: comment?.replace(/\n/g, ' ')?.trim()
          };
        }) ?? []
    );
  }, [componenteRed?.approvalComment]);

  const paginatedComments = useMemo(
    () =>
      parsedComments.slice(
        (commentPage - 1) * commentLimit,
        commentPage * commentLimit
      ),
    [parsedComments, commentPage, commentLimit]
  );

  // ============================================
  // 🔥 OPTIMIZACIÓN 10: Memoizar valores costosos
  // ============================================
  const isReadOnly = mode === 'approve' || mode === 'read';
  const showTreeView = formState.tipoComponente?.id?.toString() === '28';
  const showAttributeRelation = ['5', '26', '27'].includes(
    formState.tipoComponente?.id?.toString() ?? ''
  );

  return (
    <section className="grid content-start overflow-auto bg-[white] w-full h-full rounded-[8px] scroller scroll-smooth">
      <div className="flex justify-between">
        <header className="p-6 grid gap-4">
          <h4 className="text-[28px]">
            {mode === 'create' || mode === 'popup' ? 'Creación' : 'Detalle'} de
            componente de red
          </h4>
          <p>
            En esta sección, podrás crear y gestionar tus componentes de red de
            manera eficiente y personalizada.
          </p>
        </header>
        {(mode === 'popup' || mode === 'read') && (
          <div className="p-6">
            <Button variant="primary" onClick={() => closeModal()}>
              Cerrar
            </Button>
          </div>
        )}
      </div>

      <Form
        onSubmit={(value) =>
          onSubmit({
            ...value,
            stationId: Number(formState.estacion),
            refComponentTypeId: formState.tipoComponente?.id,
            refSourceId: formState.fuente?.id,
            refNetworkId: formState.red?.id
          } as FormValues)
        }
        className="grid grid-cols-3 content-start gap-4 px-6"
        initialValues={initialValues}
      >
        <h1 className="col-span-3 text-xl" id="datos">
          Datos del componente de red
        </h1>
        <TextField
          name={'controlName' as FormItem}
          label="Nombre"
          value={formState.childName}
          fullWidth
          maxLength={255}
          onChange={handleInputName}
          disabled={isReadOnly}
          optional={isReadOnly}
        />
        <TextField
          name={'controlLabel' as FormItem}
          label="Etiqueta"
          value={formState.label}
          fullWidth
          maxLength={255}
          onChange={handleInputLabel}
          disabled={isReadOnly}
          optional={isReadOnly}
        />
        <IntegerField
          name={'componentId' as FormItem}
          label="Componente ID"
          fullWidth
          maxLength={255}
          disabled={mode === 'approve' || mode === 'read'}
          optional={mode === 'approve' || mode === 'read'}
        />
        <SearchableSelect
          name={'refNetworkId' as FormItem}
          label="Red"
          disabled={mode !== 'create' ? true : loading.redes}
          optional={mode !== 'create'}
          fullWidth
          helperText={
            errors.redes ?? (loading.redes ? 'Cargando redes...' : undefined)
          }
          options={data.redes?.map((red) => ({
            text: red.label,
            value: red.id.toString()
          }))}
          onChangeValue={(value) => {
            setFormState((prev) => ({
              ...prev,
              red: data.redes?.find((r) => r.id === +value) || null,
              tipoComponente: null
            }));
          }}
        />
        <SearchableSelect
          name={'refComponentTypeId' as FormItem}
          label="Tipo de componente"
          disabled={
            mode !== 'create' && mode !== 'popup'
              ? true
              : loading.tipoComponentes
          }
          optional={mode !== 'create' && mode !== 'popup'}
          fullWidth
          helperText={
            errors.tipoComponentes ??
            (loading.tipoComponentes
              ? 'Cargando tipos de componente...'
              : undefined)
          }
          options={data.tipoComponentes?.map((tc) => ({
            text: tc.label,
            value: tc.id.toString()
          }))}
          onChangeValue={(value) =>
            setFormState((prev) => ({
              ...prev,
              tipoComponente:
                data.tipoComponentes.find((t) => t.id === +value) || null
            }))
          }
        />
        <Select
          name={'refSourceId' as FormItem}
          label="Fuente"
          disabled={
            mode !== 'create' && mode !== 'popup'
              ? true
              : !formState.red
                ? true
                : loading.fuentes
          }
          optional={mode !== 'create' && mode !== 'popup'}
          fullWidth
          helperText={
            errors.fuentes ??
            (loading.fuentes ? 'Cargando fuentes...' : undefined)
          }
          options={data.fuentes.map((f) => ({
            text: f.label,
            value: f.id.toString()
          }))}
          onChangeValue={(value) => {
            setFormState((prev) => ({
              ...prev,
              fuente:
                data.fuentes?.find(
                  (r) => r?.id?.toString() === value?.toString()
                ) ?? null
            }));
          }}
        />
        <Select
          name={'regionId' as FormItem}
          label="Región"
          disabled={
            mode === 'approve' || mode === 'popup' || mode === 'read'
              ? true
              : loading.regiones
          }
          optional={mode === 'approve' || mode === 'popup' || mode === 'read'}
          fullWidth
          helperText={
            errors.regiones ??
            (loading.regiones ? 'Cargando regiones...' : undefined)
          }
          options={data.regiones.map((r) => ({
            text: r.nombre,
            value: r.id.toString()
          }))}
          onChangeValue={(value) => {
            setFormState((prev) => ({
              ...prev,
              region:
                data.regiones?.find(
                  (r) => r?.id?.toString() === value?.toString()
                ) ?? null
            }));
          }}
        />
        <SelectPaginate
          label="Estación"
          value={formState.estacion ?? ''}
          clientToFetch={estacionesInstance}
          searchType="byId"
          fieldUrl={'v1/estaciones'}
          fieldKey="id"
          fieldName="nombre"
          mapById="estacion"
          onChange={(value) => {
            setFormState((prev) => ({
              ...prev,
              estacion: value?.toString() ?? ''
            }));
          }}
          required
          disabled={mode === 'read'}
        />
        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="config-adicional"></hgroup>
        <MemoizedConfigData
          tipoComponente={formState.tipoComponente ?? null}
          setAttributes={setAttribute}
          setServices={setService}
          attributes={attribute}
          services={service}
          networkId={formState.red ? Number(formState.red?.id) : null}
          regionId={formState.region ? Number(formState.region?.id) : null}
          stationId={formState.estacion ? Number(formState.estacion) : null}
          disabled={mode === 'read'}
        />

        {showTreeView && (
          <>
            <hr className="col-span-3" />
            <hgroup className="col-span-3" id="relacion-jerarquica">
              <h4 className="text-[20px]">Relación jerarquica (opcional)</h4>
              <p>
                En esta sección podra relacionar componentes de red entre si
              </p>
            </hgroup>
            <MemoizedRelacionJerarquica
              red={formState.redFather}
              tipoComponenteId={formState.componentTypeFatherId}
              onSelected={(componente) =>
                setComponenteSeleted([...componenteSeleted, componente])
              }
              onDeselected={(componente) => {
                setComponenteSeleted(
                  componenteSeleted.filter(
                    (selected) => selected.id !== componente.id
                  )
                );
              }}
            />
            <hr className="col-span-3" />
            <hgroup className="col-span-3" id="relacion-jerarquica">
              <h4 className="text-[20px]">Arbol</h4>
              <p>En esta sección se mostrara las relaciones entre nodos</p>
            </hgroup>
            <MemoizedTreeView
              tipoComponente={formState.tipoComponente ?? null}
              attributes={attribute}
            />
          </>
        )}

        {showAttributeRelation && (
          <>
            <hr className="col-span-3" />
            <hgroup className="col-span-3" id="relacion-jerarquica">
              <h4 className="text-[20px]">Relacion de Atributos</h4>
              <p>En esta sección se mostrara las relaciones entre nodos</p>
            </hgroup>
            <MemoizedAttributeRelation
              tipoComponente={formState.tipoComponente ?? null}
              controlId={Number(componenteRed?.controlId)}
            />
          </>
        )}

        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="observacion">
          <h4 className="text-[20px]">Observación</h4>
          <p>
            Asegurece de dejar todo el detalle de las observaciones previas
            antes de la creación
          </p>
        </hgroup>
        <div className="col-span-3">
          <TextField
            name={'observation' as FormItem}
            label="Observación"
            fullWidth
            multiline
            disabled={mode === 'approve' || mode === 'read'}
            optional={mode === 'approve' || mode === 'read'}
          />
        </div>
        {componenteRed?.approvalComment && (
          <>
            <h4 className="text-[20px] mt-6 col-span-3">
              Historial de comentarios
            </h4>
            <div className="flex col-span-3 flex-col">
              <Table
                columns={[
                  { title: 'Fecha', render: (row: any) => row.date },
                  { title: 'ID Usuario', render: (row: any) => row.userId },
                  { title: 'Comentario', render: (row: any) => row.comment }
                ]}
                rows={paginatedComments}
                itemPerPage={10}
                item={parsedComments.length}
                onPageChange={(p) => setCommentPage(p)}
              />
            </div>
          </>
        )}
        {mode === 'approve' && (
          <>
            <h4 className="text-[20px] mt-6 col-span-3">Agregar Comentario</h4>
            <div className="col-span-3">
              <TextField
                name={'commentApproval'}
                label="Comentario de aprobación"
                fullWidth
                multiline
                optional={isApproved}
              />
              <div className="mt-4" />
              <Switch
                name="isApproved"
                checked={isApproved}
                onChange={(value: boolean) => {
                  setIsApproved(value);
                }}
              >
                Desea aprobar este tipo de componente?
              </Switch>
            </div>
          </>
        )}
        {mode !== 'read' && (
          <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee] col-span-3 justify-center">
            <Button showSpinner={isSubmitting}>Guardar</Button>
          </footer>
        )}
      </Form>
    </section>
  );
}
