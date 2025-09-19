import CrudService from "@/shared/services-v2/crud.service";
import { Address } from "./address.type";
import { CNR_BASE } from "@/shared/services-v2/constants";

const baseUrl = CNR_BASE;
const url = "/v1/cnr/customer-address";

class AddressService extends CrudService<Address> {
  constructor() {
    super(baseUrl, url);
  }
}

const addressService = new AddressService();

export default addressService;
