import { CNR_BASE } from "@/shared/services-v2/constants";
import CrudService from "@/shared/services-v2/crud.service";

const url = "/v1/cnr/customer-contact";

class CustomerContactService extends CrudService<any> {
  constructor() {
    super(CNR_BASE, url);
  }
}

const customerContactService = new CustomerContactService();

export default customerContactService;
