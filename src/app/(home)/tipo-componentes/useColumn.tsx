import { TableColumn } from "@/components/Table/Table";
import { useCallback } from "react";
import useStorage from "@/hooks/useStorage";
import TagStatus from "@/components/TagStatus";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";

export type ShowColumnType = keyof TipoComponenteType;

export default function useColumn() {
  const [showColumn, setShowColumn] = useStorage("filtro-tipo-componentes", {
    label: true,
    name: true,
    status: true,
    id: true,
  } as Record<ShowColumnType, boolean>);

  const columns = useCallback(
    (menu: TableColumn<TipoComponenteType>) => {
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
          render: (row) => <TagStatus status={row.status} />,
        },
        menu,
      ] as TableColumn<TipoComponenteType>[];
    },
    [showColumn],
  );

  return { columns, showColumn, setShowColumn };
}
