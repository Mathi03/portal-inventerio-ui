import { Tag } from "@telefonica/mistica";

export default function TagStatus({ status }: { status: 1 | 0 }) {
  return (
    <Tag type={status === 1 ? "success" : "inactive"}>
      {status === 1 ? "Activo" : "Inactivo"}
    </Tag>
  );
}
