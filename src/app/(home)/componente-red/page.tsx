"use client";
import Table, { TableColumn } from "@/components/Table/Table";
import Filter from "./Filter";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import ExportXLS from "./ExportXLS";
import ShowColumns from "./ShowColumns";
import useStorage from "@/hooks/useStorage";
import MenuList from "./MenuList";
import CrearComponenteRed from "./Crear";
import Edit from "./Edit";
import Pagination from "@/components/Pagination";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { Tag, useDialog, useSnackbar } from "@telefonica/mistica";
import Aprobar from "./Aprobar";
import { useRouter } from "next/navigation";

export default function ComponenteRedPage() {
  const { confirm } = useDialog();
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const [openFiter, setOpenFilter] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<number>(10);
  const [limit, setLimit] = useState<number>(20);

  const [componenteRedes, setComponenteRedes] = useState<ComponenteRedType[]>(
    [],
  );

  const [selectedCR, setSelectedCR] = useState<ComponenteRedType | null>(null);
  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-componente-red",
    {
      codigo: true,
      componente_id: true,
      nombre: true,
      etiqueta: true,
      tipo_componente: true,
      red: true,
      id_control: true,
      id_estacion: true,
      fuente: true,
      status: true,
    },
  );

  const getComponenteRedes = useCallback(async () => {
    const componenteRed = new ComponenteRedService();
    const { data } = await componenteRed.findAll({ page, limit, q: "" });
    setComponenteRedes(data.data.data);
    setItems(data.data.total);
  }, [page, limit]);

  const deteleRed = useCallback(
    async (id: number) => {
      const componenteRed = new ComponenteRedService();
      await componenteRed.detele(id);
      getComponenteRedes();
      openSnackbar({ message: "Componente de red eliminado" });
    },
    [getComponenteRedes, openSnackbar],
  );
  const columns = useMemo<TableColumn<ComponenteRedType>[]>(() => {
    return [
      // {
      //   title: "Codigo",
      //   key: "code",
      //   hidden: !showColumn.codigo,
      // },
      {
        title: "id",
        key: "id",
        hidden: !showColumn.componente_id,
      },
      {
        title: "Nombre",
        key: "name",
        hidden: !showColumn.nombre,
      },
      {
        title: "Etiqueta",
        key: "label",
        hidden: !showColumn.etiqueta,
      },
      {
        title: "Región",
        hidden: !showColumn.etiqueta,
        render: (row) => <Tag type="active">{row.regionId.toString()}</Tag>,
      },
      {
        title: "Tipo de componente",
        render: (row) => (
          <Tag type="active">{row.refComponentTypeId.toString()}</Tag>
        ),
        hidden: !showColumn.tipo_componente,
      },
      {
        title: "Red",
        render: (row) => <Tag type="active">{row.refNetworkId.toString()}</Tag>,
        hidden: !showColumn.red,
      },
      {
        title: "Fuente",
        render: (row) => <Tag type="active">{row.refSourceId.toString()}</Tag>,
        hidden: !showColumn.id_control,
      },
      {
        title: "Id Control",
        render: (row) => <Tag type="active">{row.controlId.toString()}</Tag>,
        hidden: !showColumn.id_control,
      },
      {
        title: "Id Estación",
        render: (row) => <Tag type="active">{row.stationId.toString()}</Tag>,
        hidden: !showColumn.id_estacion,
      },
      {
        title: "Status",
        render: (row) => (
          <Tag type={row.status === 1 ? "success" : "inactive"}>
            {row.status === 1 ? "Activo" : "Inactivo"}
          </Tag>
        ),
        hidden: !showColumn.status,
      },
      {
        maxWidth: "64px",
        render: (row) => (
          <MenuList
            status={row.status}
            onEdit={() => {
              router.push(`/detalle-componente-red/${row.id}`);
            }}
            onApprove={() => {
              setSelectedCR(row);
              setOpenApprove(true);
            }}
            onDelete={() => {
              confirm({
                title: `Eliminar ${row.name}`,
                message: "¿Estás seguro de eliminar este componente de red?",
                destructive: true,
                onAccept: () => deteleRed(row.id),
              });
            }}
          />
        ),
      },
    ];
  }, [showColumn, deteleRed, confirm, router]);

  useEffect(() => {
    getComponenteRedes();
  }, [getComponenteRedes]);
  return (
    <>
      <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
        {openFiter && <Filter />}
        <Table
          columns={columns}
          rows={componenteRedes}
          isLoading={isLoadingShowColumn}
          header={
            <header className="flex justify-between gap-4">
              <InputSearch onSearch={console.log} />
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
                  onClick={() => setOpenCrear(true)}
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
      {openCrear && (
        <CrearComponenteRed
          onClose={() => setOpenCrear(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Componente de red creado exitosamente",
              type: "INFORMATIVE",
            });
            getComponenteRedes();
          }}
        />
      )}
      {openEditar && (
        <Edit
          componenteRed={selectedCR}
          onClose={() => setOpenEditar(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Componente de red aprobado",
              type: "INFORMATIVE",
            });
            getComponenteRedes();
          }}
        />
      )}
      {openApprove && (
        <Aprobar
          componenteRed={selectedCR}
          onClose={() => setOpenApprove(false)}
          onSuccess={() => {
            openSnackbar({
              message: "Componente de red aprobado",
              type: "INFORMATIVE",
            });
            getComponenteRedes();
          }}
        />
      )}
    </>
  );
}
