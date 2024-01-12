export interface PackageType {
  title: string;
  price: number;
  duration: string;
}
export interface PackageDataTableType {
  id: string;
  title: string;
  price: number;
  duration: string;
  isActive: string;
  action: any;
}
[];
export interface PackagePropsType {
  activeToggle: (num: string) => void;
  activeTab: string;
}

export interface PackagePropsTypes {
  activeToggle: (num: string) => void;
}

export interface CreatePropsTypes {
  tagCallback: (val: boolean) => void;
  tagModal: boolean;
}

export interface Packagetemp {
  name: string;
}

export interface AssignPropsType {
  name: string;
}

export interface EmptyPropsType {
  name: string;
}
