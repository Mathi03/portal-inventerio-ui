"use client";
import Table from "@/components/Table/Table";
import Filter from "./Filter";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import ExportXLS from "./ExportXLS";
import ShowColumns from "./ShowColumns";
import MenuList from "./MenuList";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "@/components/Pagination";
import Aprobar from "./Aprobar";
import useTipoComponente from "./useTipoComponente";
import useColumn from "./useColumn";
import ButtonFilter from "../ButtonFilter";
import usePagination from "@/hooks/usePagination";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { useDialog } from "@telefonica/mistica";

export default function MantenedorRedPage() {
  const { confirm } = useDialog();
  const { page, limit, setPage, setLimit } = usePagination();
  const {
    tipoComponentes,
    tipoComponente,
    tipoComponenteCount,
    loadingTipoComponentes,
    getTipoComponentes,
    setTipoComponente,
    deleteTipoComponente,
  } = useTipoComponente();
  const { columns, showColumn, setShowColumn } = useColumn();

  const [search, setSearch] = useState<string | null>();
  const [openFilter, setOpenFilter] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);

  const onLoad = useCallback(() => {
    getTipoComponentes({ search, page, limit });
  }, [search, page, limit, getTipoComponentes]);

  const onEdit = useCallback(
    (tipoComponente: TipoComponenteType) => {
      setTipoComponente(tipoComponente);
      setOpenEdit(true);
    },
    [setTipoComponente],
  );

  const onDelete = useCallback(
    (tipoComponente: TipoComponenteType) => {
      const { id, name } = tipoComponente;
      confirm({
        title: `Eliminar tipo de componente "${name}"`,
        message: "¿Estás seguro de eliminar este tipo de componente?",
        destructive: true,
        onAccept: async () => {
          await deleteTipoComponente(id, name);
          onLoad();
        },
      });
    },
    [deleteTipoComponente, confirm, onLoad],
  );

  useEffect(() => {
    onLoad();
  }, [onLoad]);
  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
        {openFilter && <Filter onSubmit={console.log} />}
        <Table
          columns={columns({
            maxWidth: "64px",
            render: (row) => (
              <MenuList
                tc={row}
                onApproval={console.log}
                onEdit={() => onEdit(row)}
                onDelete={() => onDelete(row)}
              />
            ),
          })}
          rows={tipoComponentes}
          isLoading={loadingTipoComponentes}
          header={
            <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
              <h1 className="col-span-2 text-[22px]">Tipo de componentes</h1>
              <InputSearch onSearch={(value) => setSearch(value)} />
              <menu className="flex gap-4">
                <ExportXLS />
                <ShowColumns
                  showColumn={showColumn}
                  onSubmit={(value) => setShowColumn(value)}
                />
                <ButtonFilter
                  openFilter={openFilter}
                  onClick={() => setOpenFilter(!openFilter)}
                />
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
              items={tipoComponenteCount}
              onChangePage={(pag) => setPage(pag)}
              onChangeLimit={(lim) => setLimit(lim)}
            />
          }
        />
      </section>
      {openApprove && (
        <Aprobar
          tc={tipoComponente!}
          onClose={() => setOpenApprove(false)}
          onSuccess={onLoad}
        />
      )}
      {openCreate && (
        <Create onClose={() => setOpenCreate(false)} onSuccess={onLoad} />
      )}
      {openEdit && (
        <Edit
          tipoComponente={tipoComponente!}
          onClose={() => setOpenEdit(false)}
          onSuccess={onLoad}
        />
      )}
    </>
  );
}
