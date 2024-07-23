export interface ProductType {
    name?: string;
    symbol?:string;
    isActive?: string;
    title?: string;
    price?: number;
    duration?: string;
    icon?: string;
  }
  export interface CurrenciesDataTableType {
    id: string;
    name: string;
    symbol: string;
    isActive: string;
    action: any;
  }
  [];
  
  
  export interface CitiesPropsTypes {
    activeToggle: (num: string) => void;
  }
  
  export interface CreatePropsTypes {
    tagCallback: (val: boolean) => void;
    tagModal: boolean;
  }
  
  
  export interface AssignPropsType {
    name: string;
  }
  
  export interface EmptyPropsType {
    name: string;
  }
  