import { TabContent, TabPane } from "reactstrap";
// import SuccessfullyFormSubmitted from "./SuccessfullyFormSubmitted";
import BasicInfo from "./components/BasicInfo/BasicInfo";
import PersonalInfo from "./components/PersonalInfo/PersonalInfo";
import { BusinessFormCommonProps } from "../../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";


const CustomFormTabContent = ({
  activeTab,
  callbackActive,
}: BusinessFormCommonProps) => {
  return (
    <TabContent className="dark-field" activeTab={activeTab}>
      <TabPane tabId={1}>
        <BasicInfo callbackActive={callbackActive} />
      </TabPane>
      <TabPane tabId={2}>
        <PersonalInfo callbackActive={callbackActive} />
      </TabPane>

    </TabContent>
  );
};

export default CustomFormTabContent;
