"use client";
import Table, { TableColumn } from "@/components/Table/Table";
import Filter from "./Filter";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import ExportXLS from "./ExportXLS";
import ShowColumns, { ShowColumnType } from "./ShowColumns";
import useStorage from "@/hooks/useStorage";
import MenuList from "./MenuList";
import Create from "./create";
import Edit from "./Edit";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { Tag, useDialog, useSnackbar } from "@telefonica/mistica";
import Pagination from "@/components/Pagination";
import Aprobar from "./Aprobar";

export default function MantenedorRedPage() {
  const { confirm } = useDialog();
  const { openSnackbar } = useSnackbar();

  const [search, setSearch] = useState<string | null>();
  const [openFiter, setOpenFilter] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<number>(10);
  const [limit, setLimit] = useState<number>(20);

  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>(null);
  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-mantenedor-tipo-componente",
    {
      label: true,
      name: true,
      status: true,
      id: true,
    } as Record<ShowColumnType, boolean>,
  );

  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );

  const [selectedTC, setSelectedTC] = useState<TipoComponenteType | null>(null);

  const getComponentTypes = useCallback(async () => {
    setIsLoadingTC(true);
    const tcService = new TipoComponenteService();
    const { data } = await tcService.findAll({ page, limit, q: search });
    setTipoComponentes(data.data.data);
    setItems(data.data.total);
    setIsLoadingTC(false);
  }, [page, limit, search]);

  const deteleComponentType = useCallback(
    async (id: number) => {
      const tcService = new TipoComponenteService();
      await tcService.detele(id);
      openSnackbar({ message: "Tipo de componente eliminado" });
      getComponentTypes();
    },
    [getComponentTypes, openSnackbar],
  );

  const columns = useMemo<TableColumn<TipoComponenteType>[]>(() => {
    return [
      {
        title: "ID",
        key: "id",
        hidden: !showColumn.id,
      },
      {
        title: "Etiqueta",
        key: "label",
        hidden: !showColumn.label,
      },
      {
        title: "Nombre",
        key: "name",
        hidden: !showColumn.name,
      },
      {
        title: "Estado",
        hidden: !showColumn.status,
        render: (row) => (
          <Tag type={row.status === 1 ? "success" : "inactive"}>
            {row.status === 1 ? "Activo" : "Inactivo"}
          </Tag>
        ),
      },
      {
        maxWidth: "64px",
        render: (row) => (
          <MenuList
            tc={row}
            onApproval={() => {
              setOpenApprove(true);
              setTipoComponente(row);
            }}
            onEdit={() => {
              setSelectedTC(row);
              setOpenEdit(true);
            }}
            onDelete={() => {
              confirm({
                title: `Eliminar ${row.name}`,
                message: "¿Estás seguro de eliminar este tipo de componente?",
                destructive: true,
                onAccept: () => deteleComponentType(row.id),
              });
            }}
          />
        ),
      },
    ];
  }, [showColumn, confirm, deteleComponentType]);

  useEffect(() => {
    getComponentTypes();
  }, [getComponentTypes]);
  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
        {openFiter && <Filter onSubmit={console.log} />}
        <Table
          columns={columns}
          rows={tipoComponentes}
          isLoading={isLoadingTC || isLoadingShowColumn}
          header={
            <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
              <h1 className="col-span-2 text-[22px]">
                Mantenedor de tipo de componentes
              </h1>
              <InputSearch onSearch={(value) => setSearch(value)} />
              <menu className="flex gap-4">
                <ExportXLS />
                <ShowColumns
                  showColumn={showColumn}
                  onSubmit={(value) => setShowColumn(value)}
                />
                <Button
                  variant="secondary"
                  StartIcon={() => (
                    <Icon icon={openFiter ? "close" : "filter_list"} />
                  )}
                  onClick={() => setOpenFilter(!openFiter)}
                >
                  {openFiter ? "Cerrar Filtros" : "Filtrar"}
                </Button>
                <Button
                  StartIcon={() => <Icon icon="add" />}
                  onClick={() => setOpenCreate(true)}
                >
                  Crear
                </Button>
              </menu>
            </header>
          }
          pagination={
            <Pagination
              page={page}
              limit={limit}
              items={items}
              onChangePage={(pag) => setPage(pag)}
              onChangeLimit={(lim) => setLimit(lim)}
            />
          }
        />
      </section>
      {openApprove && (
        <Aprobar
          tc={tipoComponente}
          onClose={() => setOpenApprove(false)}
          onSuccess={() => {
            openSnackbar({
              message: `${tipoComponente?.name} aprobado`,
              type: "INFORMATIVE",
            });
            getComponentTypes();
          }}
        />
      )}
      {openCreate && (
        <Create
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Tipo de componente creado exitosamente",
              type: "INFORMATIVE",
            });
            getComponentTypes();
          }}
        />
      )}
      {openEdit && (
        <Edit
          tipoComponente={selectedTC!}
          onClose={() => setOpenEdit(false)}
          onSuccess={() => {
            openSnackbar({
              message:
                "Mantenedor de tipo de componente actualizado exitosamente",
              type: "INFORMATIVE",
            });
            getComponentTypes();
          }}
        />
      )}
    </>
  );
}
