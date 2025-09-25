import { MS_CONTACTO } from "@/shared/services-v2/constants";
import { urlParamService } from "@/shared/services-v2/crud.service";

const url = "/api/v1/contactos/contacto-emails/email/contactos/{id}";

class ContactoEmailService extends urlParamService<any> {
  constructor() {
    super(MS_CONTACTO, url);
  }
}

const contactoEmailService = new ContactoEmailService();
export default contactoEmailService;
