import Table, { TableColumn } from "@/components/Table/Table";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { RedType } from "@/core/red/red.type";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Checkbox } from "@telefonica/mistica";
import { useCallback, useEffect, useMemo, useState } from "react";

interface RelacionJerarquicaProps {
  tipoComponente?: TipoComponenteType | null;
  red?: RedType | null;
  onSelected: (componente: ComponenteRedType) => void;
  onDeselected: (componente: ComponenteRedType) => void;
}

export default function RelacionJerarquica({
  tipoComponente,
  red,
  onSelected,
  onDeselected,
}: RelacionJerarquicaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [componenteRedes, setComponenteRedes] = useState<ComponenteRedType[]>(
    []
  );

  const columns = useMemo<TableColumn<ComponenteRedType>[]>(
    () => [
      {
        maxWidth: "64px",
        render: (row) => (
          <Checkbox
            name="check"
            onChange={(checked) =>
              checked ? onSelected(row) : onDeselected(row)
            }
          />
        ),
      },
      {
        title: "id",
        key: "id",
      },
      {
        title: "Nombre",
        key: "controlName",
      },
      {
        title: "Etiqueta",
        key: "controlLabel",
      },
    ],
    [onSelected, onDeselected]
  );

  const getComponenteRedes = useCallback(async () => {
    if (!red) return;
    setIsLoading(true);
    const componenteRed = new ComponenteRedService();
    const query: Record<string, string> = {
      q: "",
      ref_network_id: String(red.id),
    };

    if (tipoComponente?.id) {
      query.ref_component_type_id = String(tipoComponente.id);
    }

    const { data } = await componenteRed.findAll(query);
    setComponenteRedes(data.data.data);
    setIsLoading(false);
  }, [red, tipoComponente]);

  useEffect(() => {
    getComponenteRedes();
  }, [getComponenteRedes]);

  return (
    <div className="col-span-3 h-[50svh] grid grid-rows-[1fr]">
      <Table
        columns={columns}
        rows={componenteRedes}
        isLoading={isLoading}
        compact
      />
    </div>
  );
}
