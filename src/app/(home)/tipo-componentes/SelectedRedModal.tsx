import { ButtonPrimary, ButtonSecondary, TextField } from "@telefonica/mistica";
import { Checkbox } from '@telefonica/mistica';
import { useEffect, useState } from "react";
import { RedType } from '../../../core/red/red.type';


function SelectedRedModal({ onClose, selectedTechs, setSelectedTechs, onSave, redes }: {
  onClose: () => void;
  selectedTechs: { [key: string]: { key: string; label: string } | undefined };
  setSelectedTechs: React.Dispatch<React.SetStateAction<{ [key: string]: { key: string; label: string } | undefined }>>;
  onSave: (selected: { key: string; label: string }[]) => void;
  redes: RedType[]
}) {
  const [tempSelectedTechs, setTempSelectedTechs] = useState(selectedTechs);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTempSelectedTechs(selectedTechs);
  }, [selectedTechs]);

  const filteredTechs = redes.filter(tech =>
    tech.label.toLowerCase().includes(search)
  );

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
          name='search'
          label="Buscar red"
          value={search}
          onChange={(e)=> setSearch(e.target.value.toLocaleLowerCase())}
          fullWidth
        />
        <div className="flex-1 overflow-auto border rounded-md p-2" style={{maxHeight: 300}}>
          {filteredTechs.length === 0 && (
            <div className="text-gray-400 text-center py-4">No hay resultados</div>
          )}
          {filteredTechs.map((tech) => (
            <div key={tech.id} className="flex items-center border-b last:border-b-0 px-2 py-1 hover:bg-gray-50">
              <Checkbox
                checked={!!tempSelectedTechs[tech.id]}
                onChange={(value, _) =>
                  setTempSelectedTechs((prev) => ({
                    ...prev,
                    [tech.id]: value ? { key: tech.id, label: tech.label } : undefined,
                  }))
                }
                >
                  {tech.label}
              </Checkbox>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary
            onPress={onClose}
          >
            Cancelar
          </ButtonSecondary>
          <ButtonPrimary
            onPress={() => {
              setSelectedTechs(tempSelectedTechs); // Solo aquí se actualiza el global
              const selected = Object.values(tempSelectedTechs).filter(Boolean) as { key: string; label: string }[];
              onSave(selected);
              onClose();
            }}
          >
            Asociar
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

export default SelectedRedModal;