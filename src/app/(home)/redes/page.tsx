"use client";
import Table from "@/components/Table/Table";
import Filter from "./Filter";
import { useCallback, useEffect, useState } from "react";
import Edit from "./Edit";
import { useDialog } from "@telefonica/mistica";
import Pagination from "@/components/Pagination";
import useRed from "./useRed";
import useColumn from "./useColumn";
import InputSearch from "@/components/InputSearch";
import ExportXLS from "./ExportXLS";
import ShowColumns from "./ShowColumns";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import ButtonFilter from "../ButtonFilter";
import Create from "./Create";
import MenuList from "./MenuList";
import { RedType } from "@/core/red/red.type";
import usePagination from "@/hooks/usePagination";

export default function MantenedorRedPage() {
  const { confirm } = useDialog();
  const { page, limit, setPage, setLimit } = usePagination();
  const { redes, loadingRedes, red, redCount, getRedes, setRed, deteleRed } =
    useRed();
  const { columns, showColumn, setShowColumn } = useColumn();

  const [search, setSearch] = useState<string | null>();
  const [openFilter, setOpenFilter] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const onLoad = useCallback(() => {
    getRedes({ search, page, limit });
  }, [search, page, limit, getRedes]);

  const onEdit = useCallback(
    (red: RedType) => {
      setRed(red);
      setOpenEdit(true);
    },
    [setRed],
  );

  const onDelete = useCallback(
    (red: RedType) => {
      const { id, name } = red;
      confirm({
        title: `Eliminar red "${name}"`,
        message: "¿Estás seguro de eliminar este mantenedor de red?",
        destructive: true,
        onAccept: async () => {
          await deteleRed(id, name);
          onLoad();
        },
      });
    },
    [deteleRed, confirm, onLoad],
  );

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden isolate">
        {openFilter && <Filter onSubmit={console.log} />}
        <Table
          columns={columns({
            maxWidth: "64px",
            render: (row) => (
              <MenuList
                onEdit={() => onEdit(row)}
                onDelete={() => onDelete(row)}
              />
            ),
          })}
          rows={redes}
          isLoading={loadingRedes}
          header={
            <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
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
              items={redCount}
              onChangePage={(pag) => setPage(pag)}
              onChangeLimit={(lim) => setLimit(lim)}
            />
          }
        />
      </section>
      {openCreate && (
        <Create onClose={() => setOpenCreate(false)} onSuccess={onLoad} />
      )}
      {openEdit && (
        <Edit
          red={red!}
          onClose={() => setOpenEdit(false)}
          onSuccess={onLoad}
        />
      )}
    </>
  );
}
