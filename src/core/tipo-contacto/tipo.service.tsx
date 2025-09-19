import { MS_CONTACTO } from '@/shared/services-v2/constants';
import { Tipo } from './tipo.type';
import CrudService from '@/shared/services-v2/crud.service';

const baseUrl = MS_CONTACTO;
const url = '/api/v1/contactos/tipos';

class TipoService extends CrudService<Tipo> {
  constructor() {
    super(baseUrl, url);
  }
}

const tipoService = new TipoService();

export default tipoService;
