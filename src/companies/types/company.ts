export interface Company {
  id: string;
  legal_name: string;
  trade_name: string;
  tax_id: string;
  created_at: string;
}

export interface CreateCompanyDTO {
  legal_name: string;
  trade_name: string;
  tax_id: string;
}

export interface ReplaceCompanyDTO extends CreateCompanyDTO {}

export interface UpdateCompanyDTO {
  legal_name?: string;
  trade_name?: string;
  tax_id?: string;
}

// Products
export interface CompanyProduct {
  company_id: string;
  product_id: number;
  bought_at: string;
  support_until: string;
}

export interface AddCompanyProductDTO {
  ids: number[];
}

export interface RemoveCompanyProductDTO extends AddCompanyProductDTO {}

// Users
export interface AddCompanyUsersDTO {
  ids: string[];
}

export interface RemoveCompanyUsersDTO {
  ids: string[];
}
