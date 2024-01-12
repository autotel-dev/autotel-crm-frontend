export interface CRMModuleType {
  name: string;
  icon: string;
}
export interface CRMModuleDataTableType {
  id: string;
  name: string;
  icon: string;
  isActive: string;
  action: any;
}
[];
export interface CRMModulePropsType {
  activeToggle: (num: string) => void;
  activeTab: string;
}

export interface CRMModulePropsTypes {
  activeToggle: (num: string) => void;
}

export interface CreatePropsTypes {
  tagCallback: (val: boolean) => void;
  tagModal: boolean;
}

export interface CRMModuletemp {
  name: string;
}

export interface AssignPropsType {
  name: string;
}

export interface EmptyPropsType {
  name: string;
}
