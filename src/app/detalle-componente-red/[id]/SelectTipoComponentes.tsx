import Select from "@/components/Select";
import { ComponenteRedType } from "@/core/componente-red/componente-red.type";
import { TipoComponenteService } from "@/core/tipo-componente/tipo-componente.service";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { useCallback, useEffect, useState } from "react";

export default function SelectTipoComponentes({
  componenteRed,
  name,
  onChange,
}: {
  componenteRed: ComponenteRedType;
  name: string;
  onChange: (tc: TipoComponenteType) => void;
}) {
  const [isLoadingTC, setIsLoadingTC] = useState(true);
  const [tipoComponentes, setTipoComponentes] = useState<TipoComponenteType[]>(
    [],
  );
  const [selectedTCId, setSelectedTCId] = useState<number | null>(null); // New state for selected ID

  // --- 1. Fetch TipoComponentes (should happen only once in production) ---
  // This function fetches the data and is made stable with useCallback.
  const fetchTipoComponentesData = useCallback(async () => {
    setIsLoadingTC(true);
    try {
      const tcService = new TipoComponenteService();
      const { data } = await tcService.findAll({});
      setTipoComponentes(data.data.data);
    } catch (error) {
      console.error("Error fetching TipoComponentes:", error);
      // Handle error appropriately
    } finally {
      setIsLoadingTC(false);
    }
  }, []); // <-- Empty dependency array: this function is created only once.

  // --- 2. Trigger fetch on mount ---
  // This useEffect will call fetchTipoComponentesData when the component mounts.
  // In Strict Mode, this will still run twice, but fetchTipoComponentesData is idempotent.
  useEffect(() => {
    fetchTipoComponentesData();
  }, [fetchTipoComponentesData]); // `fetchTipoComponentesData` is stable due to its useCallback.

  // --- 3. Set initial selected value and notify parent *after* data and ID are available ---
  // This is the crucial part for initial selection.
  // It runs when 'tipoComponentes' are loaded OR when 'componenteRed.refComponentTypeId' changes.
  useEffect(() => {
    if (
      tipoComponentes.length > 0 && // Check if data is loaded
      componenteRed?.refComponentTypeId !== undefined && // Check if ID is provided
      componenteRed?.refComponentTypeId !== null
    ) {
      const initialSelected = tipoComponentes.find(
        (tc) => tc.id === componenteRed.refComponentTypeId,
      );
      if (initialSelected) {
        setSelectedTCId(initialSelected.id); // Update internal state
        // Only call onChange if the selected value is different from what's currently in the parent
        // (This might require an additional prop from the parent to compare against,
        // or a ref to track if initial selection has occurred).
        // For simplicity, we'll call it for now.
        onChange(initialSelected); // Notify the parent
      }
    } else if (
      tipoComponentes.length > 0 && // If data is loaded
      (componenteRed?.refComponentTypeId === null || // But no initial ID is provided
        componenteRed?.refComponentTypeId === undefined)
    ) {
      setSelectedTCId(null); // Clear internal selection if no ID is present
    }
  }, [tipoComponentes, componenteRed?.refComponentTypeId, onChange]); // Dependencies for this effect

  // --- 4. Handle user selection and notify parent ---
  // This function handles changes from user interaction with the <Select> component.
  const handleSelectChange = useCallback(
    (value: string) => {
      const selected = tipoComponentes.find((tc) => tc.id === +value);
      if (selected) {
        setSelectedTCId(selected.id); // Update internal state
        onChange(selected); // Notify parent
      }
    },
    [tipoComponentes, onChange],
  ); // Depend on 'tipoComponentes' (already fetched) and 'onChange' (from parent).

  return (
    <Select
      disabled={isLoadingTC}
      name={name}
      label="Tipo de componente"
      onChangeValue={handleSelectChange} // Use the new handler for user changes
      options={tipoComponentes
        .filter((tc) => tc.status === 1)
        .map((tc) => ({
          text: tc.label,
          value: tc.id.toString(),
        }))}
      helperText={isLoadingTC ? "cargando tipo de componentes..." : undefined}
      fullWidth
      value={selectedTCId?.toString() || ""} // Controlled component: display internal state
    />
  );
}