import { Tag } from "@telefonica/mistica";

export default function TagStatus({ status }: { status: 1 | 2 | 3 | 4 }) {
  return (
    <Tag type={
  status === 1 ? "active" : // Si es 1, es "success"
  status === 2 ? "error" : // Si es 2, es "inactive"
  status === 3 ? "inactive" :  // Si es 3, podrías usar "warning" o "pending" para el tipo de tag
  "warning"      // Si es 4, podrías usar "info" o "danger" para el tipo de tag
}>
  {status === 1 ? "Activo" :
   status === 2 ? "Inactivo" :
   status === 3 ? "Por Aprobar" :
   "Por Modificar" 
  }

</Tag>
  );
}
