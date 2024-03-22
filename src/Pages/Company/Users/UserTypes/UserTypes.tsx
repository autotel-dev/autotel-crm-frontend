export interface UserType {
  name?: string;
  emailAddress?: string;
  password?: string;
  isActive?: boolean;
  phoneNo?: string;
  company?: string;
  subRole?:string;
}
export interface CountriesDataTableType {
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
