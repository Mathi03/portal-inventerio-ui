import Button from "@/components/Button";
import Icon from "@/components/Icon";

export default function ButtonFilter({
  openFilter,
  onClick,
}: {
  openFilter: boolean;
  onClick: (e: any) => void;
}) {
  return (
    <Button
      variant="secondary"
      StartIcon={() => <Icon icon={openFilter ? "close" : "filter_list"} />}
      onClick={onClick}
    >
      {openFilter ? "Cerrar Filtros" : "Filtrar"}
    </Button>
  );
}
