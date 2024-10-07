import { PopoverBody, PopoverHeader, UncontrolledPopover } from "reactstrap";
import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";


export interface SaleLeadsDataType {
    id: string;
    username: string;
    email: string;
    customer_name: string;
    customer_contact_no: string;
    package: string;
    status: string;
    customer: any;
    vehicles: any;
    openedBy: any;
    totalNoOfVehicles: any;
    service_charges: number;
    discounted_service_charges: number;
    isActive: string;
    date: string;
    actions:any;
}
