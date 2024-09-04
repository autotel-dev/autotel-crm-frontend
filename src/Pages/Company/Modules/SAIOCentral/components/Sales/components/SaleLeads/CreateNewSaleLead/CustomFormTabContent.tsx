import { TabContent, TabPane } from "reactstrap";
// import SuccessfullyFormSubmitted from "./SuccessfullyFormSubmitted";
import { BusinessFormCommonProps } from "../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import VehicleDetails from "./components/VehicleDetails/VehicleDetails";
import InventoryDetails from "./components/Inventory/InventoryDetails";
import SecurityBreifingDetails from "./components/SecurityBreifing/SecurityBreifingDetails";
import ServicesDetails from "./components/Services/ServicesDetails";
import SaleLeadInfo from "./components/SaleLeadInfo/SaleLeadInfo";
import CustomerInfo from "./components/CustomerInfo/CustomerInfo";
import VehicleFormsManager from "./components/VehicleDetails/VehicleDetailsList";
import InventoryDetailsList from "./components/Inventory/InventoryDetailsList";
import InstallationList from "./components/Installation/InstallationList";
import SecurityBriefingDetailsList from "./components/SecurityBreifing/SecurityBeiefingDetailList";
import CompleteSaleLead from "./components/Complete/CompleteSaleLead";

interface CustomFormTabContentProps {
  activeTab?: number | undefined;
  callbackActive: (val: number | undefined) => void;
  iscreateNewSaleLead: boolean;
  setIscreateNewSaleLead: any
}

const CustomFormTabContent = ({
  activeTab,
  callbackActive,
  iscreateNewSaleLead,
  setIscreateNewSaleLead,
}: CustomFormTabContentProps) => {
  return (
    <TabContent className="dark-field" activeTab={activeTab}>
      <TabPane tabId={1}>
        <SaleLeadInfo callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>
      {<TabPane tabId={2}>
        <CustomerInfo callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>}
      {/* <TabPane tabId={3}>
        <VehicleDetails callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane> */}


      <TabPane tabId={3}>
        <VehicleFormsManager callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>


      <TabPane tabId={4}>
        <InventoryDetailsList callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>

      <TabPane tabId={5}>
        <InstallationList callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>
      <TabPane tabId={6}>
        <SecurityBriefingDetailsList callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>

      <TabPane tabId={7}>
        <CompleteSaleLead callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane>


      {/* <TabPane tabId={4}>
        <ServicesDetails callbackActive={callbackActive} />
      </TabPane> */}

      {/* <TabPane tabId={4}>
        <InventoryDetails callbackActive={callbackActive} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
      </TabPane> */}

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
