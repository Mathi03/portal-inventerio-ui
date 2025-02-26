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
import { Tag, useDialog, useSnackbar } from "@telefonica/mistica";
import Pagination from "@/components/Pagination";
import { FuenteType } from "@/core/fuente/fuente.type";
import { FuenteService } from "@/core/fuente/fuente.service";

export default function MantenedorFuentePage() {
  const { confirm } = useDialog();
  const { openSnackbar } = useSnackbar();

  const [search, setSearch] = useState<string | null>();
  const [openFiter, setOpenFilter] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<number>(10);
  const [limit, setLimit] = useState<number>(20);

  const [isLoadingFuentes, setIsLoadingFuentes] = useState(true);

  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-mantenedor-fuente",
    {
      label: true,
      name: true,
      status: true,
      id: true,
      attribute: true,
      refComponentTypeId: true,
      refNetworkId: true,
      version: true,
    } as Record<ShowColumnType, boolean>,
  );

  const [fuentes, setFuentes] = useState<FuenteType[]>([]);

  const [selectedFuente, setSelectedFuente] = useState<FuenteType | null>(null);

  const getFuentes = useCallback(async () => {
    setIsLoadingFuentes(true);
    const fuenteService = new FuenteService();
    const { data } = await fuenteService.findAll({ page, limit, q: search });
    setFuentes(data.data.data);
    setItems(data.data.total);
    setIsLoadingFuentes(false);
  }, [page, limit, search]);

  const deteleRed = useCallback(
    async (id: number) => {
      const fuenteService = new FuenteService();
      await fuenteService.detele(id);
      getFuentes();
      openSnackbar({ message: "Mantenedor de fuente eliminado" });
    },
    [getFuentes, openSnackbar],
  );

  const columns = useMemo<TableColumn<FuenteType>[]>(() => {
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
        title: "Tipo de componente",
        render: (row) => (
          <Tag type="inactive">{row.refComponentTypeId.toString()}</Tag>
        ),
        hidden: !showColumn.refComponentTypeId,
      },
      {
        title: "Red",
        render: (row) => (
          <Tag type="inactive">{row.refNetworkId.toString()}</Tag>
        ),
        hidden: !showColumn.refNetworkId,
      },
      {
        title: "Versión",
        key: "version",
        hidden: !showColumn.version,
      },
      {
        title: "Atributo",
        key: "attribute",
        hidden: !showColumn.attribute,
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
            onEdit={() => {
              setSelectedFuente(row);
              setOpenEdit(true);
            }}
            onDelete={() => {
              confirm({
                title: `Eliminar ${row.name}`,
                message: "¿Estás seguro de eliminar este mantenedor de fuente?",
                destructive: true,
                onAccept: () => deteleRed(row.id),
              });
            }}
          />
        ),
      },
    ];
  }, [showColumn, confirm, deteleRed]);

  useEffect(() => {
    getFuentes();
  }, [getFuentes]);
  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
        {openFiter && <Filter onSubmit={console.log} />}
        <Table
          columns={columns}
          rows={fuentes}
          isLoading={isLoadingFuentes || isLoadingShowColumn}
          header={
            <header className="flex justify-between gap-4">
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
      {openCreate && (
        <Create
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Mantenedor de fuente creado exitosamente",
              type: "INFORMATIVE",
            });
            getFuentes();
          }}
        />
      )}
      {openEdit && (
        <Edit
          fuente={selectedFuente!}
          onClose={() => setOpenEdit(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Mantenedor de fuente actualizado exitosamente",
              type: "INFORMATIVE",
            });
            getFuentes();
          }}
        />
      )}
    </>
  );
}
