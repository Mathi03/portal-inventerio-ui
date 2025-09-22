import Select from "@/components/Select";
import { Form, IntegerField, Switch, TextField } from "@telefonica/mistica";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import { CreateComponenteRedDto } from "@/core/componente-red/dto/create.dto";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import RelacionJerarquica from "./Relatcion-jerarquica";
import { RedService } from "@/core/red/red.service";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { FuenteService } from "@/core/fuente/fuente.service";
import { estaciones as estacionesInstance, msDirecciones } from "@/core/config";

import { RedType } from "@/core/red/red.type";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { FuenteType } from "@/core/fuente/fuente.type";
import { RegionType } from "@/core/region/region.type";
import Table from "@/components/Table/Table";
import Pagination from "@/components/Pagination";
import { UpdateComponenteRedDto } from "@/core/componente-red/dto/update.dto";
import {
  ModeCreateForm,
  useComponenteRedForm,
} from "./hooks/useComponenteRedForm";
import { SearchableSelectHandle } from "@/components/SearchableSelect";
import { useModalStore } from "@/hooks/modalStorage";
import ConfigData from "../(home)/componente-red/ConfigData";
import TreeView from "../(home)/componente-red/TreeView";
import { SelectPaginate } from "@/components/SelectPaginate";
import AttributeRelation from "../(home)/componente-red/AttributeRelation";

type FormItem = keyof CreateComponenteRedDto;

type FormValues = (CreateComponenteRedDto | UpdateComponenteRedDto) & {
  commentApproval?: string;
};

interface BaseCreateFormProps {
  mode?: ModeCreateForm;
  componentTypeId?: number;
}

interface PopUpModeProps extends BaseCreateFormProps {
  mode?: "popup";
  networkId: number | null;
  regionId: number | null;
  stationId: number | null;
  componenteRed?: never;
}

interface CreateModeProps extends BaseCreateFormProps {
  mode?: "create";
  componenteRed?: never;
  networkId?: never;
  regionId?: never;
  stationId?: never;
}

interface UpdateOrApproveModeProps extends BaseCreateFormProps {
  mode: "update" | "approve";
  componenteRed: ComponenteRedType;
  networkId?: never;
  regionId?: never;
  stationId?: never;
}

interface ReadModeProps extends BaseCreateFormProps {
  mode: "read";
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

export default function CreateForm({
  mode = "create",
  componenteRed,
  networkId,
  componentTypeId,
  regionId,
  stationId,
}: CreateFormProps) {
  const { closeModal } = useModalStore();

  const networkInputRef = useRef<SearchableSelectHandle>(null);
  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>();
  const [componentTypeFatherId, setComponentTypeFatherId] = useState<
    number | null
  >(null);

  const [red, setRed] = useState<RedType | null>(null);
  const [redFather, setRedFather] = useState<RedType | null>(null);

  //ojo validar con como se llama....

  const [isLoadingRedes, setIsLoadingRedes] = useState(true);
  const [isLoadingTC, setIsLoadingTC] = useState(false);
  const [isLoadingFuentes, setIsLoadingFuentes] = useState(false);
  const [isLoadingRegiones, setIsLoadingRegiones] = useState(true);

  const [redes, setRedes] = useState<RedType[]>([]);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    []
  );
  const [fuentes, setFuentes] = useState<FuenteType[]>([]);
  const [regiones, setRegiones] = useState<RegionType[]>([]);
  const [region, setRegion] = useState<RegionType | null>(null);
  const [estacion, setEstacion] = useState<string | null>(
    componenteRed?.stationId?.toString() || null
  );

