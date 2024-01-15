export interface CompanyPropstype {
  activeTime: string;
}

export interface SocialMediaIconsPropsTypes {
  listClassName?: string;
}

export interface CompanyCardTypes {
  id: number;
  avatar: string;
  icon: string;
  name: string;
  email: string;
  operator: string;
  complains: string;
  expiry: string;
}
export interface CardType {
  item: CompanyCardTypes;
}
