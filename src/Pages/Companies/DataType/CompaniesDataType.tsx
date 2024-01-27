export interface CompanyPropstype {
  activeTime: string;
}

export interface SocialMediaIconsPropsTypes {
  listClassName?: string;
}

export interface CompanyCardTypes {
  _id: any;
  avatar: string;
  icon: string;
  name: string;
  email: string;
  operator: string;
  complains: string;
  expiry: string;
  package?: any;
}
export interface CardType {
  item: CompanyCardTypes;
}
