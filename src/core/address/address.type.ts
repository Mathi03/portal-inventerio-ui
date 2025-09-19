export interface Address {
  id: number;
  customerId?: string;
  addressTypeId?: string;
  address?: string;
}

export interface AddressFilter {
  page?: number;
  limit?: number;
  defaults?: boolean;
  fields?: string;
  customerId?: string;
  addressTypeId?: string;
  address?: string;
}
