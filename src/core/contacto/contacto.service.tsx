import CrudService from '@/shared/services-v2/crud.service';
import { Contacto } from './contacto.type';
import { MS_CONTACTO } from '@/shared/services-v2/constants';

const baseUrl = MS_CONTACTO;
const url = '/api/v1/contactos';

class ContactoService extends CrudService<Contacto> {
  constructor() {
    super(baseUrl, url);
  }
}

const contactoService = new ContactoService();

export default contactoService;
