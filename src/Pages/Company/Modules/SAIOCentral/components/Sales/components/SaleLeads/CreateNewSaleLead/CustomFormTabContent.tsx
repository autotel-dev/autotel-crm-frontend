import { TabContent, TabPane } from "reactstrap";
// import SuccessfullyFormSubmitted from "./SuccessfullyFormSubmitted";
import { BusinessFormCommonProps } from "../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import CustomerInfoForm from "./components/SaleLeadInfo/SaleLeadInfo";
import PersonalDetails from "./components/CustomerInfo/CustomerInfo";
import VehicleDetails from "./components/VehicleDetails/VehicleDetails";
import InventoryDetails from "./components/Inventory/InventoryDetails";
import SecurityBreifingDetails from "./components/SecurityBreifing/SecurityBreifingDetails";
import ServicesDetails from "./components/Services/ServicesDetails";

const CustomFormTabContent = ({
  activeTab,
  callbackActive,
}: BusinessFormCommonProps) => {
  return (
    <TabContent className="dark-field" activeTab={activeTab}>
      <TabPane tabId={1}>
        <CustomerInfoForm callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={2}>
        <PersonalDetails callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={3}>
        <VehicleDetails callbackActive={callbackActive} />
      </TabPane>

      <TabPane tabId={4}>
        <ServicesDetails callbackActive={callbackActive} />
      </TabPane>

      <TabPane tabId={5}>
        <InventoryDetails callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={7}>
        <SecurityBreifingDetails callbackActive={callbackActive} />
      </TabPane>

      {/* <TabPane tabId={5}>
        <Attachements callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={6}>
        <SuccessfullyFormSubmitted callbackActive={callbackActive} />
      </TabPane>   */}
    </TabContent>
  );
};

export default CustomFormTabContent;
