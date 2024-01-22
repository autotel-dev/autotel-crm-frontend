export interface CitiesType {
  name?: string;
  isActive?: string;
  title?: string;
  price?: number;
  duration?: string;
  
}
export interface CitiesDataTableType {
  id: string;
  name: string;
  isActive: string;
  action: any;
}
[];
export interface CitiesPropsType {
  activeToggle: (num: string) => void;
  activeTab: string;
}

export interface CitiesPropsTypes {
  activeToggle: (num: string) => void;
}

export interface CreatePropsTypes {
  tagCallback: (val: boolean) => void;
  tagModal: boolean;
}

export interface Citiestemp {
  name: string;
}

export interface AssignPropsType {
  name: string;
}

export interface EmptyPropsType {
  name: string;
}
