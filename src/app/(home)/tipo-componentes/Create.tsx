"use client";
import { CreateTipoComponenteDto } from "@/core/tipo-componente/dto/create.dto";
import {
  ButtonPrimary,
  ButtonSecondary,
  Form,
  Switch,
  TextField,
  Select,
  useDialog
} from "@telefonica/mistica";
import { useCallback, useEffect, useMemo, useState } from "react";
import useTipoComponente from "./useTipoComponente";
import { CreateRefComponentTypeRequestDto, TCStatusEnumOptions, TCTypeEnumOptions, TipoComponenteRed, TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import Table, { TableColumn } from "@/components/Table/Table";
import useStorage from "@/hooks/useStorage";
import useRed from "../redes/useRed";
import usePagination from "@/hooks/usePagination";
import Header from "../Header";
import ParentAssociationWizardModal from "./ParentAssociationWizardModal";
import IconButton from "@/components/IconButton";
import SelectedRedModal from "./SelectedRedModal";
import ConfigurationsModal from "./ConfigurationsModal";
import AsideTypeComponent from "@/components/AsideTypeComponent";

type FormItem = keyof Pick<
  CreateRefComponentTypeRequestDto,
  "label" | "name" | "tipo" | "status"
>;

export default function Create({
  onSuccess,
  onClose,
  tipoComponente
}: {
  onSuccess: () => void;
  onClose: () => void;
  tipoComponente?: TipoComponenteType;
}) {
  const { createTipoComponente, getTipoComponentes, tipoComponentes, allTipoComponentes, allTipoComponente, updateTipoComponente } = useTipoComponente();
  const [creating, setCreating] = useState(false);
  const [openTcAssociate, setOpenTcAssociate] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [editConfigurationsSelected, setEditConfigurationSelected] = useState<{type: 'attributes' | 'services', row: any} | null>(null);
  const { page, limit } = usePagination();
  const [search, setSearch] = useState<string | null>();
  const [selectedTechs, setSelectedTechs] = useState<{ [key: string]: { key: string; label: string } | undefined }>({});
  const [openParentModal, setOpenParentModal] = useState(false);
  const [parentAssociations, setParentAssociations] = useState<any[]>([]);
  const [childName, setChildName] = useState('');
  const [label, setLabel] = useState('');
  const [tipo, setTipo] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [searchParent, setSearchParent] = useState<string>();
  const { confirm } = useDialog();

useEffect(() => {
  if (tipoComponente) {
      allTipoComponentes({
     idList:[tipoComponente.id],
    })
  }
}, []);


useEffect(() => {
  if(allTipoComponente.length > 0) {
  setChildName(allTipoComponente[0]?.name || '');
  setLabel(allTipoComponente[0]?.label || '');
  setTipo(allTipoComponente[0]?.tipo || '');
  setStatus(TCStatusEnumOptions.find( (value) => value.value == allTipoComponente[0]?.status )?.label || '');
  let ConfigsData:any[] = []
  allTipoComponente[0].configData.map((configData) => {
      ConfigsData.push({
          id: redes.find(t => t.id == configData?.networkId)?.id,
          red: redes.find(t => t.id == configData?.networkId)?.label,
          configAttributes: configData.configAttributes,
          configServices: configData.configServices,
      })
  })
  setData(ConfigsData)

  const formattedTechs = allTipoComponente[0].configData.reduce(
  (acc: { [key: string]: { key: string; label: string } | undefined }, item) => {
    acc[item.networkId] = { key: item.networkId.toString(), label: redes.find(t => t.id == item?.networkId)!.label };
    return acc;
  },
  {}
);

setSelectedTechs(formattedTechs);

  let ConfigsRelation:any[] = []
    allTipoComponente[0].configRelation.map((configData) => {
      ConfigsRelation.push({
    parentId: configData.componentTypeFatherId,
    parentRedId: configData.networkFatherId,
    childRedId: configData.networkId,
    childType: allTipoComponente[0].name
  })
  })
  setParentAssociations(ConfigsRelation)
  }

}, [allTipoComponente]);

  useEffect(() => {
  if (parentAssociations.length > 0) {
    setParentAssociations(prev =>
      prev.map(assoc => ({
        ...assoc,
        childType: childName
      }))
    );
  }
}, [childName]);

useEffect(() => {
  setChecked(parentAssociations.length > 0);
}, [parentAssociations]);


  const {
    redes,
    getRedes
  } = useRed();

    const onLoadRedes = useCallback(() => {
    getRedes({ search, page, limit:1000 });
  }, [search, page, limit, getRedes]);

    useEffect(() => {
    onLoadRedes();
  }, [onLoadRedes]);

      const onLoadTypeComponent = useCallback(() => {
    getTipoComponentes({ search, page, limit:1000 });
  }, [search, page, limit, getTipoComponentes]);

    useEffect(() => {
    onLoadTypeComponent();
  }, [onLoadTypeComponent]);
  
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
    title: 'Red',
    hidden: !showColumn.red,
    render: (row: any) => (
      <span>
        {row.red}
      </span>
    ),
  },
  {
    title: 'Configuracion de atributos',
    hidden: !showColumn.configAttributes,
    render: (row: any) => (
      <ButtonSecondary onPress={() => setEditConfigurationSelected({type: 'attributes', row})}>
        Editar
      </ButtonSecondary>
    ),
  },
  {
    title: 'Configuracion de servicios',
    hidden: !showColumn.configServices,
    render: (row: any) => (
      <ButtonSecondary onPress={() => setEditConfigurationSelected({type: 'services', row})}>
        Editar
      </ButtonSecondary>
    ),
  },
], [showColumn]);

