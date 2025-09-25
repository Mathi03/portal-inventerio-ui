export interface AddressType {
  id: number;
  name?: string;
  description?: string;
}

export interface AddressTypeFilter {
  page?: number;
  limit?: number;
  defaults?: boolean;
  fields?: string;

  name?: string;
  description?: string;
}
