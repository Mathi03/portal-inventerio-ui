import Select from "@/components/Select";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { RedService } from "@/core/red/red.service";
import { RedType } from "@/core/red/red.type";
import { useCallback, useEffect, useState } from "react";


// ... (imports y otros estados)

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
  const [selectedRedId, setSelectedRedId] = useState<number | null>(null);

  // 1. **Carga de Redes (Una sola vez en producción):**
  // Esta función solo trae las redes y es estable.
  const fetchRedesData = useCallback(async () => {
    setIsLoadingRed(true);
    try {
      const redService = new RedService();
      const { data } = await redService.findAll({});
      setRedes(data.data.data);
    } catch (error) {
      console.error("Error fetching redes:", error);
    } finally {
      setIsLoadingRed(false);
    }
  }, []); // Dependencia vacía: se crea una sola vez.

  // 2. **Disparar la carga al montar:**
  // Este efecto llama a fetchRedesData. En producción, se ejecuta una vez.
  // En desarrollo con Strict Mode, se ejecuta dos veces, pero fetchRedesData es idempotente.
  useEffect(() => {
    fetchRedesData();
  }, [fetchRedesData]);

  // 3. **Selección Inicial y Notificación al Padre (¡La clave aquí!):**
  // Este efecto es CRUCIAL. Se ejecuta cuando:
  // - Las `redes` se cargan (cambian de [] a los datos).
  // - `componenteRed.refNetworkId` cambia (cuando el padre lo actualiza de null a un valor).
  useEffect(() => {
    // Solo procedemos si ya tenemos las redes Y si el refNetworkId ya no es null/undefined
    if (redes.length > 0 && componenteRed.refNetworkId !== undefined && componenteRed.refNetworkId !== null) {
      const initialSelected = redes.find((r) => r.id === componenteRed.refNetworkId);
      if (initialSelected) {
        // Actualizamos el estado interno del Select
        setSelectedRedId(initialSelected.id);
        // Notificamos al componente padre SOLAMENTE SI LA RED SELECCIONADA ES DIFERENTE
        // Esta condición es muy importante para evitar bucles de re-renderización.
        // Si 'red' en el padre ya es 'initialSelected', no lo vuelvas a setear.
        // Asumiendo que 'red' en el padre es igual al 'initialSelected' que pasas por onChange.
        // Podrías necesitar un prop adicional de 'currentSelectedRed' desde el padre para esta comparación.
        // Por ahora, lo dejamos simple, pero tenlo en cuenta.
        onChange(initialSelected);
      }
    } else if (redes.length > 0 && (componenteRed.refNetworkId === null || componenteRed.refNetworkId === undefined)) {
        // Si las redes están cargadas pero NO hay un ID inicial (null/undefined),
        // asegúrate de que el select no tenga nada seleccionado internamente.
        setSelectedRedId(null);
    }
  }, [redes, componenteRed.refNetworkId, onChange]); // Dependencias: redes cargadas, el ID del componente padre, y la función onChange.

  // 4. **Manejo de la Selección del Usuario:**
  // Esta función se encarga solo cuando el usuario cambia el valor.
  const handleSelectChange = useCallback((value: string) => {
    const selected = redes.find((r) => r.id === +value);
    if (selected) {
      setSelectedRedId(selected.id);
      onChange(selected); // Notifica al padre
    }
  }, [redes, onChange]); // Depende de 'redes' (que ya están cargadas) y 'onChange' (que viene del padre y debe ser estable).

  // ... (tu JSX de retorno con el componente Select)
  return (
    <Select
      disabled={isLoadingRedes}
      name={name}
      label="Red"
      onChangeValue={handleSelectChange}
      options={redes
        .filter((red) => red.status === 1)
        .map((red) => ({
          text: red.label,
          value: red.id.toString(),
        }))}
      helperText={isLoadingRedes ? "cargando redes..." : undefined}
      fullWidth
      value={selectedRedId?.toString() || ""}
    />
  );
}