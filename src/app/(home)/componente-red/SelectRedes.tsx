import Select from "@/components/Select";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { useCallback, useEffect, useState } from "react";

export default function SelectRedes({ name }: { name: string }) {
  const [isLoadingRedes, setIsLoadingRed] = useState(true);
  const [redes, setRedes] = useState<RedType[]>([]);

  const getRedes = useCallback(async () => {
    setIsLoadingRed(true);
    const redService = new RedService();
    const { data } = await redService.findAll({});
    setRedes(data.data.data);
    setIsLoadingRed(false);
  }, []);

  useEffect(() => {
    getRedes();
  }, [getRedes]);
  return (
    <Select
      disabled={isLoadingRedes}
      name={name}
      label="Red"
      options={redes
        .filter((red) => red.status === 1)
        .map((red) => ({
          text: red.label,
          value: red.id.toString(),
        }))}
      helperText={isLoadingRedes ? "cargando redes..." : undefined}
      optional
      fullWidth
    />
  );
}
