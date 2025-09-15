import useSWR, { useSWRConfig } from "swr";
import { Form, TextField, Spinner } from "@telefonica/mistica";
import { ClienteType } from "@/core/cliente/cliente.type";
import { ClienteService } from "@/core/cliente/cliente.service";
import Button from "./Button";
import { useModalStore } from "@/hooks/modalStorage";
import Icon from "./Icon";

type ClientInfoProps = {
  clientId: number;
};

const clientService = new ClienteService();
const normalizeApiData = (r: any) =>
  r?.data?.data?.data ?? r?.data?.data ?? r?.data ?? r;

const fetcher = async (id: number): Promise<ClienteType> => {
  const res = await clientService.getById(id);
  return normalizeApiData(res);
};

const ClientInfo = ({ clientId }: ClientInfoProps) => {
  const { closeModal } = useModalStore();
  const { cache, mutate } = useSWRConfig();

  // const key: [string, number] | null = clientId ? ["clients", clientId] : null;
  const key = `/v1/cnr/clients/${clientId}`;

  // revisa si ya existe en cache antes de disparar fetch
  const cached = key ? cache.get(key) : null;

  const { data, error, isLoading } = useSWR<ClienteType>(
    key,
    () => fetcher(clientId),
    {
      fallbackData: cached as ClienteType, // usa cache si existe
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: !cached, // solo refetch si no está en cache
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={56} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p>Ocurrió un error al cargar los datos.</p>
        <Button onClick={() => mutate(key)}>Reintentar</Button>
      </div>
    );
  }

  if (!data) return null;

  const initialValues = {
    nombreadministrativo: data.nombreadministrativo ?? "",
    nombrecomercial: data.nombrecomercial ?? "",
    rif: data.rif ?? "",
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Datos del Cliente</h2>
        <Icon
          icon="close"
          className="justify-self-end cursor-pointer"
          onClick={() => closeModal()}
        />
      </div>
      <hr className="mb-4" />
      <Form
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("Formulario enviado:", values);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <TextField
            name="nombreadministrativo"
            label="Nombre Administrativo"
            disabled
          />
          <TextField name="nombrecomercial" label="Nombre Comercial" disabled />
          <TextField name="rif" label="RIF" disabled />
        </div>
      </Form>
    </div>
  );
};

export default ClientInfo;
