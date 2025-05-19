import Aside from "@/components/Aside";
import InputJson from "@/components/InputJson";
import { CreateTipoComponenteDto } from "@/core/tipo-componente/dto/create.dto";
import {
  ButtonPrimary,
  ButtonSecondary,
  Form,
  TextField,
} from "@telefonica/mistica";
import { useCallback, useMemo, useState } from "react";
import useTipoComponente from "./useTipoComponente";
import Select from "@/components/Select";
import { TCStatusEnumOptions, TCTypeEnumOptions, TipoComponenteRed, TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Checkbox } from '@telefonica/mistica';
import Table, { TableColumn } from "@/components/Table/Table";
import useStorage from "@/hooks/useStorage";

type FormItem = keyof CreateTipoComponenteDto;

const TECHNOLOGIES = [
  { key: 'umts', label: 'UMTS' },
  { key: 'lte', label: 'LTE' },
  { key: 'gsm', label: 'GSM' },
];

const PARENT_COMPONENTS = [
  { key: 'router', label: 'Router' },
  { key: 'switch', label: 'Switch' },
  { key: 'firewall', label: 'Firewall' },
];

export default function Create({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const { createTipoComponente } = useTipoComponente();
  const [creating, setCreating] = useState(false);
  const [openTcAssociate, setOpenTcAssociate] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [editModal, setEditModal] = useState<{type: 'attributes' | 'services', row: any} | null>(null);
  
  const [showColumn, setShowColumn, isLoadingShowColumn] = useStorage(
    'filter-type-component',
    {
        red: true,
        configAttributes: true,
        configServices: true,
    }
  );

   
const columns = useMemo<TableColumn<TipoComponenteRed>[]>(() => [
  {
    title: 'red',
    key: 'red',
    hidden: !showColumn.red,
  },
  {
    title: 'configAttributes',
    hidden: !showColumn.configAttributes,
    render: (row: any) => (
      <ButtonSecondary onPress={() => setEditModal({type: 'attributes', row})}>
        Editar
      </ButtonSecondary>
    ),
  },
  {
    title: 'configServices',
    hidden: !showColumn.configServices,
    render: (row: any) => (
      <ButtonSecondary onPress={() => setEditModal({type: 'services', row})}>
        Editar
      </ButtonSecondary>
    ),
  },
], [showColumn]);

    const [selectedTechs, setSelectedTechs] = useState<{ [key: string]: boolean }>({
    umts: false,
    lte: false,
    gsm: false,
  });

    const [openParentModal, setOpenParentModal] = useState(false);

    const [selectedParents, setSelectedParents] = useState<{ [key: string]: boolean }>({
      router: false,
      switch: false,
      firewall: false,
    });

  const [configAttributes, setConfigAttributes] = useState<
    CreateTipoComponenteDto["configAttributes"]
  >([]);

  const [configServices, setConfigServices] = useState<
    CreateTipoComponenteDto["configServices"]
  >([]);

  const onCreate = useCallback(
    async ({
      label,
      name,
    }: Pick<CreateTipoComponenteDto, "label" | "name">) => {
      setCreating(true);
      await createTipoComponente({
        label,
        name,
        status: 0,
        configAttributes,
        configServices,
        commentApproval: "",
      });
      setCreating(false);
      onSuccess();
      onClose();
    },
    [
      onSuccess,
      onClose,
      createTipoComponente,
      configAttributes,
      configServices,
    ],
  );

   function ParentModal({
    onClose,
    selectedParents,
    setSelectedParents,
  }: {
    onClose: () => void;
    selectedParents: { [key: string]: boolean };
    setSelectedParents: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  }) {

     const [search, setSearch] = useState('');
  const filteredParents = PARENT_COMPONENTS.filter(parent =>
    parent.label.toLowerCase().includes(search)
  );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[400px] min-h-[220px] flex flex-col gap-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
            ¿Cuál es su componente padre?
          </h3>
           <TextField
            name='search'
            label="Buscar componente padre"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
            fullWidth
          />
             <div className="flex-1 overflow-auto border rounded-md p-2" style={{maxHeight: 200}}>
          {filteredParents.length === 0 && (
            <div className="text-gray-400 text-center py-4">No hay resultados</div>
          )}
          {filteredParents.map((parent) => (
            <div key={parent.key} className="flex items-center border-b last:border-b-0 px-2 py-1 hover:bg-gray-50">
              <Checkbox
                checked={selectedParents[parent.key]}
                onChange={(value, _) =>
                  setSelectedParents((prev) => ({
                    ...prev,
                    [parent.key]: value,
                  }))
                }
                >
                  {parent.label}    
              </Checkbox>
            </div>
          ))}
        </div> 
       
          <div className="flex justify-end gap-2 mt-4">
            <ButtonSecondary onPress={onClose}>Cancelar</ButtonSecondary>
            <ButtonPrimary onPress={onClose}>Guardar selección</ButtonPrimary>
          </div>
        </div>
      </div>
    );
  }

function BlankModal({ onClose, selectedTechs, setSelectedTechs, onSave }: {
  onClose: () => void;
  selectedTechs: { [key: string]: boolean };
  setSelectedTechs: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  onSave: (selected: string[]) => void;
}) {
  const [search, setSearch] = useState('');
  // Filtra las tecnologías por el texto de búsqueda
  const filteredTechs = TECHNOLOGIES.filter(tech =>
    tech.label.toLowerCase().includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[400px] min-h-[260px] flex flex-col gap-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Selecciona redes
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
            <div key={tech.key} className="flex items-center border-b last:border-b-0 px-2 py-1 hover:bg-gray-50">
              <Checkbox
                checked={selectedTechs[tech.key]}
                onChange={(value, _) =>
                  setSelectedTechs((prev) => ({
                    ...prev,
                    [tech.key]: value,
                  }))
                }
                >
                  {tech.label}
              </Checkbox>
            </div>
          ))}
        </div>
     
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={onClose}>Cancelar</ButtonSecondary>
            <ButtonPrimary
              onPress={() => {
                const selected = Object.keys(selectedTechs).filter(k => selectedTechs[k]);
                onSave(selected);
                onClose();
              }}
            >
              Guardar selección
            </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}

