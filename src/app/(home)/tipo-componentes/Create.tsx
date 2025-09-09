"use client";
import { CreateTipoComponenteDto } from "@/core/tipo-componente/dto/create.dto";
import {
  ButtonPrimary,
  ButtonSecondary,
  Form,
  Switch,
  TextField,
  Select,
  useDialog,
  useSnackbar,
} from "@telefonica/mistica";
import { useCallback, useEffect, useMemo, useState } from "react";
import useTipoComponente from "./useTipoComponente";
import {
  AllTipoComponenteResponse,
  CreateRefComponentTypeRequestDto,
  TCStatusEnumOptions,
  TCTypeEnumOptions,
  TipoComponenteRed,
  TipoComponenteType,
} from "@/core/tipo-componente/tipo-componente.type";
import Table, { TableColumn } from "@/components/Table/Table";
import useStorage from "@/hooks/useStorage";
import useRed from "../redes/useRed";
import usePagination from "@/hooks/usePagination";
import Header from "../Header";
import ParentAssociationWizardModal from "./ParentAssociationWizardModal";
import IconButton from "@/components/IconButton";
import SelectedRedModal from "./SelectedRedModal";
import ConfigurationsModal from "./ConfigurationsModal";
import AsideTypeComponent from "@/components/AsideTypeComponent";
import { UpdateTipoComponenteDto } from "@/core/tipo-componente/dto/updatev2.dto";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";

const convertirFormato = (texto: string): string => {
  return texto
    .split(" ")
    .map((palabra) => palabra.toUpperCase())
    .join("_");
};

type FormItem = keyof Pick<
  CreateRefComponentTypeRequestDto,
  "label" | "name" | "tipo" | "status"
>;

export type ChildComponentTypeNetwork = {
  id: number;
  red: string;
  configAttributes: any[];
  configServices: any[];
};

export type ConfigRelationTable = {
  parentId: number;
  parentLabel: string;
  parentRedId: number;
  parentRedName: string;
  childRedId: number;
  childRedName: string;
  childType: string;
};

