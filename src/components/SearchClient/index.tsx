"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import useStorage from "@/hooks/useStorage";
import Filter from "./Filter";
import { useSnackbar } from "@telefonica/mistica";
import { useModalStore } from "@/hooks/modalStorage";
import { ClienteType } from "@/core/cliente/cliente.type";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import InputSearch from "@/components/InputSearch";
import DropdownMenu, { DropdownItemMenu } from "@/components/DropdownMenu";
import ShowColumns from "./ShowColumns";
import Table, { TableColumn } from "@/components/Table/Table";
import { ClienteService } from "@/core/cliente/cliente.service";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";
import { QueryClienteDto } from "@/core/cliente/dto/search.dto";
import Pagination from "@/components/Pagination";

interface SearchClientProps {
  onSelected: (client: ClienteType) => void;
}

const SearchClient = ({ onSelected }: SearchClientProps) => {
  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModalStore();

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [openFilter, setOpenFilter] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [clientes, setClientes] = useState<ClienteType[]>([]);
  const [filter, setFilter] = useState<Partial<QueryClienteDto>>({});

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
        const clienteService = new ClienteService();
        const cleanedFilter = Object.fromEntries(
          Object.entries(filter).filter(([, v]) => v !== "" && v !== null)
        );

        const { data } = await clienteService.findAll(
          {
            page,
            limit,
            ...cleanedFilter,
          },
          signal // <- importante
        );

        setClientes(data?.data?.data ?? []);
        setTotalItems(data?.data?.total ?? 0);
      } catch (err) {
        if (axios.isCancel(err)) {
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

  const handleAdvancedSearch = (filters: QueryClienteDto) => {
    setFilter(filters);
    setPage(1);
  };

  const handleItemClick = (item: DropdownItemMenu, row: ClienteType) => {
    if (item?.url) {
      window.location.href = item.url;
    } else if (item.action) {
      item.action(row);
    }
  };

  const columns = useMemo<TableColumn<ClienteType>[]>(
    () => [
      {
        title: "ID",
        key: "id",
        hidden: !showColumn.id,
      },
      {
        title: "Nombre administrativo",
        key: "nombreadministrativo",
        hidden: !showColumn.nombreadministrativo,
      },
      {
        title: "Nombre comercial",
        key: "nombrecomercial",
        hidden: !showColumn.nombrecomercial,
      },
      {
        title: "RIF",
        key: "rif",
        hidden: !showColumn.rif,
      },
      {
        title: "Estatus",
        key: "idestatus",
        hidden: !showColumn.idestatus,
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
    setPage(newPage);
    setLimit(newLimit);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchClientes(signal);

    return () => {
      controller.abort();
    };
  }, [fetchClientes]);

  return (
    <section className="flex p-2 gap-2 w-full h-full relative overflow-hidden">
      {openFilter && <Filter onSearch={handleAdvancedSearch} />}
      <Table
        item={totalItems}
        itemPerPage={limit}
        columns={columns}
        rows={clientes}
        isLoading={isLoadingData}
        onPageChange={handlePageChange}
        header={
          <header className="grid grid-cols-[1fr_auto] justify-between gap-4">
            <h1 className="col-span-2 text-[22px]">Buscar Cliente</h1>
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

export default SearchClient;
