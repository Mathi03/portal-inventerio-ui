import Select from "@/components/Select";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { useCallback, useEffect, useState } from "react";

export default function SelectRedes({
  componenteRed,
  name,
  onChange,
}: {
  componenteRed: ComponenteRedType;
  name: string;
  onChange: (red: RedType) => void;
}) {
  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [redes, setRedes] = useState<RedType[]>([]);

  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    setRedes(data.data.data);
    onChange(data.data.data.find((r) => r.id === componenteRed.refNetworkId)!);
    setIsLoadingRed(false);
  }, [componenteRed]);

  useEffect(() => {
    getRedes();
  }, [getRedes]);
  return (
    <Select
      disabled={isLoadingRedes}
      name={name}
      label="Red"
      onChangeValue={(value) => onChange(redes.find((r) => r.id === +value)!)}
      options={redes
        .filter((red) => red.status === 1)
        .map((red) => ({
          text: red.label,
          value: red.id.toString(),
        }))}
      helperText={isLoadingRedes ? "cargando redes..." : undefined}
      fullWidth
    />
  );
}
