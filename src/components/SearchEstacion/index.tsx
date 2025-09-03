"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import useStorage from "@/hooks/useStorage";
import Filter from "./Filter";
import { useSnackbar } from "@telefonica/mistica";
import { useModalStore } from "@/hooks/modalStorage";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import DropdownMenu, { DropdownItemMenu } from "@/components/DropdownMenu";
import ShowColumns from "./ShowColumns";
import Table, { TableColumn } from "@/components/Table/Table";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";
import Pagination from "@/components/Pagination";
import { EstacionService } from "@/core/estaciones/estacion.service";
import { EstacionType } from "@/core/estaciones/estacion.type";
import { QueryEstacionDto } from "@/core/estaciones/dto/search.dto";

interface SearchEstacionProps {
  onSelected: (client: EstacionType) => void;
}

const SearchEstacion = ({ onSelected }: SearchEstacionProps) => {
  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModalStore();

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [openFilter, setOpenFilter] = useState(true);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState<Partial<QueryEstacionDto>>({});
  const [totalItems, setTotalItems] = useState(0);
  // const [itemPerPage, setItemPerPage] = useState(10);
  const itemPerPage = 10;

  const [clientes, setClientes] = useState<EstacionType[]>([]);

  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    "filtro-cliente",
    {
      id: true,
      nombreadministrativo: true,
      nombrecomercial: true,
      rif: true,
      idestatus: true,
    }
  );

  const fetchClientes = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoadingData(true);

      try {
        const estacionService = new EstacionService();
        const cleanedFilter = Object.fromEntries(
          Object.entries(filter).filter(([, v]) => v !== "" && v !== null)
        );

        const { data } = await estacionService.findAll(
          {
            page,
            limit,
            ...cleanedFilter,
          },
          signal // <-- Pasar el signal aquí
        );

        setClientes(data?.data?.data ?? []);
        setTotalItems(data?.data?.total);
      } catch (err) {
        if (axios.isCancel(err)) {
          // La consulta fue cancelada, no hacer nada
          console.log("Consulta cancelada");
          return;
        }

        if (axios.isAxiosError(err) && err.response) {
          openSnackbar({ message: errorMessageInAPI, type: "CRITICAL" });
        } else {
          openSnackbar({ message: errorGeneric, type: "CRITICAL" });
        }
      } finally {
        setIsLoadingData(false);
      }
    },
    [page, limit, filter, openSnackbar]
  );

  const handleSearch = (value: string | null) => {
    setFilter((prev) => ({ ...prev, q: value }));
    setPage(1);
  };

  const handleAdvancedSearch = (filters: QueryEstacionDto) => {
    setFilter(filters);
    setPage(1);
  };

  const handleItemClick = (item: DropdownItemMenu, row: EstacionType) => {
    if (item?.url) {
      window.location.href = item.url;
    } else if (item.action) {
      item.action(row);
    }
  };

  const columns = useMemo<TableColumn<EstacionType>[]>(
    () => [
      {
        title: "Id Estación",
        key: "idEstacion",
        hidden: !showColumn.id,
        maxWidth: "100px",
      },
      {
        title: "Código",
        key: "codigo",
        hidden: !showColumn.nombreadministrativo,
        maxWidth: "100px",
      },
      {
        title: "Nombre",
        key: "nombre",
        hidden: !showColumn.nombrecomercial,
        maxWidth: "350px",
      },
      {
        title: "Código Pais",
        key: "codigoPais",
        hidden: !showColumn.rif,
        maxWidth: "100px",
      },
      {
        title: "Propietario Estación",
        hidden: !showColumn.rif,
        maxWidth: "100px",
        render: (row) => <span>{row?.tmveOwner ? "Movistar" : "Cliente"}</span>,
      },
      {
        title: "Dirección",
        key: "direccion",
        hidden: !showColumn.rif,
        maxWidth: "400px",
      },
      {
        maxWidth: "64px",
        render: (row) => (
          <DropdownMenu
            items={[
              {
                label: "Seleccionar",
                action: () => {
                  onSelected(row);
                  closeModal();
                },
              },
            ]}
            horizontalPosition="right"
            verticalPosition="top"
            onItemClick={(item: DropdownItemMenu) => handleItemClick(item, row)}
          />
        ),
      },
    ],
    [showColumn]
  );

  const handlePageChange = (newPage: number, newLimit: number) => {
    console.log("handlePageChange", newPage, newLimit);

    setCurrentPage(newPage);

    setFilter((prev) => ({
      ...prev,
      page: newPage,
      limit: newLimit,
    }));
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchClientes(signal);

    return () => {
      controller.abort(); // Cancela la consulta anterior si hay una nueva
    };
  }, [fetchClientes]);

  return (
    <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
      {openFilter && <Filter onSearch={handleAdvancedSearch} />}
      <Table
        item={totalItems}
        itemPerPage={itemPerPage}
        columns={columns}
        rows={clientes}
        isLoading={isLoadingData}
        onPageChange={handlePageChange}
        header={
          <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
            <h1 className="col-span-2 text-[22px]">Buscar Estación</h1>
            <InputSearch onSearch={handleSearch} />
            <menu className="flex gap-4">
              <ShowColumns
                showColumn={showColumn}
                onSubmit={setShowColumn}
                columnsToExport={[
                  { name: "id", text: "Id" },
                  {
                    name: "nombreadministrativo",
                    text: "Nombre administrativo",
                  },
                  { name: "nombrecomercial", text: "Nombre comercial" },
                  { name: "rif", text: "RIF" },
                ]}
              />
              <Button
                variant="secondary"
                StartIcon={() => (
                  <Icon icon={openFilter ? "close" : "filter_list"} />
                )}
                onClick={() => setOpenFilter(!openFilter)}
              >
                {openFilter ? "Cerrar Filtros" : "Filtrar"}
              </Button>
              <Button variant="primary" onClick={() => closeModal()}>
                Cerrar
              </Button>
            </menu>
          </header>
        }
      />
    </section>
  );
};

export default SearchEstacion;
