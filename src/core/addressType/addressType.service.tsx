import CrudService from "@/shared/services-v2/crud.service";
import { AddressType } from "./addressType.type";
import { CNR_BASE } from "@/shared/services-v2/constants";
const baseUrl = CNR_BASE;
const url = "/v1/cnr/address-type";

class AddressTypeService extends CrudService<AddressType> {
  constructor() {
    super(baseUrl, url);
  }
}

const addressTypeService = new AddressTypeService();

export default addressTypeService;
