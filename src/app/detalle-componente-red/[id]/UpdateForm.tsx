import Select from "@/components/Select";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField, useSnackbar } from "@telefonica/mistica";
import { useCallback, useState, useEffect } from "react";
import Button from "@/components/Button";
import { RedType } from "@/core/red/red.type";
import { CreateComponenteRedDto } from "@/core/componente-red/dto/create.dto";
import {
  ComponenteRedType,
  CRStatusEnumOptions,
} from "@/core/componente-red/componente-red.type";
import RelacionJerarquica from "../Relatcion-jerarquica";
import SelectFuentes from "./SelectFuentes";
import SelectRedes from "./SelectRedes";
import SelectTipoComponentes from "./SelectTipoComponentes";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import ConfigAdicional from "./ConfigAdicional";
import SelectRegiones from "./SelectRegiones";
import { RelacionJerarquicaService } from "@/core/relacion-jerarquica/relacion-jerarquica.service";
type FormItem = keyof CreateComponenteRedDto;
export default function UpdateForm({
  componenteRed,
}: {
  componenteRed: ComponenteRedType;
}) {
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>();
  //const [red, setRed] = useState<RedType | null>();
  const [red, setRed] = useState<RedType | null>(null); // Initialize with null
 

/*  const [attribute, setAttribute] = useState<AttributesState>(() => {
    let parsedData: any = {};
    if (componenteRed?.attribute) {
        try {
            const tempParsed = JSON.parse(componenteRed.attribute);
            console.log("JSON parseado de componenteRed.attribute:", tempParsed); // <-- ¡Importante!
            if (Array.isArray(tempParsed) && tempParsed.length > 0) {
                parsedData = Object.assign({}, ...tempParsed);
                console.log("Datos fusionados (si era array):", parsedData); // <-- ¡Importante!
            } else if (typeof tempParsed === 'object' && tempParsed !== null) {
                parsedData = tempParsed;
                console.log("Datos usados (si era objeto plano):", parsedData); // <-- ¡Importante!
            }
        } catch (e) {
            console.error("Error al parsear componenteRed.attribute:", e);
        }
    }
    console.log("Estado 'attribute' inicial:", parsedData); // <-- ¡Importante!
    return parsedData;
});*/

interface __UniqueConfigDataAttribute__ {
  name: string;
  type: string; // e.g., 'text', 'number', 'boolean', 'object' (for nested parents)
  label: string;
  default?: boolean;
  required?: boolean;
  html_form_type?: "input" | "select" | "date" | "textarea" | "checkbox";
  
  valores_posibles?: Array<{
      name: string;
      value: string;
  }>;
  valores_posibles_source?: string;
  valores_posibles_response?: [string, string];

  onChange?: (name: string, value: any) => void;
  value?: string | number | boolean | null;

  // --- ¡NUEVA PROPIEDAD EXPLÍCITA PARA SUB-ATRIBUTOS! ---
  // Esta propiedad ahora alberga el array de configuraciones de sub-atributos.
  // Solo estará presente si 'type' es 'object' (o similar, indicando un padre).
  subAttributes?: __UniqueConfigDataAttribute__[]; 
}
interface ConfigData {
  configAttributes: __UniqueConfigDataAttribute__[];
}

interface NestedAttributes {
  [key: string]: string;
}

interface AttributesState {
  [key: string]: string | NestedAttributes;
}

interface NestedServices {
  [key: string]: string;
}

interface ServicesState {
  [key: string]: string | NestedServices;
} 

const [attribute, setAttribute] = useState<AttributesState>(() => {
  let parsedApiData: any = {};
  if (componenteRed?.attribute) {
      try {
          const tempParsed = JSON.parse(componenteRed.attribute);
          if (Array.isArray(tempParsed) && tempParsed.length > 0) {
              parsedApiData = Object.assign({}, ...tempParsed);
          } else if (typeof tempParsed === 'object' && tempParsed !== null) {
              parsedApiData = tempParsed;
          }
      } catch (e) {
          console.error("Error al parsear componenteRed.attribute en inicialización:", e);
      }
  }
  // Inicializa con los datos base. La reestructuración completa ocurrirá en el useEffect.
  return parsedApiData;
});

const [service, setService] = useState<ServicesState>(() => {
  let parsedApiData2: any = {};
  console.log('componenteRed en inicialización:', componenteRed); // <-- Añade esto
  console.log('componenteRed.service en inicialización:', componenteRed?.service); // <-- Y esto

  if (componenteRed?.service && componenteRed.service !== '') {
    try {
      const tempParsed = JSON.parse(componenteRed.service);
      console.log('tempParsed después de JSON.parse:', tempParsed); // <-- Y esto para ver el resultado del parseo

      if (Array.isArray(tempParsed) && tempParsed.length > 0) {
        console.log('tempParsed es un array:', tempParsed); // Si habilitas la línea comentada
         parsedApiData2 = Object.assign({}, ...tempParsed);
      } else if (typeof tempParsed === 'object' && tempParsed !== null) {
        console.log('tempParsed es un objeto:', tempParsed); // <-- Si entra aquí
        parsedApiData2 = tempParsed;
      }
    } catch (e) {
      console.error("Error al parsear componenteRed.attribute en inicialización:", e);
      // Puedes loguear el valor problemático aquí también
      console.error("Valor problemático de componenteRed.service:", componenteRed.service);
    }
  }
  console.log('Valor final de parsedApiData2:', parsedApiData2); // <-- Y esto para ver el valor inicial del estado

  return parsedApiData2;
});




  /* Guillermo .....const [service, setService] = useState<any>(
     JSON.parse(componenteRed.service?.attribute as string),
   );*/

  const [componenteSeleted, setComponenteSeleted] = useState<
    ComponenteRedType[]
  >([]);

  //guillermo const [attribute, setAttribute] = useState<any>({});
  //const [service, setService] = useState<any>({});

  const createRelacionJerarquicas = useCallback(async () => {
    const relacionJerarquicaService = new RelacionJerarquicaService();
    await Promise.all(
      componenteSeleted.map(async (selected) => {
        relacionJerarquicaService.create({
          controlId: componenteRed.controlId,
          superiorControlId: selected.controlId,
          refComponentTypeId: componenteRed.refComponentTypeId,
          refNetworkId: componenteRed.refNetworkId,
          status: 1,
        });
      }),
    );
  }, [componenteSeleted, componenteRed]);





  const onAttributes = useCallback((name: string, value: any, parentName: string | null = null) => {
    // ✨ SOLUCIÓN: Añadir el tipo a `prevAttributes`
    console.log("estamos aclarando los atributos....")
    setAttribute((prevAttributes: AttributesState) => {
      const newAttributes: AttributesState = { ...prevAttributes };

      if (parentName) {
        // Es un atributo anidado
        if (typeof newAttributes[parentName] === 'string') {
          console.error(`Error: Expected object for ${parentName}, but found string.`);
          return prevAttributes;
        }
        if (!newAttributes[parentName]) {
          newAttributes[parentName] = {};
        }
        (newAttributes[parentName] as NestedAttributes)[name] = value;
      } else {
        // Es un atributo regular
        newAttributes[name] = value;
      }
      console.log("estamos aclarando los services2222....", newAttributes)
      return newAttributes;
    });
  }, []);

  const onServices = useCallback((name: string, value: any, parentName: string | null = null) => {
    // ✨ SOLUCIÓN: Añadir el tipo a `prevServices`
    setService((prevServices: ServicesState) => {
      const newServices: ServicesState = { ...prevServices };

      if (parentName) {
        // Es un atributo anidado
        if (typeof newServices[parentName] === 'string') {
          console.error(`Error: Expected object for ${parentName}, but found string.`);
          return prevServices;
        }
        if (!newServices[parentName]) {
          newServices[parentName] = {};
        }
        (newServices[parentName] as NestedServices)[name] = value;
      } else {
        // Es un atributo regular
        newServices[name] = value;
      }
      return newServices;
    });
  }, []);


  const onSubmit = useCallback(
    async (form: any) => {
      const {
        label,
        name,
        stationId,
        refSourceId,
        refComponentTypeId,
        refNetworkId,
        regionId,
        observation,
        control_label,
        control_name,
        control_status,
        service_label,
        service_name,
        service_status,
      } = form;
      // setIsSubmitting(true);
      const componenteRedService = new ComponenteRedService();
      await componenteRedService.update(componenteRed.id, {
        stationId: +stationId,
        refSourceId: 1, //guillermo...+refSourceId,
        refComponentTypeId: +refComponentTypeId,
        refNetworkId: +refNetworkId,
        regionId: +regionId,
        status: 0,
        // componentId: 1,
        attribute: [attribute],
        observation,
        service: [service],
        control: {
          id: 0,
          label: label,
          name: name,
          status: 0,
        },
        code: "",
        codigo: "",
        controlId: 1,
        componentId: 1,
        serviceModified: true,
        relationModified: true,
        approvalComment: "guillermo",

      });
      createRelacionJerarquicas();
      setIsSubmitting(false);
      openSnackbar({
        message: "Componente de red actualizado exitosamente",
        type: "INFORMATIVE",
      });
    },
    [
      attribute,
      openSnackbar,
      componenteRed,
      createRelacionJerarquicas,
    ],
  );

  const handleRedChange = useCallback((selectedRed: RedType) => {
    setRed(selectedRed);
    // You might also need to update other form state here related to the red
  }, []);

  



  return (
    <section className="grid content-start overflow-auto bg-[white] w-full h-full rounded-[8px] scroller scroll-smooth">
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Detalle de componente de red</h4>
        <p>
          Actualice todo los datos correspondiente para editar con éxito un
          componente de red
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value)}
        className="grid grid-cols-3 content-start gap-4 px-6"
        initialValues={{
          /*  label: componenteRed.label,
            name: componenteRed.name,*/
          code: componenteRed.code,

          observation: componenteRed?.observation.toString,
          regionId: componenteRed?.regionId.toString(),
          stationId: componenteRed?.stationId.toString(),
          refNetworkId: componenteRed?.refNetworkId.toString(),
          refComponentTypeId: componenteRed?.refComponentTypeId.toString(),
          refSourceId: componenteRed?.refSourceId.toString(),
          status: componenteRed?.status.toString(),
          control_label: componenteRed.controlLabel,
          control_name: componenteRed.controlName,
          control_status: componenteRed.control?.status.toString(),
          /*    service_label: componenteRed.service?.label,
              service_name: componenteRed.service?.name,
              service_status: componenteRed.service?.status.toString(),
              ...JSON.parse(componenteRed?.service?.attribute as string)[0]*/
              //...(componenteRed?.attribute ? JSON.parse(componenteRed?.attribute) : {}),
              ...JSON.parse(componenteRed?.attribute)[0],
              ...JSON.parse(componenteRed?.service)[0],

        }}
      >
        <h1 className="col-span-3 text-xl" id="datos">
          Datos de componente de red
        </h1>

        <TextField
          name={"control_name" as FormItem}
          label="Nombre"
          fullWidth
          maxLength={255}
        />
        <TextField
          name={"control_label" as FormItem}
          label="Etiqueta"
          fullWidth
          maxLength={255}
        />
        <Select
          name="status"
          label="Estatus"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />

        <SelectRedes
          name={"refNetworkId"}
          componenteRed={componenteRed}
          onChange={(red) => setRed(red)}
        />

        <SelectTipoComponentes
          name={"refComponentTypeId" as FormItem}
          componenteRed={componenteRed}
          onChange={(tc) => setTipoComponente(tc)}
        />

       <SelectFuentes name={"refSourceId" as FormItem} />

        <hr className="col-span-3" />
        <SelectRegiones name={"regionId" as FormItem} />
        <Select
          name={"stationId" as FormItem}
          label="Estación"
          options={[
            {
              text: "Estación valencia",
              value: "1",
            },
          ]}
          fullWidth
        />

        <TextField
          name={"code" as FormItem}
          label="Código"
          fullWidth
          maxLength={255}
        />

        <ConfigAdicional
          className="col-span-full"
          tipoComponente={tipoComponente}
          attribute={attribute}
          onAttributes={onAttributes}
          service={service}
          onServices={onServices}
    
        />


 
        {/*
        <hr className="col-span-3" />
        <SelectRegiones name={"regionId" as FormItem} />
        <Select
          name={"stationId" as FormItem}
          label="Estación"
          options={[
            {
              text: "Estación valencia",
              value: "1",
            },
          ]}
          fullWidth
        />
        <hr className="col-span-3" />
        <SelectRedes
          name={"refNetworkId" as FormItem}
          componenteRed={componenteRed}
          onChange={(red) => setRed(red)}
        />
        <SelectTipoComponentes
          name={"refComponentTypeId" as FormItem}
          componenteRed={componenteRed}
          onChange={(tc) => setTipoComponente(tc)}
        />
        <SelectFuentes name={"refSourceId" as FormItem} />
        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="relacion-jerarquica">
          <h4 className="text-[20px]">Relación jerarquica (opcional)</h4>
          <p>En esta sección podra relacionar componentes de red entre si</p>
        </hgroup>

        <RelacionJerarquica
          componenteRed={componenteRed}
          tipoComponente={tipoComponente}
          red={red}
          onSelected={(componente) =>
            setComponenteSeleted([...componenteSeleted, componente])
          }
          onDeselected={(componente) => {
            setComponenteSeleted(
              componenteSeleted.filter(
                (selected) => selected.id !== componente.id,
              ),
            );
          }}
        />
        <hr className="col-span-3" />
        <Select
          name={"status" as FormItem}
          label="Status"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />

      */}

        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="observacion">
          <h4 className="text-[20px]">Observación</h4>
          <p>
            Asegurece de dejar todo el detalle de las observaciones previas
            antes de la creación
          </p>
        </hgroup>

        <div className="col-span-3">
          <TextField
            name={"observation" as FormItem}
            label="Observación"
            fullWidth
            multiline
          />
        </div>

        <footer className="grid gap-4 p-4 border-t-[1px] border-[#eee] col-span-3 justify-center">
          <Button showSpinner={isSubmitting}>Guardar</Button>
        </footer>
      </Form>
    </section>
  );
}
