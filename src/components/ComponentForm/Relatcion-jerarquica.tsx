import Table, { TableColumn } from '@/components/Table/Table';
import { ComponenteRedService } from '@/core/componente-red/componente-red.service';
import { ComponenteRedType } from '@/core/componente-red/componente-red.type';
import { RedType } from '@/core/red/red.type';
import { errorGeneric, errorMessageInAPI } from '@/types/errorMessageInAPI';
import { Checkbox, useSnackbar } from '@telefonica/mistica';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface RelacionJerarquicaProps {
  tipoComponenteId?: number | null;
  red?: RedType | null;
  onSelected: (componente: ComponenteRedType) => void;
  onDeselected: (componente: ComponenteRedType) => void;
}

export default function RelacionJerarquica({
  tipoComponenteId,
  red,
  onSelected,
  onDeselected
}: RelacionJerarquicaProps) {
  const { openSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [componenteRedes, setComponenteRedes] = useState<ComponenteRedType[]>(
    []
  );
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<Record<string, any>>({});
  const itemPerPage = 10;

  const columns = useMemo<TableColumn<ComponenteRedType>[]>(
    () => [
      {
        maxWidth: '64px',
        render: (row) => (
          <Checkbox
            name={`check-${row.id}`}
            onChange={(checked) =>
              checked ? onSelected(row) : onDeselected(row)
            }
          />
        )
      },
      {
        title: 'ID',
        key: 'id'
      },
      {
        title: 'Nombre',
        key: 'controlName'
      },
      {
        title: 'Etiqueta',
        key: 'controlLabel'
      }
    ],
    [onSelected, onDeselected]
  );

  const getComponenteRedes = useCallback(async () => {
    if (!red?.id || !tipoComponenteId) {
      setComponenteRedes([]);
      return;
    }

    setIsLoading(true);
    const componenteRed = new ComponenteRedService();

    try {
      const query: Record<string, string | number> = {
        ref_network_id: String(red.id),
        ref_component_type_id: String(tipoComponenteId),
        page: currentPage,
        limit: itemPerPage,
        ...filter
      };

      const { data } = await componenteRed.findAll(query);
      setComponenteRedes(data.data.data);
      setTotalItems(data.data.total ?? 0);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        openSnackbar({
          message: errorMessageInAPI,
          type: 'CRITICAL'
        });
      } else {
        openSnackbar({
          message: errorGeneric,
          type: 'CRITICAL'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [red?.id, tipoComponenteId, currentPage, filter, openSnackbar]);

  useEffect(() => {
    getComponenteRedes();
  }, [getComponenteRedes]);

  const handlePageChange = (newPage: number, newLimit: number) => {
    setCurrentPage(newPage);
    setFilter((prev) => ({
      ...prev,
      page: newPage,
      limit: newLimit
    }));
  };

  return (
    <div className="col-span-3 h-[50svh] grid grid-rows-[1fr]">
      <Table
        item={totalItems}
        itemPerPage={itemPerPage}
        columns={columns}
        rows={componenteRedes}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
