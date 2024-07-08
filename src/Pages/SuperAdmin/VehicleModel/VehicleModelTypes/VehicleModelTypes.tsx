export interface VehicleModelType {
  name: string;
  isActive?: string;
  days?: string;
}
export interface VehicleModelDataTableType {
  id: string;
  name: string;
  isActive: string;
  action: any;
}
[];
export interface VehicleModelPropsType {
  activeToggle: (num: string) => void;
  activeTab: string;
}

export interface VehicleModelPropsTypes {
  activeToggle: (num: string) => void;
}

export interface CreatePropsTypes {
  tagCallback: (val: boolean) => void;
  tagModal: boolean;
}

export interface VehicleModeltemp {
  name: string;
}

export interface AssignPropsType {
  name: string;
}

export interface EmptyPropsType {
  name: string;
}
