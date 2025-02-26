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
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";

export default function MantenedorTipoComponentePage() {
  const { confirm } = useDialog();
  const { openSnackbar } = useSnackbar();

  const [search, setSearch] = useState<string | null>();
  const [openFiter, setOpenFilter] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<number>(10);
  const [limit, setLimit] = useState<number>(20);

  const [isLoadingRedes, setIsLoadingRedes] = useState(true);

  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-mantenedor-red",
    {
      label: true,
      name: true,
      status: true,
      id: true,
    } as Record<ShowColumnType, boolean>,
  );

  const [redes, setRedes] = useState<RedType[]>([]);

  const [selectedRed, setSelectedRed] = useState<RedType | null>(null);

  const getRedes = useCallback(async () => {
    setIsLoadingRedes(true);
    const redService = new RedService();
    const { data } = await redService.findAll({ page, limit, q: search });
    setRedes(data.data.data);
    setItems(data.data.total);
    setIsLoadingRedes(false);
  }, [page, limit, search]);

  const deteleRed = useCallback(
    async (id: number) => {
      const redService = new RedService();
      await redService.detele(id);
      getRedes();
    },
    [getRedes],
  );

  const columns = useMemo<TableColumn<RedType>[]>(() => {
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
            onEdit={() => {
              setSelectedRed(row);
              setOpenEdit(true);
            }}
            onDelete={() => {
              confirm({
                title: `Eliminar ${row.name}`,
                message: "¿Estás seguro de eliminar este mantenedor de red?",
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
    getRedes();
  }, [getRedes]);
  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
        {openFiter && <Filter onSubmit={console.log} />}
        <Table
          columns={columns}
          rows={redes}
          isLoading={isLoadingRedes || isLoadingShowColumn}
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
              message: "Mantenedor de red creado exitosamente",
              type: "INFORMATIVE",
            });
            getRedes();
          }}
        />
      )}
      {openEdit && (
        <Edit
          red={selectedRed!}
          onClose={() => setOpenEdit(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Mantenedor de red actualizado exitosamente",
              type: "INFORMATIVE",
            });
            getRedes();
          }}
        />
      )}
    </>
  );
}
