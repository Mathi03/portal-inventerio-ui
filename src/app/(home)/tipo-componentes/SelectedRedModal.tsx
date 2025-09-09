import { RedType } from "@/core/red/red.type";
import {
  ButtonPrimary,
  ButtonSecondary,
  Spinner,
  TextField,
  Checkbox,
} from "@telefonica/mistica";
import { useEffect, useState } from "react";

function SelectedRedModal({
  onClose,
  selectedTechs,
  setSelectedTechs,
  onSave,
  redes,
  loadingRedes,
}: {
  onClose: () => void;
  selectedTechs: { [key: string]: { key: string; label: string } | undefined };
  setSelectedTechs: React.Dispatch<
    React.SetStateAction<{
      [key: string]: { key: string; label: string } | undefined;
    }>
  >;
  onSave: (selected: { key: string; label: string }[]) => void;
  redes: RedType[];
  loadingRedes: boolean;
}) {
  const [tempSelectedTechs, setTempSelectedTechs] = useState(selectedTechs);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTempSelectedTechs(selectedTechs);
  }, [selectedTechs]);

  const filteredTechs = redes.filter((tech) =>
    tech.label.toLowerCase().includes(search)
  );

  const handleCheckboxChange = (
    techId: string,
    techLabel: string,
    checked: boolean
  ) => {
    setTempSelectedTechs((prev) => ({
      ...prev,
      [techId]: checked ? { key: techId, label: techLabel } : undefined,
    }));
  };

  const renderContent = () => {
    if (loadingRedes) {
      return (
        <section
          className="flex justify-center items-center w-full h-full rounded-[16px] overflow-auto min-h-[100px]"
          style={{ gridRow: "2/3" }}
        >
          <Spinner size={56} />
        </section>
      );
    }

    if (filteredTechs.length === 0) {
      return (
        <div className="text-gray-400 text-center py-4">No hay resultados</div>
      );
    }

    return filteredTechs.map((tech) => {
      const isChecked = !!tempSelectedTechs[tech.id];
      return (
        <div
          key={tech.id}
          className="flex items-center border-b last:border-b-0 px-2 py-1 hover:bg-gray-50"
        >
          <Checkbox
            name={`tech-${tech.id}`}
            checked={isChecked}
            onChange={(checked) =>
              handleCheckboxChange(tech?.id?.toString(), tech.label, checked)
            }
          >
            {tech.label}
          </Checkbox>
        </div>
      );
    });
  };

  const handleSave = () => {
    setSelectedTechs(tempSelectedTechs);
    const selected = Object.values(tempSelectedTechs).filter(Boolean) as {
      key: string;
      label: string;
    }[];
    onSave(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[400px] w-[800px] min-h-[260px] flex flex-col gap-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Selecciona una red
        </h3>

        <TextField
          name="search"
          label="Buscar red"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
          fullWidth
        />

        <div
          className="flex-1 overflow-auto border rounded-md p-2"
          style={{ maxHeight: 300 }}
        >
          {renderContent()}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={onClose}>Cancelar</ButtonSecondary>
          <ButtonPrimary onPress={handleSave}>Asociar</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

export default SelectedRedModal;
