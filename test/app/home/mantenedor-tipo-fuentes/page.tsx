"use client";
import Table, { TableColumn } from "@/components/Table/Table";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import ShowColumns, { ShowColumnType } from "./ShowColumns";
import useStorage from "@/hooks/useStorage";
import MenuList from "./MenuList";
import Create from "./create";
import Edit from "./Edit";
import { Tag, useDialog, useSnackbar } from "@telefonica/mistica";
import Pagination from "@/components/Pagination";
import Filter, { FilterFormValues } from "./Filter";
import { TipoFuenteService } from "@/core/tipo-fuente/tipo-fuente.service";
import { TipoFuenteType } from "@/core/tipo-fuente/tipo-fuente.type";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";
import axios from "axios";

export default function MantenedorFuentePage() {
  const { confirm } = useDialog();
  const { openSnackbar } = useSnackbar();

  const [openFiter, setOpenFilter] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<number>(10);
  const [limit, setLimit] = useState<number>(20);
  const [filter, setFilter] = useState<any>({} as any);

  const [isLoadingFuentes, setIsLoadingFuentes] = useState(true);

  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-mantenedor-tipo-fuente",
    {
      label: true,
      name: true,
      status: true,
      id: true,
    } as Record<ShowColumnType, boolean>
  );

  const [fuentes, setFuentes] = useState<TipoFuenteType[]>([]);

  const [selectedFuente, setSelectedFuente] = useState<TipoFuenteType | null>(
    null
  );

  const getTipoFuentes = useCallback(async () => {
    setIsLoadingFuentes(true);
    const fuenteService = new TipoFuenteService();
    const cleanedFilter: Partial<typeof filter> = Object.fromEntries(
      Object.entries(filter).filter(
        ([, value]) => value !== null && value !== ""
      )
    );

    const { data } = await fuenteService.findAll({
      page,
      limit,
      ...cleanedFilter,
    });
    setFuentes(data.data.data);
    setItems(data.data.total);
    setIsLoadingFuentes(false);
  }, [page, limit, filter]);

  const deteleRed = useCallback(
    async (id: number) => {
      const fuenteService = new TipoFuenteService();

      try {
        await fuenteService.delete(id);

        getTipoFuentes();
        openSnackbar({ message: "Mantenedor de tipo fuente eliminado" });
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          openSnackbar({
            message: errorMessageInAPI,
            type: "CRITICAL",
          });
        } else {
          openSnackbar({
            message: errorGeneric,
            type: "CRITICAL",
          });
        }
      }
    },
    [getTipoFuentes, openSnackbar]
  );

  const columns = useMemo<TableColumn<TipoFuenteType>[]>(() => {
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
    getTipoFuentes();
  }, [getTipoFuentes]);

  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
        {openFiter && <Filter onSubmit={(filter) => setFilter(filter)} />}
        <Table
          columns={columns}
          rows={fuentes}
          isLoading={isLoadingFuentes || isLoadingShowColumn}
          header={
            <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
              <h1 className="col-span-2 text-[22px]">
                Mantenedor de Tipo Fuentes
              </h1>
              <InputSearch
                onSearch={(value) =>
                  setFilter({ name: "", label: "", q: value ?? "", status: "" })
                }
              />
              <menu className="flex gap-4">
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
            getTipoFuentes();
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
            getTipoFuentes();
          }}
        />
      )}
    </>
  );
}