export default function Create({
  onSuccess,
  onClose,
  tipoComponente,
  mode = "create",
  allTipoComponente: allByProp,
}: {
  onSuccess: () => void;
  onClose: () => void;
  tipoComponente?: TipoComponenteType;
  mode?: "create" | "edit" | "approve";
  allTipoComponente?: AllTipoComponenteResponse[];
}) {
  const { openSnackbar } = useSnackbar();
  const [parentAssociations, setParentAssociations] = useState<
    ConfigRelationTable[]
  >([]);
  const [creating, setCreating] = useState(false);
  const [openTcAssociate, setOpenTcAssociate] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<ChildComponentTypeNetwork[]>([]);
  const [editConfigurationsSelected, setEditConfigurationSelected] = useState<{
    type: "attributes" | "services";
    row: any;
  } | null>(null);
  const { page, limit } = usePagination();
  const [search, setSearch] = useState<string | null>();
  const [selectedTechs, setSelectedTechs] = useState<{
    [key: string]: { key: string; label: string } | undefined;
  }>({});
  const [openParentModal, setOpenParentModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [childName, setChildName] = useState("");
  const [label, setLabel] = useState("");
  const [tipo, setTipo] = useState<any>();
  const [status, setStatus] = useState<any>();
  const { redes, loadingRedes, getRedes } = useRed();
  const { confirm } = useDialog();
  const {
    createTipoComponente,
    updateTipoComponente,
    allTipoComponente: allByHook,
    allTipoComponentes,
  } = useTipoComponente({ onSuccess, onClose, setCreating });

  const allTipoComponente: AllTipoComponenteResponse[] = allByProp
    ? allByProp
    : allByHook;

  useEffect(() => {
    if (mode !== "create" && allByProp === undefined && tipoComponente) {
      allTipoComponentes({
        idList: [tipoComponente.id],
      });
    }
  }, []);

  useEffect(() => {
    const loadTipoComponenteData = async () => {
      if (allTipoComponente.length === 0) return;
      if (redes.length === 0) return;

      const current = allTipoComponente[0];

      // Datos básicos
      setChildName(current?.name || "");
      setLabel(current?.label || "");
      setTipo(current?.tipo || "");
      setStatus(
        TCStatusEnumOptions.find((value) => value.value == current?.status)
          ?.label || ""
      );

      // ConfigsData
      const configsData: ChildComponentTypeNetwork[] =
        current.configData.map((configData) => ({
          id: redes?.find((t) => t.id == configData?.networkId)?.id ?? 0,
          red: redes?.find((t) => t.id == configData?.networkId)?.label ?? "",
          configAttributes: configData.configAttributes,
          configServices: configData.configServices,
        })) ?? [];
      setData(configsData);

      // SelectedTechs
      const formattedTechs = current.configData.reduce(
        (
          acc: { [key: string]: { key: string; label: string } | undefined },
          item
        ) => {
          acc[item.networkId] = {
            key: item.networkId.toString(),
            label: redes?.find((t) => t.id == item?.networkId)?.label ?? "",
          };
          return acc;
        },
        {}
      );
      setSelectedTechs(formattedTechs);

      // 🔹 Fetch parents labels en paralelo con Promise.all
      const tipoComponenteService = new TipoComponenteService();
      const errors: number[] = [];
      const relationsWithParents = await Promise.all(
        current.configRelation.map(async (configData) => {
          try {
            const { data: padre } = await tipoComponenteService.getById(
              configData.componentTypeFatherId
            );
            return {
              parentId: configData.componentTypeFatherId,
              parentRedId: configData.networkFatherId,
              childRedId: configData.networkId,
              childType: current.name,
              parentLabel: padre?.label ?? "ERROR AL CARGA NOMBRE",
              parentRedName:
                redes?.find(
                  (r) =>
                    r?.id?.toString() === configData.networkFatherId?.toString()
                )?.name ?? "",
              childRedName:
                redes?.find(
                  (r) => r?.id?.toString() === configData.networkId?.toString()
                )?.name ?? "",
            };
          } catch (err) {
            console.error(
              `Error obteniendo padre con id ${configData.componentTypeFatherId}`,
              err
            );
            errors.push(configData.componentTypeFatherId);
            return {
              parentId: configData.componentTypeFatherId,
              parentRedId: configData.networkFatherId,
              childRedId: configData.networkId,
              childType: current.name,
              parentLabel: "ERROR AL CARGA NOMBRE",
              parentRedName:
                redes?.find(
                  (r) =>
                    r?.id?.toString() === configData.networkFatherId?.toString()
                )?.name ?? "",
              childRedName:
                redes?.find(
                  (r) => r?.id?.toString() === configData.networkId?.toString()
                )?.name ?? "",
            };
          }
        })
      );

      if (errors.length > 0) {
        openSnackbar({
          message: `No se pudieron cargar ${errors.length} padres`,
          type: "CRITICAL",
        });
      }

      setParentAssociations(relationsWithParents);
    };

    loadTipoComponenteData();
  }, [allTipoComponente, redes, openSnackbar]);

  useEffect(() => {
    if (parentAssociations?.length > 0) {
      setParentAssociations((prev) =>
        prev.map((assoc) => ({
          ...assoc,
          childType: childName,
        }))
      );
    }
  }, [childName]);

  useEffect(() => {
    setChecked(parentAssociations?.length > 0);
  }, [parentAssociations]);

  const onLoadRedes = useCallback(() => {
    getRedes({ search, page, limit: 1000 });
  }, [search, page, limit, getRedes]);

  useEffect(() => {
    onLoadRedes();
  }, [onLoadRedes]);

  const [showColumn] = useStorage("filter-type-component", {
    red: true,
    configAttributes: true,
    configServices: true,
  });

  const columns = useMemo<TableColumn<TipoComponenteRed>[]>(
    () => [
      {
        title: "Red",
        hidden: !showColumn.red,
        render: (row: any) => <span>{row.red}</span>,
      },
      {
        title: "Configuracion de atributos",
        hidden: !showColumn.configAttributes,
        render: (row: any) => (
          <ButtonSecondary
            onPress={() =>
              setEditConfigurationSelected({ type: "attributes", row })
            }
          >
            {mode === "approve" ? "Ver" : "Editar"}
          </ButtonSecondary>
        ),
      },
      {
        title: "Configuracion de servicios",
        hidden: !showColumn.configServices,
        render: (row: any) => (
          <ButtonSecondary
            onPress={() =>
              setEditConfigurationSelected({ type: "services", row })
            }
          >
            {mode === "approve" ? "Ver" : "Editar"}
          </ButtonSecondary>
        ),
      },
    ],
    [showColumn]
  );

  const parentColumns = useCallback(
    (renderAction?: (row: RowData) => JSX.Element) => {
      const columns = [
        {
          title: "Tipo de componente padre",
          key: "parentLabel",
        },
        {
          title: "Red padre",
          key: "parentRedName",
        },
        {
          title: "Tipo de componente hijo",
          key: "childType",
        },
        {
          title: "Red hijo",
          key: "childRedName",
        },
      ];

      if (mode !== "approve" && renderAction) {
        columns.push({
          key: "actions",
          maxWidth: "64px",
          render: renderAction,
        });
      }

      return columns;
    },
    [mode, data]
  );

  const onCreate = useCallback(
    async ({
      label,
      name,
      tipo,
    }: Pick<CreateRefComponentTypeRequestDto, "label" | "name" | "tipo">) => {
      setCreating(true);
      const dto: CreateTipoComponenteDto = {
        createRefComponentTypeRequestDto: {
          label,
          name,
          status: 3,
          commentApproval: "",
          tipo,
          flagAlone: checked,
        },
        createConfigDataRequestDto: data.map((row) => ({
          componentTypeId: 0,
          networkId: row.id,
          status: 0,
          configAttributes: row.configAttributes ?? [],
          configServices: row.configServices ?? [],
        })),
        createConfigRelationRequestDto: parentAssociations.map((assoc) => ({
          componentTypeId: 0,
          componentTypeFatherId: assoc.parentId,
          networkId: assoc.childRedId,
          networkFatherId: assoc.parentRedId,
          status: 0,
        })),
      };
      await createTipoComponente(dto);
    },
    [onClose, createTipoComponente, checked, data, parentAssociations]
  );

  const onUpdate = useCallback(
    async ({
      label,
      name,
      tipo,
      status,
    }: Pick<
      CreateRefComponentTypeRequestDto,
      "label" | "name" | "tipo" | "status"
    >) => {
      setCreating(true);

      const dto: UpdateTipoComponenteDto = {
        updateRefComponentTypeRequestDto: {
          label,
          name,
          status: 3,
          commentApproval: "",
          tipo,
          flagAlone: checked,
          id: tipoComponente!.id,
        },
        updateConfigDataRequestDto: data.map((row) => ({
          componentTypeId: tipoComponente!.id,
          networkId: row.id,
          status: row.status ?? 0,
          configAttributes: row.configAttributes ?? [],
          configServices: row.configServices ?? [],
        })),
        updateConfigRelationRequestDto: parentAssociations.map((assoc) => ({
          componentTypeId: tipoComponente!.id,
          componentTypeFatherId: assoc.parentId,
          networkId: assoc.childRedId,
          networkFatherId: assoc.parentRedId,
          status: 0,
        })),
      };
      await updateTipoComponente(tipoComponente!.id, dto);
    },
    [
      data,
      parentAssociations,
      status,
      tipoComponente,
      onClose,
      updateTipoComponente,
      onSuccess,
    ]
  );

  const handleSaveTechs = (selected: any[]) => {
    const selectedIds = selected.map((key) => key.key.toString());

    const existingRows = data.filter((row) =>
      selectedIds.includes(row.id.toString())
    );
    const newRows = selected
      .filter(
        (key) => !data.some((row) => row.id.toString() === key.key.toString())
      )
      .map((key) => ({
        id: redes.find((t) => t.id == key.key)?.id,
        red: redes.find((t) => t.id == key.key)?.label,
        configAttributes: [],
        configServices: [],
      }));

    setData([...existingRows, ...newRows]);
  };

  const handleSaveConfig = (
    key: string,
    type: "attributes" | "services",
    value: any
  ) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === key
          ? {
              ...row,
              configAttributes:
                type === "attributes" ? value : row.configAttributes,
              configServices: type === "services" ? value : row.configServices,
            }
          : row
      )
    );
  };

  const deleteParentAssociation = (row: any) => {
    confirm({
      title: `Eliminar`,
      message: "¿Estás seguro de eliminar esta relación?",
      destructive: true,
      onAccept: async () => {
        setParentAssociations((prev) =>
          prev.filter(
            (assoc) =>
              !(
                assoc.parentRedId === row.parentRedId &&
                assoc.childRedId === row.childRedId
              )
          )
        );
      },
    });
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

  const isValidConfiguration = data.every(
    (item) => item.configAttributes.length > 0 || item.configServices.length > 0
  );

  const onApprove = async (value: CreateRefComponentTypeRequestDto) => {
    const tipoComponenteService = new TipoComponenteService();
    await tipoComponenteService.approval(
      tipoComponente?.id as number,
      value.commentApproval,
      isApproved ? 1 : 4
    );
    onClose();
    onSuccess();
  };

  const [commentPage, setCommentPage] = useState(1);
  const [commentLimit, setCommentLimit] = useState(5);

  const parsedComments =
    allTipoComponente[0]?.commentApproval
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
      }) ?? [];

  const paginatedComments = parsedComments.slice(
    (commentPage - 1) * commentLimit,
    commentPage * commentLimit
  );

  return (
    <AsideTypeComponent
      className="grid grid-rows-[auto_1fr_auto] overflow-auto w-[100%]"
      onClose={onClose}
      zIndex={0}
    >
      <Header></Header>

      <Form
        onSubmit={(value) =>
          mode === "approve"
            ? onApprove(value as CreateRefComponentTypeRequestDto)
            : mode === "edit"
              ? onUpdate(value as CreateRefComponentTypeRequestDto)
              : onCreate(value as CreateRefComponentTypeRequestDto)
        }
        className="grid px-6 content-start"
        initialValues={{
          tipo: "",
          status: "",
        }}
      >
        <div className="py-6 flex flex-col gap-2">
          <h4 className="text-[28px]">
            {mode === "create"
              ? "Crear"
              : mode === "edit"
                ? "Editar"
                : "Validar"}{" "}
            tipo de componente
          </h4>
          <p>
            Ingrese todo los datos correspondiente para crear con éxito un
            mantenedor de tipo de componente
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextField
            name={"name" as FormItem}
            value={childName}
            label="Nombre"
            fullWidth
            maxLength={255}
            onChange={handleInputName}
            readOnly={mode === "approve"}
          />

          <TextField
            name={"label" as FormItem}
            value={label}
            label="Etiqueta"
            fullWidth
            maxLength={255}
            onChange={handleInputLabel}
            readOnly={mode === "approve"}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Select
            name={"tipo" as FormItem}
            value={tipo}
            label="Caracteristicas de tipo de componente"
            options={TCTypeEnumOptions.map((option) => ({
              text: option.label,
              value: option.label.toString(),
            }))}
            onChangeValue={(e) => setTipo(e)}
            fullWidth
            disabled={mode === "approve"}
          />
          {tipoComponente && (
            <Select
              name={"status" as FormItem}
              label="Estado"
              options={TCStatusEnumOptions.map((option) => ({
                text: option?.label,
                value: option?.label.toString(),
              }))}
              value={status}
              onChangeValue={(e) => setStatus(e)}
              fullWidth
              disabled
            />
          )}
        </div>
        {mode !== "approve" && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div></div>
            <ButtonSecondary onPress={() => setOpenTcAssociate(true)}>
              Asociar tipo de componente a una red
            </ButtonSecondary>
          </div>
        )}

        {data.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Switch
              checked={checked}
              onChange={(value: boolean, _) => {
                setOpenParentModal(true);
              }}
              disabled={mode === "approve"}
            >
              Posee tipo componente padre?
            </Switch>
          </div>
        )}
        {data.length > 0 && (
          <>
            <h5 className="text-[28px]">
              Redes asociadas al tipo de componente
            </h5>
            <Table columns={columns} rows={data ?? []} />
          </>
        )}
        {data.some(
          (item) =>
            item.configAttributes.length === 0 &&
            item.configServices.length === 0
        ) && (
          <div className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
            ⚠️ <strong>Error de configuración:</strong> En las siguientes redes
            falta configuración:
            <ul className="list-disc list-inside mt-2">
              {data
                .filter(
                  (item) =>
                    item.configAttributes.length === 0 &&
                    item.configServices.length === 0
                )
                .map((item) => (
                  <li key={item.id}>
                    <strong>{item.red}</strong>: Agrega al menos un valor en{" "}
                    <em>Configuración de atributos</em> o{" "}
                    <em>Configuración de servicios</em>.
                  </li>
                ))}
            </ul>
          </div>
        )}

        {parentAssociations?.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[28px]">Tipo de componente padre</h4>
              {mode !== "approve" && (
                <ButtonPrimary
                  size="small"
                  onPress={() => setOpenParentModal(true)}
                >
                  Agregar asociación
                </ButtonPrimary>
              )}
            </div>
            <Table
              columns={parentColumns((row: any) => (
                <IconButton
                  icon="delete"
                  onClick={() => {
                    deleteParentAssociation(row);
                  }}
                />
              ))}
              rows={parentAssociations}
            />
          </>
        )}

        {allTipoComponente[0]?.commentApproval && (
          <>
            <h4 className="text-[28px] mt-6">Historial de comentarios</h4>
            <Table
              columns={[
                { title: "Fecha", render: (row: any) => row.date },
                { title: "ID Usuario", render: (row: any) => row.userId },
                { title: "Comentario", render: (row: any) => row.comment },
              ]}
              rows={paginatedComments}
            />
            <div className="mt-4">
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
            </div>
          </>
        )}

        {mode === "approve" && (
          <>
            <h4 className="text-[28px] mt-6">Agregar Comentario</h4>
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
          </>
        )}

        <br />
        <footer className="flex justify-end gap-2 p-4 border-t-[1px] border-[#eee]">
          <ButtonSecondary size="small" onPress={onClose}>
            Cancelar
          </ButtonSecondary>
          <ButtonPrimary
            size="small"
            submit
            showSpinner={creating}
            disabled={!isValidConfiguration}
          >
            {mode !== "create" && allTipoComponente[0]
              ? mode === "edit"
                ? "Actualizar"
                : "Guardar"
              : "Guardar"}
          </ButtonPrimary>
        </footer>
      </Form>

      {openTcAssociate && (
        <SelectedRedModal
          redes={redes}
          onClose={() => setOpenTcAssociate(false)}
          selectedTechs={selectedTechs}
          loadingRedes={loadingRedes}
          setSelectedTechs={setSelectedTechs}
          onSave={handleSaveTechs}
        />
      )}

      {editConfigurationsSelected && (
        <ConfigurationsModal
          type={editConfigurationsSelected.type}
          row={editConfigurationsSelected.row}
          onClose={() => setEditConfigurationSelected(null)}
          onSave={handleSaveConfig}
          {...(mode === "approve" ? { mode: "view" } : {})}
        />
      )}

      {openParentModal && data && (
        <ParentAssociationWizardModal
          onClose={() => {
            setOpenParentModal(false);
          }}
          childName={childName}
          redesPadre={redes}
          redesHijo={data}
          onSave={(association) => {
            setParentAssociations((prev) => [...prev, association]);
          }}
          tipoComponenteId={tipoComponente?.id || 0}
          parentAssociations={parentAssociations}
        />
      )}
    </AsideTypeComponent>
  );
}