const parentColumns = useCallback((render:any) => 
  [
  {
    title: 'Tipo de componente padre',
    key: 'parentType',
    render: (row: any) => {
        const parent = tipoComponentes.find(tc => tc.id === Number(row.parentId));
        return parent ? parent.label : '';
      },
  },
  {
    title: 'Red padre',
    key: 'parentRed',
    render: (row: any) => {
 
   const parentRedId = redes.find(tc => tc.id === Number(row.parentRedId));
          return parentRedId ? parentRedId.name : '';
    },
  },
  {
    title: 'Tipo de componente hijo',
    key: 'childType',
    render: (row: any) => row.childType,
  },
  {
    title: 'Red hijo',
    key: 'childRed',
    render: (row: any) => {
          const childRedId = data.find(tc => tc.id === Number(row.childRedId));
          return childRedId ? childRedId.red : '';
        }
  },
 {
  maxWidth: "64px",
  render: render,
  },
], [tipoComponentes, data]) 


const onCreate = useCallback(
  async ({
    label,
    name,
    tipo
  }: Pick<CreateRefComponentTypeRequestDto, "label" | "name" | "tipo">) => {
    setCreating(true);
    const dto: CreateTipoComponenteDto = {
      createRefComponentTypeRequestDto: {
        label,
        name,
        status: 3,
        commentApproval: "",
        tipo,
        flagAlone: checked,
      },
      createConfigDataRequestDto: data.map(row => ({
        componentTypeId: 0, 
        networkId: row.id,
        status: 0,
        configAttributes: row.configAttributes ?? [],
        configServices: row.configServices ?? [],
      })),
      createConfigRelationRequestDto: parentAssociations.map(assoc => ({
        componentTypeId: 0, 
        componentTypeFatherId: assoc.parentId,
        networkId: assoc.childRedId,
        networkFatherId: assoc.parentRedId,
        status: 0,
      })),
    };
    
    await createTipoComponente(dto);
    setCreating(false);
    onSuccess()
    onClose();
  },
  [
    onClose,
    createTipoComponente,
    checked,
    data,
    parentAssociations,
  ],
);

const onUpdate = useCallback(
     async ({
    label,
    name,
    tipo,
    status
  }: Pick<CreateRefComponentTypeRequestDto, "label" | "name" | "tipo" | "status" >) => {
      setCreating(true);

    const dto: CreateTipoComponenteDto = {
      createRefComponentTypeRequestDto: {
        label,
        name,
        status: 3,
        commentApproval: "",
        tipo,
        flagAlone: checked,
      },
      createConfigDataRequestDto: data.map(row => ({
        componentTypeId: tipoComponente!.id, 
        networkId: row.id,
        status: row.status,
        configAttributes: row.configAttributes ?? [],
        configServices: row.configServices ?? [],
      })),
      createConfigRelationRequestDto: parentAssociations.map(assoc => ({
        componentTypeId: tipoComponente!.id, 
        componentTypeFatherId: assoc.parentId,
        networkId: assoc.childRedId,
        networkFatherId: assoc.parentRedId,
        status: 0,
      })),
    };
      await updateTipoComponente(tipoComponente!.id, dto);
      setCreating(false);
      onSuccess()
      onClose();
    },
    [
      data,
      parentAssociations,
      status,
      tipoComponente,
      onClose,
      updateTipoComponente,
      onSuccess
    ],
  );

const handleSaveTechs = (selected: any[]) => {
  const selectedIds = selected.map(key => key.key);

  const existingRows = data.filter(row => selectedIds.includes(row.id));
  const newRows = selected
    .filter(key => !data.some(row => row.id === key.key))
    .map(key => ({
      id: redes.find(t => t.id == key.key)?.id,
      red: redes.find(t => t.id == key.key)?.label,
      configAttributes: [],
      configServices: [],
    }));

  setData([...existingRows, ...newRows]);
};

const handleSaveConfig = (key: string, type: 'attributes' | 'services', value: any) => {
  setData(prev =>
    prev.map(row =>
      row.id === key
        ? {
            ...row,
            configAttributes: type === 'attributes' ? value : row.configAttributes,
            configServices: type === 'services' ? value : row.configServices,
          }
        : row
    )
  );
};


