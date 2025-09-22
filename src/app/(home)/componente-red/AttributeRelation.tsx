import CreateForm from "@/app/crear-componente-red/CreateForm";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Table, { TableColumn } from "@/components/Table/Table";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { useSnackbar } from "@telefonica/mistica";
import { useCallback, useEffect, useMemo, useState } from "react";

type AttributeRelationProps = {
  tipoComponente: TipoComponenteType | null;
  attributes: { [key: string]: any };
  disabled?: boolean;
};

type AttributeSpec =
  | "id_control_nodo_a"
  | "id_control_tarjeta_a"
  | "id_componente_puerto_a";

const clienteSpecs: AttributeSpec[] = [
  "id_control_nodo_a",
  "id_control_tarjeta_a",
  "id_componente_puerto_a",
];

const limit = 10;

const AttributeRelation = ({
  tipoComponente,
  attributes,
  disabled = false,
}: AttributeRelationProps) => {
  const { openSnackbar } = useSnackbar();
  const [openForm, setOpenForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [componenteRedes, setComponenteRedes] = useState<ComponenteRedType[]>(
    []
  );
  const [cmpntRed, setCmpntRed] = useState<ComponenteRedType | null>(null);
  const [selectedAttribute, setSelectedAttribute] =
    useState<AttributeSpec | null>(null);

  const columns = useMemo<TableColumn<ComponenteRedType>[]>(
    () => [
      { title: "id", key: "id", maxWidth: "120px" },
      { title: "Nombre", key: "controlName" },
      { title: "Etiqueta", key: "controlLabel" },
      {
        title: "Ver Componente",
        render: (row) => (
          <Icon
            icon="open_in_new"
            className="cursor-pointer"
            onClick={() => {
              setCmpntRed(row);
              setOpenForm(true);
            }}
          />
        ),
      },
    ],
    []
  );

  const getComponenteRedes = useCallback(async () => {
    if (!selectedAttribute) return;
    setIsLoading(true);
    const componenteRed = new ComponenteRedService();
    const key = selectedAttribute;
    const value = attributes[key];
    try {
      const response = await componenteRed.findByAttribute(key, value, {
        page,
        limit,
      });
      const data = response.data.data;
      setComponenteRedes(data.data);
      setItems(data.total);
    } catch (error) {
      console.error("Error al obtener componentes de red:", error);
      openSnackbar({
        message: "Error al cargar datos relación de atributos",
        type: "CRITICAL",
      });
      setComponenteRedes([]);
      setItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, openSnackbar, selectedAttribute, attributes]);

  useEffect(() => {
    getComponenteRedes();
  }, [getComponenteRedes]);

  /** ---- Validaciones iniciales ---- */
  const configDataItem = tipoComponente ? tipoComponente.configData?.[0] : null;
  const configAttributes = configDataItem?.configAttributes ?? [];

  if (!tipoComponente || configAttributes.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No existe configuración de atributos
      </div>
    );
  }

  const hasValidAttribute = clienteSpecs.some((spec) => spec in attributes);
  if (!hasValidAttribute) return null;

  /** ---- Opciones renderizadas como cards con radio ---- */
  const availableSpecs = configAttributes.filter((attr) =>
    clienteSpecs.includes(attr.name as AttributeSpec)
  );

  return (
    <div className="col-span-3 h-[50svh] grid grid-rows-[auto,1fr] gap-4">
      <div className="flex gap-4">
        {availableSpecs.map((attr) => {
          const specName = attr.name as AttributeSpec;
          return (
            <label
              key={specName}
              className={`flex items-center gap-2 cursor-pointer border rounded-lg p-3 shadow-sm w-48
                ${
                  selectedAttribute === specName
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => !disabled && setSelectedAttribute(specName)}
            >
              <input
                type="radio"
                name="attributeSpec"
                checked={selectedAttribute === specName}
                onChange={() => setSelectedAttribute(specName)}
                disabled={disabled}
              />
              <span>{attr.label}</span>
            </label>
          );
        })}
      </div>

      {selectedAttribute && (
        <Table
          columns={columns}
          rows={componenteRedes}
          isLoading={isLoading}
          itemPerPage={limit}
          item={items}
          onPageChange={(p) => setPage(p)}
          compact
        />
      )}
      {cmpntRed && (
        <Modal open={openForm} onClose={() => setOpenForm(false)}>
          <CreateForm mode="read" componenteRed={cmpntRed ?? {}} />
        </Modal>
      )}
    </div>
  );
};

export default AttributeRelation;
