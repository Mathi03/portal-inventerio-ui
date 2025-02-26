import Icon from "@/components/Icon";
import InputDynamic from "@/components/InputDynamic";
import { TipoComponenteType } from "@/core/tipo-componente/tipo-componente.type";
import Link from "next/link";

export default function ConfigAdicional({
  tipoComponente,
}: {
  tipoComponente?: TipoComponenteType | null;
}) {
  if (tipoComponente)
    return (
      <>
        <hr />
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
        <h4 className="text-[18px] font-medium">Atributos</h4>
        {tipoComponente?.configAttributes.map((attribute, key) => (
          <InputDynamic {...attribute} key={key} />
        ))}
        <h4 className="text-[18px] font-medium">Servicios</h4>
        {tipoComponente?.configServices.map((service, key) => (
          <InputDynamic {...service} key={key} />
        ))}
      </>
    );
}
