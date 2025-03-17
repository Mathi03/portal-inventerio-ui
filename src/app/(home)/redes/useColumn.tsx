import { TableColumn } from "@/components/Table/Table";
import { RedType } from "@/core/red/red.type";
import { useCallback } from "react";
import useStorage from "@/hooks/useStorage";
import TagStatus from "@/components/TagStatus";

export type ShowColumnType = keyof RedType;

export default function useColumn() {
  const [showColumn, setShowColumn] = useStorage("filtro-redes", {
    label: true,
    name: true,
    status: true,
    id: true,
  } as Record<ShowColumnType, boolean>);

  const columns = useCallback(
    (menu: TableColumn<RedType>) => {
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
      ] as TableColumn<RedType>[];
    },
    [showColumn],
  );

  return { columns, showColumn, setShowColumn };
}