const deleteParentAssociation = (row:any) => {
    confirm({
        title: `Eliminar`,
        message: "¿Estás seguro de eliminar esta relación?",
        destructive: true,
        onAccept: async () => {
          setParentAssociations((prev) =>
                        prev.filter(
                          (assoc) =>
                            !(
                              assoc.parentRedId === row.parentRedId &&
                              assoc.childRedId === row.childRedId
                            )
                        )
                      );
              },
      });
}

  return (
    <AsideTypeComponent
      className="grid grid-rows-[auto_1fr_auto] overflow-auto w-[100%]"
      onClose={onClose}
      zIndex={0}
    >
        <Header></Header>
      
      <Form
        onSubmit={(value) =>
          tipoComponente
            ? onUpdate(value as CreateRefComponentTypeRequestDto)
            : onCreate(value as CreateRefComponentTypeRequestDto)
        }
        className="grid px-6 content-start"
          initialValues={{
        tipo: "",
        status: "",
      }}
      >
        <div className="py-6 flex flex-col gap-2"> 
        <h4 className="text-[28px]">{tipoComponente ? "Editar" : "Crear"} tipo de componente</h4>
        <p>
          Ingrese todo los datos correspondiente para crear con éxito un
          mantenedor de tipo de componente
        </p>
      </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
           <TextField
            name={"name" as FormItem}
            value={childName}
            label="Nombre"
            fullWidth
            maxLength={255}
            onChange={e => setChildName(e.target.value)}
          />

          <TextField
            name={"label" as FormItem}
            value={label}
            label="Etiqueta"
            fullWidth
            maxLength={255}
            onChange={e => setLabel(e.target.value)}
          />
         
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
                 <Select
                  name={"tipo" as FormItem}
                  value={tipo}
                  label="Caracteristicas de tipo de componente"
                  options={TCTypeEnumOptions.map((option) => ({
                    text: option.label,
                    value: option.label.toString(),
                  }))}
                       onChangeValue={e => setTipo(e)}
                  fullWidth
                />
                {
                  tipoComponente && (
                     <Select
                      name={"status" as FormItem}
                      label="Estado"
                      options={TCStatusEnumOptions.map((option) => ({
                        text: option.label,
                        value: option.label.toString(),
                      }))}
                      value={status}
                       onChangeValue={e => setStatus(e)}
                      fullWidth
                      disabled
                    />
                  )
                }
                 
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div></div>
        <ButtonSecondary onPress={( ) => setOpenTcAssociate(true)}>
           Asociar tipo de componente a una red
          </ButtonSecondary>
        </div>

            {data.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Switch
            checked={checked}
             onChange={(value: boolean, _) => {
                setOpenParentModal(true);
              }}
          >
              Posee tipo componente padre?
            </Switch>
          </div>
        )}
        {
          data.length > 0 && (
            <>
                <h5 className="text-[28px]">Redes asociadas al tipo de componente</h5>
                <Table
                columns={columns}
                rows={data ?? []}
                />
            </>
          )
        }

        {parentAssociations?.length > 0 && (
          <>
              <div className="flex items-center justify-between mb-2">
              <h4 className="text-[28px]">Tipo de componente padre</h4>
              <ButtonPrimary
                size="small"
                onPress={() => setOpenParentModal(true)}
              >
                Agregar asociación
              </ButtonPrimary>
            </div>
            <Table
              columns={parentColumns((row: any) => (
            <IconButton icon="delete" onClick={() => {
                deleteParentAssociation(row);
              }}/>
          ))}
              rows={parentAssociations}
            />
          </>
        )}
       
        
        <br />
          <footer className="flex justify-end gap-2 p-4 border-t-[1px] border-[#eee]">
           <ButtonSecondary size="small" onPress={onClose}>
          Cancelar
        </ButtonSecondary>
         <ButtonPrimary size="small" submit showSpinner={creating}>
          { allTipoComponente[0] ? 'Actualizar' : 'Guardar'}
        </ButtonPrimary>
      </footer>
      </Form>

      {openTcAssociate && (
            <SelectedRedModal
            redes={redes}
            onClose={() => setOpenTcAssociate(false)}
            selectedTechs={selectedTechs}
            setSelectedTechs={setSelectedTechs}
            onSave={handleSaveTechs}
               />
                  )}

      {editConfigurationsSelected && (
        <ConfigurationsModal
          type={editConfigurationsSelected.type}
          row={editConfigurationsSelected.row}
          onClose={() => setEditConfigurationSelected(null)}
           onSave={handleSaveConfig}
        />
      )}

      {openParentModal && data && (
      <ParentAssociationWizardModal
        setSearchParent={setSearchParent}
        searchParent={searchParent}
        onClose={() => {
          setOpenParentModal(false)
          setSearchParent('');
        }}
        childName={childName}
        redesPadre={redes}
        redesHijo={data}
        onSave={(association) => {
          setParentAssociations(prev => [...prev, association]);
        }}
        tipoComponenteId={tipoComponente?.id || 0}
        parentAssociations={parentAssociations}
      />
    )}
    </AsideTypeComponent>
  );
}
