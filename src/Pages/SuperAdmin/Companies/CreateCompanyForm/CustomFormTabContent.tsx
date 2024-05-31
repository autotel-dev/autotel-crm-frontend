import { TabContent, TabPane } from "reactstrap";
import { BusinessFormCommonProps } from "../../../../Types/Forms/FormLayout/FormWizardTypes";
import AccountCredentials from "./AccountCredentials";
import ServerCredentials from "./ServerCredentials";
import CompanyInfoForm from "./CompanyInfoForm";
import CRMModules from "./CRMModules";
import Attachements from "./Attachements";
import SuccessfullyFormSubmitted from "./SuccessfullyFormSubmitted";

const CustomFormTabContent = ({
  activeTab,
  callbackActive,
}: BusinessFormCommonProps) => {
  return (
    <TabContent className="dark-field" activeTab={activeTab}>
      <TabPane tabId={1}>
        <CompanyInfoForm callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={2}>
        <AccountCredentials callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={3}>
        <ServerCredentials callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={4}>
        <CRMModules callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={5}>
        <Attachements callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={6}>
        <SuccessfullyFormSubmitted callbackActive={callbackActive} />
      </TabPane>
    </TabContent>
  );
};

export default CustomFormTabContent;
