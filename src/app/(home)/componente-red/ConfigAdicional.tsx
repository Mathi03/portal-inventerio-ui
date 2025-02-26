import Icon from "@/components/Icon";
import InputDynamic from "@/components/InputDynamic";
import Select from "@/components/Select";
import { CRStatusEnumOptions } from "@/core/componente-red/componente-red.type";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import { TextField } from "@telefonica/mistica";
import Link from "next/link";

export default function ConfigAdicional({
  tipoComponente,
  onAttributes,
  onServices,
  className,
}: {
  tipoComponente?: TipoComponenteType | null;
  onAttributes?: (name: string, value: any) => void;
  onServices?: (name: string, value: any) => void;
  className?: string;
}) {
  if (tipoComponente)
    return (
      <>
        <hr className={className} />
        <hgroup className={className}>
          <h4 className="text-[20px]">Configuracion adicional</h4>
          <p>
            Esta configuracion es dinamica, por lo cual cambia según el criterio
            del administrador. Si desea modificarlo dale click a{" "}
            <Link
              href="/mantenedor-tipo-componente"
              className="text-[#0066FF] flex items-center gap-1"
            >
              Editar tipo componente {tipoComponente.name}{" "}
              <Icon icon="edit" style={{ fontSize: "20px" }} />
            </Link>
          </p>
        </hgroup>

        <h4 className={`text-[16px] font-semibold ${className}`}>Atributos</h4>
        {tipoComponente?.configAttributes.map((attribute, key) => (
          <InputDynamic {...attribute} key={key} onChange={onAttributes} />
        ))}
        <h4 className="text-[16px] font-semibold col-span-4">Servicios</h4>
        <TextField name="service_label" label="Servicio etiqueta" fullWidth />
        <TextField name="service_name" label="Servicio nombre" fullWidth />
        <Select
          name="service_status"
          label="Servicio estado"
          options={CRStatusEnumOptions.map((option) => ({
            text: option.label,
            value: option.value.toString(),
          }))}
          fullWidth
        />
        {tipoComponente?.configServices.map((service, key) => (
          <InputDynamic {...service} key={key} onChange={onServices} />
        ))}
      </>
    );
}
