import Select from "@/components/Select";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { Form, TextField, useSnackbar } from "@telefonica/mistica";
import { useCallback, useState } from "react";
import Button from "@/components/Button";
import { RedType } from "@/core/red/red.type";
import { CreateComponenteRedDto } from "@/core/componente-red/dto/create.dto";
import {
  ComponenteRedType,
  CRStatusEnumOptions,
} from "@/core/componente-red/componente-red.type";
import { ComponenteRedService } from "@/core/componente-red/componente-red.service";
import ConfigAdicional from "@/app/(home)/componente-red/ConfigAdicional";
import { useRouter } from "next/navigation";
import RelacionJerarquica from "./Relatcion-jerarquica";
import { RelacionJerarquicaService } from "@/core/relacion-jerarquica/relacion-jerarquica.service";
import SelectRegiones from "./SelectRegiones";
import SelectRedes from "./SelectRedes";
import SelectTipoComponentes from "./SelectTipoComponentes";
import SelectFuentes from "./SelectFuentes";
type FormItem = keyof CreateComponenteRedDto;
export default function CreateForm() {
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tipoComponente, setTipoComponente] =
    useState<TipoComponenteType | null>();

  const [red, setRed] = useState<RedType | null>(null);

  const [componenteSeleted, setComponenteSeleted] = useState<
    ComponenteRedType[]
  >([]);

   //ojo validar con como se llama....
  const [fuente, setFuente] =  useState<null>();




  const [attribute, setAttribute] = useState<any>({});
  const [service, setService] = useState<any>({});


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

  

  const createRelacionJerarquicas = useCallback(
    async (componenteRed: ComponenteRedType) => {
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
    },
    [componenteSeleted],
  );

  console.log(tipoComponente?.configData);

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
        codigo,
        status,
      } = form;
      // setIsSubmitting(true);
      const componenteRedService = new ComponenteRedService();
      const { data } = await componenteRedService.create({
        stationId: +stationId,
        refSourceId: +refSourceId, //guillermo...+refSourceId,
        refComponentTypeId: +refComponentTypeId,
        refNetworkId: +refNetworkId,
        regionId: +regionId,
        status: 1,
        // componentId: 1,
        attribute:  [attribute],
        observation,
        service: [service],
        control: {
          id: 0, 
          label: label,
          name: name,
          status: 0,
        },
        code : "",
        codigo : "",
        controlId : 1,
        componentId: 1,
   
      });
      createRelacionJerarquicas(data.data);
      setIsSubmitting(false);
      openSnackbar({
        message: "Componente de red creado exitosamente",
        type: "INFORMATIVE",
      });
      router.push("/componente-red");
    },
    [attribute, service, router, openSnackbar, createRelacionJerarquicas],
  );

  const [childName, setChildName] = useState("");
  const [label, setLabel] = useState("");

  const convertirFormato = (texto: string): string => {
    return texto
      .split(" ")
      .map((palabra) => palabra.toUpperCase())
      .join("_");
  };
  

  const handleInputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    setChildName(nuevoValor);
    setLabel(convertirFormato(nuevoValor));
  };

  const handleInputLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    setLabel(convertirFormato(nuevoValor));
  };


  return (
    <section className="grid content-start overflow-auto bg-[white] w-full h-full rounded-[8px] scroller scroll-smooth">
      <header className="p-6 grid gap-4">
        <h4 className="text-[28px]">Creación de componente de red</h4>
        <p>
          En esta sección, podrás crear y gestionar tus componentes de red de
          manera eficiente y personalizada.
        </p>
      </header>
      <Form
        onSubmit={(value) => onSubmit(value as CreateComponenteRedDto)}

        className="grid grid-cols-3 content-start gap-4 px-6"
        initialValues={{
          regionId: "",
          stationId: "",
          refNetworkId: "",
          refComponentTypeId: "",
          refSourceId: "",
        }}
      >
        <h1 className="col-span-3 text-xl" id="datos">
          Datos del componente de red
        </h1>
       {/* guillermo adaptando el formulario<TextField
          name="control_label"
          label="Control etiqueta"
          fullWidth
          maxLength={255}
        />
        <TextField
          name="control_name"
          label="Control nombre"
          fullWidth
          maxLength={255}
        />*/}
        <TextField
          name={"name" as FormItem}
          label="Nombre"
          value={childName}
          fullWidth
          maxLength={255}
          onChange={handleInputName}
        />

        <TextField
          name={"label" as FormItem}
          label="Etiqueta"
          value={label}
          fullWidth
          maxLength={255}
          onChange={handleInputLabel}
        />

         <SelectRedes
            name={"refNetworkId" as FormItem}
            onChange={(red) => setRed(red)}
          />

          <SelectTipoComponentes
              name={"refComponentTypeId" as FormItem}
              onChange={(tc) => setTipoComponente(tc)}
          />

         <SelectFuentes name={"refSourceId" as FormItem} />


          {/*<Select
          name="control_status"
          label="Control estado"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />*/}
        {/*<TextField
          name={"code" as FormItem}
          label="Código"
          fullWidth
          maxLength={255}
        />*/}



        <SelectRegiones name={"regionId" as FormItem} />
        <Select
          name={"stationId" as FormItem}
          label="Estación"
          options={[
            {
              text: "Estación Caracas",
              value: "1",
            },
          ]}
          fullWidth
        />

    
 
        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="config-adicional">
        </hgroup>
       

        <ConfigAdicional
          className="col-span-full"
          tipoComponente={tipoComponente}
          attribute={attribute}
          onAttributes={onAttributes}
          service={service}
          onServices={onServices}
    
        />





        <hr className="col-span-3" />
        <hgroup className="col-span-3" id="relacion-jerarquica">
          <h4 className="text-[20px]">Relación jerarquica (opcional)</h4>
          <p>En esta sección podra relacionar componentes de red entre si</p>
        </hgroup>
        <RelacionJerarquica
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
