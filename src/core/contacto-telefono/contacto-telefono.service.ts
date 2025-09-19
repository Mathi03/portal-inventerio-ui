import { MS_CONTACTO } from "@/shared/services-v2/constants";
import { urlParamService } from "@/shared/services-v2/crud.service";

const url = "/api/v1/contactos/telefonos/contactos/{id}";

class ContactoTelefonoService extends urlParamService<any> {
  constructor() {
    super(MS_CONTACTO, url);
  }
}

const contactoTelefonoService = new ContactoTelefonoService();
export default contactoTelefonoService;