const handleSaveTechs = (selected: string[]) => {
  const newRows = selected.map(key => ({
    red: TECHNOLOGIES.find(t => t.key === key)?.label || key,
    configAttributes: [],
    configServices: undefined,
    key,
  }));
  setData(newRows);
};

const handleSaveConfig = (key: string, type: 'attributes' | 'services', value: any) => {
  setData(prev =>
    prev.map(row =>
      row.key === key
        ? {
            ...row,
            configAttributes: type === 'attributes' ? value : row.configAttributes,
            configServices: type === 'services' ? value : row.configServices,
          }
        : row
    )
  );
};

function EditModal({
  type,
  row,
  onClose,
  onSave,
}: {
  type: 'attributes' | 'services';
  row: any;
  onClose: () => void;
  onSave: (key: string, type: 'attributes' | 'services', value: any) => void;
}) {

    const [tempValue, setTempValue] = useState<any>(
    type === 'attributes'
      ? row.configAttributes ?? []
      : row.configServices ?? []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[600px] min-h-[220px] flex flex-col gap-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-[#0057b8] mb-2 text-center">
          Editar {type === 'attributes' ? 'Atributos' : 'Servicios'} para {row.red}
        </h3>
        <div>
          {type === 'attributes' ? (
            <InputJson
              codeDefault={JSON.stringify(row.configAttributes ?? [])}
              label="Configuracion de Atributos"
            onChange={setTempValue}
            />
          ) : (
            <InputJson
              codeDefault={JSON.stringify(row.configServices ?? [])}
            onChange={setTempValue}
            />
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <ButtonSecondary onPress={() => {
            if(type === 'attributes'){
                  onSave(row.key, 'attributes', tempValue)
            }else{
                  onSave(row.key, 'services', tempValue)
            }
          }
          }>Guardar</ButtonSecondary>
          <ButtonSecondary onPress={onClose}>Cerrar</ButtonSecondary>
        </div>
      </div>
    </div>
  );
}
ParentModal
  return (
    <Aside
      className="grid grid-rows-[auto_1fr_auto] overflow-auto w-[100%]"
      onClose={onClose}
    >
      <header className="p-6 grid">
        <h4 className="text-[28px]">Crear tipo de componente</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de tipo de componente
        </p>
      </header>
      <Form
        onSubmit={(value) => onCreate(value as CreateTipoComponenteDto)}
        className="grid px-6 content-start"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
           <TextField
            name={"name" as FormItem}
            label="Nombre"
            fullWidth
            maxLength={255}
          />

          <TextField
            name={"label" as FormItem}
            label="Etiqueta"
            fullWidth
            maxLength={255}
          />
         
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
                 <Select
                  name={"statusTypeComponent" as FormItem}
                  label="Tipo de tipo de componente"
                  options={TCTypeEnumOptions.map((option) => ({
                    text: option.label,
                    value: option.value.toString(),
                  }))}
                  fullWidth
                />

                     <Select
                  name={"status" as FormItem}
                  label="Estado"
                  options={TCStatusEnumOptions.map((option) => ({
                    text: option.label,
                    value: option.value.toString(),
                  }))}
                  fullWidth
                />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div></div>
        <ButtonSecondary onPress={( ) => setOpenTcAssociate(true)}>
           Asociar tc a la red
          </ButtonSecondary>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Checkbox
            checked={checked}
             onChange={( value:boolean, _) => {
                if (value) {
                  setOpenParentModal(true);
                }
                setChecked(value);
              }}
            >
            Posee componente padre?
           </Checkbox>
        </div>
        
        <Table
            columns={columns}
            rows={data ?? []}
        />
        
        <br />
        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee]">
          <ButtonPrimary submit showSpinner={creating}>
            Guardar
          </ButtonPrimary>
          <ButtonSecondary onPress={onClose}>Cerrar</ButtonSecondary>
        </footer>
      </Form>

      {openTcAssociate && (
            <BlankModal
            onClose={() => setOpenTcAssociate(false)}
            selectedTechs={selectedTechs}
            setSelectedTechs={setSelectedTechs}
            onSave={handleSaveTechs}
               />
                  )}

      {openParentModal && (
        <ParentModal
          onClose={() => setOpenParentModal(false)}
          selectedParents={selectedParents}
          setSelectedParents={setSelectedParents}
        />
      )}

      {editModal && (
        <EditModal
          type={editModal.type}
          row={editModal.row}
          onClose={() => setEditModal(null)}
           onSave={handleSaveConfig}
        />
      )}
      
    </Aside>
  );
}
