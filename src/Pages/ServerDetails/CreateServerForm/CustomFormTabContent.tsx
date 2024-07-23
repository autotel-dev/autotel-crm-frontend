import { TabContent, TabPane } from "reactstrap";
import { BusinessFormCommonProps } from "../../../Types/Forms/FormLayout/FormWizardTypes";
import ServerInfoForm from "./ServerInfoForm";
import ServerCredentials from "./ServerCredentials";
import GoogleAccountCredentials from "./GoogleAccountCredentials";
import FirebaseAccountCredentials from "./FirebaseAccountCredentials";
import ApiKeys from "./ApiKeys";
import SuccessfullyFormSubmitted from "./SuccessfullyFormSubmitted";

const CustomFormTabContent = ({
  activeTab,
  callbackActive,
}: BusinessFormCommonProps) => {
  return (
    <TabContent className="dark-field" activeTab={activeTab}>
      <TabPane tabId={1}>
        <ServerInfoForm callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={2}>
        <ServerCredentials callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={3}>
        <GoogleAccountCredentials callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={4}>
        <FirebaseAccountCredentials callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={5}>
        <ApiKeys callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={6}>
        <SuccessfullyFormSubmitted callbackActive={callbackActive} />
      </TabPane>
    </TabContent>
  );
};

export default CustomFormTabContent;
