import useSWR, { useSWRConfig } from "swr";
import { Form, TextField, Spinner, useSnackbar } from "@telefonica/mistica";
import { ClienteType } from "@/core/cliente/cliente.type";
import { ClienteService } from "@/core/cliente/cliente.service";
import Button from "./Button";
import { useModalStore } from "@/hooks/modalStorage";
import Icon from "./Icon";
import Table, { TableColumn } from "./Table/Table";
import { useEffect, useMemo, useState } from "react";
import customerContactService from "@/core/customerContact/customerContact.service";
import tipoService from "@/core/tipo-contacto/tipo.service";
import { CustomerContact } from "@/core/customerContact/customerContact.type";
import contactoService from "@/core/contacto/contacto.service";
import contactoTelefonoService from "@/core/contacto-telefono/contacto-telefono.service";
import contactoEmailService from "@/core/contacto-email/contacto-email.service";
import { Tipo } from "@/core/tipo-contacto/tipo.type";
import { formatPhoneNumber } from "@/utils/validations";
import addressService from "@/core/address/address.service";
import { Address } from "@/core/address/address.type";
import addressTypeService from "@/core/addressType/addressType.service";
import axios from "axios";
import { errorGeneric, errorMessageInAPI } from "@/types/errorMessageInAPI";

type ClientInfoProps = {
  clientId: number;
};

type AddressProp = {
  id: number;
  name: string;
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
  const { openSnackbar } = useSnackbar();
  const { cache, mutate } = useSWRConfig();
  const [itemPerPage, setItemPerPage] = useState(1000);
  const [dataContactos, setDataContactos] = useState<any[]>([]);
  const [dataDirecciones, setDataDirecciones] = useState<any[]>([]);
  const [addressType, setAddressType] = useState<AddressProp[]>();

  const [currentPage, setCurrentPage] = useState(1);

  const contactColumns = useMemo<TableColumn<any>[]>(() => {
    return [
      {
        title: "#",
        key: "row",
        maxWidth: "70px",
      },
      {
        title: "Nombre",
        key: "fullname",
      },
      {
        title: "Tipo Contacto",
        key: "contactType",
      },
      {
        title: "Email",
        key: "email",
      },
      {
        title: "Teléfono",
        key: "phone",
        render: (row) => {
          return row?.phone?.length == 10
            ? formatPhoneNumber(row.phone)
            : row.phone;
        },
      },
    ];
  }, []);

  const directionColumns = useMemo<TableColumn<any>[]>(() => {
    return [
      {
        title: "#",
        key: "row",
        maxWidth: "70px",
      },
      {
        title: "tipo dirección",
        key: "addressTypeId",
        render: (row) => {
          const tipo = addressType?.find((tipo: any) => {
            if (Number(tipo.id) === Number(row.addressTypeId)) {
              return tipo.name;
            }
          });
          return tipo ? tipo.name : "tipo no encontrado";
        },
        maxWidth: "270px",
      },
      {
        title: "Dirección",
        key: "address",
      },
    ];
  }, [addressType]);

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

  const fetchData = async (filter: any) => {
    try {
      const customerContactResponse =
        (await customerContactService.getAllByParams(filter)) as any;
      const customerContacts = customerContactResponse.data.data;

      const contactTypesService = await tipoService.getAllByParams({
        page: 1,
        limit: 1000,
      });
      const contactTypes = contactTypesService.data?.data ?? [];

      const tableDataPromises = customerContacts.map(
        async (customerContact: CustomerContact, index: number) => {
          const contact = await contactoService.getById(
            customerContact.contactId
          );

          const [phonesResponse, emailsResponse] = await Promise.all([
            contactoTelefonoService.getAllByOneId(contact.id),
            contactoEmailService.getAllByOneId(contact.id),
          ]);

          const phone =
            phonesResponse?.data?.length > 0
              ? phonesResponse.data[0].number
              : "-";
          const email =
            emailsResponse?.data?.length > 0
              ? emailsResponse.data[0].email
              : "-";

          return {
            row: index + 1,
            id: customerContact.id,
            fullname: `${contact.names} ${contact.lastNames}`,
            phone,
            email,
            contactType:
              contactTypes.find((ct: Tipo) => ct.id === contact.idContactType)
                ?.name ?? "Sin Tipo",
          };
        }
      );

      const tableData = await Promise.all(tableDataPromises);
      setDataContactos(tableData);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        openSnackbar({
          message: errorMessageInAPI,
          type: "CRITICAL",
        });
      } else {
        openSnackbar({
          message: errorGeneric,
          type: "CRITICAL",
        });
      }
    }
  };

  const fetchDataTipoDireccion = async (addressTypeFilter: any) => {
    const addressType = (await addressTypeService.getAllByParams(
      addressTypeFilter
    )) as any;
    setAddressType(addressType.data.data);
  };

  const fetchDataDirecciones = async (filter: any) => {
    try {
      const customerAddress = (await addressService.getAllByParams(
        filter
      )) as any;
      const tableData = customerAddress?.data?.data?.map(
        (address: Address, index: number) => ({
          row: index + 1,
          ...address,
        })
      );
      setDataDirecciones(tableData);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        openSnackbar({
          message: errorMessageInAPI,
          type: "CRITICAL",
        });
      } else {
        openSnackbar({
          message: errorGeneric,
          type: "CRITICAL",
        });
      }
    }
  };

  useEffect(() => {
    const filterAddressParam = { page: 1, limit: 1000 };
    fetchDataTipoDireccion(filterAddressParam);
    fetchData({ page: currentPage, limit: itemPerPage, customerId: clientId });
    fetchDataDirecciones({
      page: currentPage,
      limit: itemPerPage,
      "client-id": clientId,
    });
  }, []);

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
    <div className="p-4 overflow-auto w-full h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl">Datos del Cliente</h2>
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

      <div className="flex">
        <Table
          columns={contactColumns}
          rows={dataContactos}
          pagination={false}
          header={
            <>
              <div className="grid justify-items-center">
                <div className=" text-2xl">Contactos de Cliente</div>
              </div>
            </>
          }
        />
      </div>
      <div className="flex">
        <Table
          columns={directionColumns}
          rows={dataDirecciones}
          pagination={false}
          header={
            <>
              <div className="grid justify-items-center">
                <div className=" text-2xl">Direcciones de Cliente</div>
              </div>
            </>
          }
        />
      </div>
    </div>
  );
};

export default ClientInfo;
