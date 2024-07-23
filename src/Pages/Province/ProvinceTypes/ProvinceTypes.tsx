export interface ProvinceType {
  name: string;
  isActive?: string;
  days?: string;
}
export interface ProvinceDataTableType {
  id: string;
  name: string;
  isActive: string;
  action: any;
}
[];
export interface ProvincePropsType {
  activeToggle: (num: string) => void;
  activeTab: string;
}

export interface ProvincePropsTypes {
  activeToggle: (num: string) => void;
}

export interface CreatePropsTypes {
  tagCallback: (val: boolean) => void;
  tagModal: boolean;
}

export interface Provincetemp {
  name: string;
}

export interface AssignPropsType {
  name: string;
}

export interface EmptyPropsType {
  name: string;
}
