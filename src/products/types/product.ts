export interface Product {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
}

export interface ReplaceProductDTO extends CreateProductDTO {}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
}

// Companies
export interface AddProductToCompaniesDTO {
  company_ids: string[];
}

export interface RemoveProductFromCompaniesDTO extends AddProductToCompaniesDTO