  const [commentPage, setCommentPage] = useState(1);
  const [commentLimit, setCommentLimit] = useState(5);

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
    onSubmit,
  } = useComponenteRedForm({ componenteRed, mode });

  const [childName, setChildName] = useState(componenteRed?.controlName ?? "");
  const [label, setLabel] = useState(componenteRed?.controlLabel ?? "");

  const convertirFormato = (texto: string): string => {
    return texto
      .split(" ")
      .map((palabra) => palabra.toUpperCase())
      .join("_");
  };

  const handleInputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    setChildName(nuevoValor);
    setLabel(convertirFormato(nuevoValor));
  };

  const handleInputLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    setLabel(convertirFormato(nuevoValor));
  };

  const initialValues = useMemo(
    () => ({
      componentId: componenteRed?.componentId?.toString().trim(),
      code: componenteRed?.code,
      observation: componenteRed?.observation?.toString() || "",
      regionId:
        componenteRed?.regionId?.toString() || regionId?.toString() || "",
      stationId:
        componenteRed?.stationId?.toString() || stationId?.toString() || "",
      refNetworkId:
        componenteRed?.refNetworkId?.toString() || networkId?.toString() || "",
      refComponentTypeId:
        componenteRed?.refComponentTypeId?.toString() ||
        componentTypeId?.toString() ||
        "",
      refSourceId: componenteRed?.refSourceId?.toString() || "",
      status: componenteRed?.status?.toString() || "",
      label: componenteRed?.controlLabel,
      name: componenteRed?.controlName,
      ...(componenteRed?.attribute
        ? JSON.parse(componenteRed.attribute)[0]
        : {}),
      ...(componenteRed?.service ? JSON.parse(componenteRed.service)[0] : {}),
    }),
    [componenteRed, networkId, componentTypeId, stationId, regionId]
  );

  const getRedes = useCallback(async () => {
    setIsLoadingRedes(true);
    const redService = new RedService();
    if (mode === "create") {
      const { data } = await redService.findAll({});
      const activeNetworks = data.data.data.filter(
        (r: RedType) => r.status === 1
      );
      setRedes(activeNetworks);
      if (networkId) {
        setRed(activeNetworks.find((r) => r.id === networkId) ?? null);
      }
    } else {
      const { data } = await redService.getById(
        Number(componenteRed?.refNetworkId)
      );
      setRedes([data?.data]);
      setRed(data?.data ?? null);
    }

    setIsLoadingRedes(false);
  }, [networkId]);

  // useEffect(() => {
  //   if (componenteRed !== undefined && componenteRed !== null) {
  //     if (componenteRed.refNetworkId)
  //       setRed(
  //         redes.find(
  //           (r) => r.id?.toString() === componenteRed.refNetworkId?.toString()
  //         ) || null
  //       );
  //     if (componenteRed.regionId)
  //       setRegion(
  //         regiones.find(
  //           (r) => r.id?.toString() === componenteRed.regionId?.toString()
  //         ) || null
  //       );
  //     // if (componenteRed.stationId)
  //     //   setEstacion(
  //     //     estaciones.find(
  //     //       (r) => r.id?.toString() === componenteRed.stationId?.toString()
  //     //     ) || null
  //     //   );
  //   }
  // }, [redes, componenteRed, regiones]);

  const getTipoComponentes = useCallback(async () => {
    // if (!red) return;
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();

    if (mode === "create") {
      // Filtro por RedId
      // -----------------
      // const { data } = await tcService.getByNetworkId(red?.id);
      // -----------------
      // Sin Filtro - todos los tipo componentes
      const response = await tcService.findAll({});
      const data = response?.data?.data?.data;
      // -----------------
      const activeComponenteTypes = data.filter(
        (t: TipoComponenteType) => t.status === 1
      );
      setTipoComponentes(activeComponenteTypes);
      if (mode !== "create" && componenteRed) {
        setTipoComponente(
          activeComponenteTypes.find(
            (t: TipoComponenteType) =>
              t.id === +componenteRed.refComponentTypeId
          ) ?? null
        );
      }
    } else {
      const response = await tcService.getById(
        Number(componenteRed?.refComponentTypeId)
      );
      const data = response?.data;
      setTipoComponentes([data]);
      setTipoComponente(data);
    }

    // if (mode === "update" && componentTypeId) {
    //   setTipoComponente(
    //     activeComponenteTypes.find(
    //       (r: TipoComponenteType) => r.id === componentTypeId
    //     ) ?? null
    //   );
    // }
    setIsLoadingTC(false);
  }, []);

  const getFuentes = useCallback(async () => {
    setIsLoadingFuentes(true);
    const fuenteService = new FuenteService();
    // if (mode === "create") {
    //   const { data } = await fuenteService.findAll({
    //     refNetworkId: red?.id,
    //   });
    //   setFuentes(data.data.data.filter((f: FuenteType) => f.status === 1));
    //   setIsLoadingFuentes(false);
    // } else {
    //   const { data } = await fuenteService.getById(
    //     Number(componenteRed?.refSourceId)
    //   );
    //   setFuentes([data.data]);
    // }
    // const fuenteService = new FuenteService();
    const { data } = await fuenteService.findAll({
      refNetworkId: red?.id,
    });
    setFuentes(data.data.data.filter((f: FuenteType) => f.status === 1));
    setIsLoadingFuentes(false);
  }, [red]);

  const getRegiones = useCallback(async () => {
    setIsLoadingRegiones(true);
    const { data } = await msDirecciones.get(
      "/api/v1/direcciones/regiones",
      {}
    );
    const activeRegions: RegionType[] = data?.data?.data || [];
    if (regionId) {
      setRegion(activeRegions.find((r) => r.id === regionId) ?? null);
    }
    setRegiones(activeRegions);
    setIsLoadingRegiones(false);
  }, []);

  useEffect(() => {
    getRedes();
    getRegiones();
    getTipoComponentes();
  }, [getRedes, getRegiones, getTipoComponentes]);

  const isValidToSearch = red && red !== null;

  useEffect(() => {
    if (isValidToSearch) {
      getFuentes();
    }
  }, [red]);

  const getConfigRelation = async () => {
    const tcService = new TipoComponenteService();
    const { data } = await tcService.All({ idList: [tipoComponente?.id] });
    if (data?.length > 0 && data[0].configRelation?.length > 0) {
      const networkFatherId = data[0].configRelation[0].networkFatherId;
      const componentTypeFatherId =
        data[0].configRelation[0].componentTypeFatherId;
      const findNetwork = redes.find((r) => r.id === networkFatherId);

      if (findNetwork) {
        networkInputRef.current?.setValue(networkFatherId.toString());
        networkInputRef.current?.setQuery(findNetwork?.label ?? "");
        setRedFather(findNetwork);
        setComponentTypeFatherId(componentTypeFatherId);
      }
    } else {
      setRedFather(null);
      setComponentTypeFatherId(null);
    }
  };

  useEffect(() => {
    if (tipoComponente) {
      getConfigRelation();
    }
  }, [tipoComponente]);

  useEffect(() => {
    if (componenteRed) {
      if (componenteRed.attribute) {
        try {
          const parsedAttr = JSON.parse(componenteRed.attribute);
          if (Array.isArray(parsedAttr) && typeof parsedAttr[0] === "object") {
            setAttribute(parsedAttr[0]);
          }
        } catch (err) {
          console.error("Error al parsear atributo:", err);
        }
      }

      if (componenteRed.service) {
        try {
          const parsedService = JSON.parse(componenteRed.service);
          if (
            Array.isArray(parsedService) &&
            typeof parsedService[0] === "object"
          ) {
            setService(parsedService[0]);
          }
        } catch (err) {
          console.error("Error al parsear service:", err);
        }
      }
    }
  }, [componenteRed]);

  const parsedComments = useMemo(() => {
    return (
      componenteRed?.approvalComment
        ?.split("|")
        .filter((entry) => entry.trim() !== "")
        .map((entry, index) => {
          const [date, userId, comment] = entry.split("$");
          return {
            id: index,
            date: date?.trim(),
            userId: userId?.trim(),
            comment: comment?.replace(/\n/g, " ")?.trim(),
          };
        }) ?? []
    );
  }, [componenteRed?.approvalComment]);

  const paginatedComments = parsedComments.slice(
    (commentPage - 1) * commentLimit,
    commentPage * commentLimit
  );

  return (
    <section className="grid content-start overflow-auto bg-[white] w-full h-full rounded-[8px] scroller scroll-smooth">
      <div className="flex justify-between">
        <header className="p-6 grid gap-4">
          <h4 className="text-[28px]">
            {mode === "create" ? "Creación" : "Detalle"} de componente de red
          </h4>
          <p>
            En esta sección, podrás crear y gestionar tus componentes de red de
            manera eficiente y personalizada.
          </p>
        </header>
        {(mode === "popup" || mode === "read") && (
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
            stationId: Number(estacion),
          } as FormValues)
        }
        className="grid grid-cols-3 content-start gap-4 px-6"
        initialValues={initialValues}
      >
        <h1 className="col-span-3 text-xl" id="datos">
          Datos del componente de red
        </h1>
        <TextField
          name={"controlName" as FormItem}
          label="Nombre"
          value={childName}
          fullWidth
          maxLength={255}
          onChange={handleInputName}
          disabled={mode === "approve" || mode === "read"}
          optional={mode === "approve" || mode === "read"}
        />
        <TextField
          name={"controlLabel" as FormItem}
          label="Etiqueta"
          value={label}
          fullWidth
          maxLength={255}
          onChange={handleInputLabel}
          disabled={mode === "approve" || mode === "read"}
          optional={mode === "approve" || mode === "read"}
        />
        <IntegerField
          name={"componentId" as FormItem}
          label="Componente ID"
          fullWidth
          maxLength={255}
          disabled={mode === "approve" || mode === "read"}
          optional={mode === "approve" || mode === "read"}
        />
        <Select
          // ref={networkInputRef}
          name={"refNetworkId" as FormItem}
          label="Red"
          disabled={mode !== "create" ? true : isLoadingRedes}
          optional={mode !== "create"}
          fullWidth
          helperText={isLoadingRedes ? "Cargando redes..." : undefined}
          options={redes.map((red) => ({
            text: red.label,
            value: red.id.toString(),
          }))}
          onChangeValue={(value) => {
            setRed(redes.find((r) => r.id === +value) || null);
            setTipoComponente(null);
          }}
        />
        <Select
          name={"refComponentTypeId" as FormItem}
          label="Tipo de componente"
          disabled={mode !== "create" ? true : isLoadingTC}
          optional={mode !== "create"}
          fullWidth
          helperText={
            isLoadingTC ? "Cargando tipos de componente..." : undefined
          }
          options={tipoComponentes.map((tc) => ({
            text: tc.label,
            value: tc.id.toString(),
          }))}
          onChangeValue={(value) =>
            setTipoComponente(
              tipoComponentes.find((t) => t.id === +value) || null
            )
          }
        />
        <Select
          name={"refSourceId" as FormItem}
          label="Fuente"
          disabled={
            mode !== "create"
              ? true
              : !isValidToSearch
                ? true
                : isLoadingFuentes
          }
          optional={mode !== "create"}
          fullWidth
          helperText={isLoadingFuentes ? "Cargando fuentes..." : undefined}
          options={fuentes.map((f) => ({
            text: f.label,
            value: f.id.toString(),
          }))}
        />
        <Select
          name={"regionId" as FormItem}
          label="Región"
          disabled={
            mode === "approve" || mode === "popup" || mode === "read"
              ? true
              : isLoadingRegiones
          }
          optional={mode === "approve" || mode === "popup" || mode === "read"}
          fullWidth
          helperText={isLoadingRegiones ? "Cargando regiones..." : undefined}
          options={regiones.map((r) => ({
            text: r.nombre,
            value: r.id.toString(),
          }))}
          onChangeValue={(value) => {
            setRegion(
              regiones?.find((r) => r?.id?.toString() === value?.toString()) ??
                null
            );
          }}
        />
        <SelectPaginate
          label="Estación"
          value={estacion ?? ""}
          clientToFetch={estacionesInstance}
          searchType="byId"
          fieldUrl={"v1/estaciones"}
          fieldKey="id"
          fieldName="nombre"
          mapById="estacion"
          onChange={(value) => {
            setEstacion(value?.toString() ?? "");
          }}
          required
          disabled={mode === "read"}
        />
        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="config-adicional"></hgroup>
        <ConfigData
          tipoComponente={tipoComponente ?? null}
          setAttributes={setAttribute}
          setServices={setService}
          attributes={attribute}
          services={service}
          networkId={Number(red?.id)}
          regionId={Number(region?.id)}
          stationId={Number(estacion)}
          disabled={mode === "read"}
          // attribute={attribute}
          // onAttributes={onAttributes}
          // service={service}
          // onServices={onServices}
        />

        {tipoComponente?.id?.toString() === "28" && (
          <>
            <hr className="col-span-3" />
            <hgroup className="col-span-3" id="relacion-jerarquica">
              <h4 className="text-[20px]">Relación jerarquica (opcional)</h4>
              <p>
                En esta sección podra relacionar componentes de red entre si
              </p>
            </hgroup>
            <RelacionJerarquica
              red={redFather}
              tipoComponenteId={componentTypeFatherId}
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
          </>
        )}

        {tipoComponente?.id?.toString() === "28" ||
          (tipoComponente?.id?.toString() === "397" && (
            <>
              <hr className="col-span-3" />
              <hgroup className="col-span-3" id="relacion-jerarquica">
                <h4 className="text-[20px]">Arbol</h4>
                <p>En esta sección se mostrara las relaciones entre nodos</p>
              </hgroup>
              <TreeView
                tipoComponente={tipoComponente ?? null}
                attributes={attribute}
                // attribute={attribute}
                // onAttributes={onAttributes}
                // service={service}
                // onServices={onServices}
              />
            </>
          ))}

        {tipoComponente &&
            <>
              <hr className="col-span-3" />
              <hgroup className="col-span-3" id="relacion-jerarquica">
                <h4 className="text-[20px]">Relacion de Atributos</h4>
                <p>En esta sección se mostrara las relaciones entre nodos</p>
              </hgroup>
              <AttributeRelation
                tipoComponente={tipoComponente ?? null}
                attributes={attribute}
              />
            </>
          }
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
            name={"observation" as FormItem}
            label="Observación"
            fullWidth
            multiline
            disabled={mode === "approve" || mode === "read"}
            optional={mode === "approve" || mode === "read"}
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
                  { title: "Fecha", render: (row: any) => row.date },
                  { title: "ID Usuario", render: (row: any) => row.userId },
                  { title: "Comentario", render: (row: any) => row.comment },
                ]}
                rows={paginatedComments}
                pagination={
                  <Pagination
                    page={commentPage}
                    limit={commentLimit}
                    items={parsedComments.length}
                    onChangePage={(p) => setCommentPage(p)}
                    onChangeLimit={(l) => {
                      setCommentLimit(l);
                      setCommentPage(1);
                    }}
                  />
                }
              />
            </div>
          </>
        )}
        {mode === "approve" && (
          <>
            <h4 className="text-[20px] mt-6 col-span-3">Agregar Comentario</h4>
            <div className="col-span-3">
              <TextField
                name={"commentApproval"}
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
        {mode !== "read" && (
          <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee] col-span-3 justify-center">
            <Button showSpinner={isSubmitting}>Guardar</Button>
          </footer>
        )}
      </Form>
    </section>
  );
}
