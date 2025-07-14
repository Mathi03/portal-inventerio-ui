"use client";
import Table, { TableColumn } from "@/components/Table/Table";
import Filter, { FormFilterType } from "./Filter";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import ExportXLS from "./ExportXLS";
import ShowColumns from "./ShowColumns";
import useStorage from "@/hooks/useStorage";
import MenuList from "./MenuList";
import Pagination from "@/components/Pagination";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { Tag, useDialog, useSnackbar } from "@telefonica/mistica";
import Aprobar from "./Aprobar";
import { useRouter } from "next/navigation";
import DetalleTipoComponente from "../DetalleTipoComponente";
import DetalleRed from "../DetalleRed";
import DetalleFuente from "../DetalleFuente";
import DetalleControl from "../DetalleControl";

export default function ComponenteRedPage() {
  const [search, setSearch] = useState<string | null>();
  const { confirm } = useDialog();
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const [openFiter, setOpenFilter] = useState(true);
  const [openApprove, setOpenApprove] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<number>(10);
  const [limit, setLimit] = useState<number>(20);

  const [componenteRedes, setComponenteRedes] = useState<ComponenteRedType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState({} as FormFilterType);

  const [selectedCR, setSelectedCR] = useState<ComponenteRedType | null>(null);
  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-componente-red",
    {
      id: true,
      name: true,
      label: true,
      controlLabel :true,
      regionId: true,
      refComponentTypeId: true,
      refNetworkId: true,
      refSourceId: true,
      controlId: true,
      stationId: true,
    } as Record<
      keyof Pick<
        ComponenteRedType,
        | "id"
        | "controlLabel"
        | "regionId"
        | "refComponentTypeId"
        | "refNetworkId"
        | "refSourceId"
        | "controlId"
        | "stationId"


      >,
      boolean
    >,
  );

  const getComponenteRedes = useCallback(async () => {
    setIsLoading(true);
    const componenteRed = new ComponenteRedService();
    const { data } = await componenteRed.findAll({
      page,
      limit,
      q: search,
      ...filter,
    });
    console.log("este es la data", data)
    setComponenteRedes(data.data.data);
    setItems(data.data.total);
    setIsLoading(false);
  }, [page, limit, filter, search]);

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
        hidden: !showColumn.id,
      },
      {
        title: "Nombre",
        key: "name",
        hidden: !showColumn.controlLabel,
      },
      {
        title: "Etiqueta",
        key: "controlLabel",
        hidden: !showColumn.controlLabel,
      },
      {
        title: "Región",
        hidden: !showColumn.regionId,
        render: (row) => <Tag type="active">{row.regionId.toString()}</Tag>,
      },
      {
        title: "Tipo de componente",
        render: (row) => <DetalleTipoComponente id={row.refComponentTypeId} />,
        hidden: !showColumn.refComponentTypeId,
      },
      {
        title: "Red",
        render: (row) => <DetalleRed id={row.refNetworkId} />,
        hidden: !showColumn.refNetworkId,
      },
      {
        title: "Fuente",
        render: (row) => <DetalleFuente id={row.refSourceId} />,
        hidden: !showColumn.refSourceId,
      },
      {
        title: "Id Control",
        render: (row) => <DetalleControl id={row.controlId} />,
        hidden: !showColumn.controlId,
      },
      {
        title: "Id Estación",
        render: (row) => <Tag type="active">{row.stationId.toString()}</Tag>,
        hidden: !showColumn.stationId,
      },
      {
        title: "Status",
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
                title: `Eliminar ${row.controlLabel}`,
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
        {openFiter && <Filter onFilter={(filter) => setFilter(filter)} />}
        <Table
          columns={columns}
          rows={componenteRedes}
          isLoading={isLoadingShowColumn || isLoading}
          header={
            <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
              <h1 className="col-span-2 text-[22px]">Componente de redes</h1>
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
                  onClick={() => router.push("crear-componente-red")}
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
