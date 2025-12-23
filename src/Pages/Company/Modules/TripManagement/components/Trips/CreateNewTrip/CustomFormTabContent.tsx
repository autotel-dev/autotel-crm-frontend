import { TabContent, TabPane } from "reactstrap";
import TripDetails from "./components/TripDetails/TripDetails";
import Checkpoints from "./components/Checkpoints/Checkpoints";
import TimeSchedules from "./components/TimeSchedules/TimeSchedules";
import Review from "./components/Review/Review";

interface CustomFormTabContentProps {
  activeTab: number | undefined;
  callbackActive: (tab: number | undefined) => void;
}

const CustomFormTabContent: React.FC<CustomFormTabContentProps> = ({
  activeTab,
  callbackActive,
}) => {
  return (
    <TabContent activeTab={activeTab} className="dark-field">
      <TabPane tabId={1}>
        {activeTab === 1 && <TripDetails callbackActive={callbackActive} />}
      </TabPane>
      <TabPane tabId={2}>
        {activeTab === 2 && <Checkpoints callbackActive={callbackActive} />}
      </TabPane>
      <TabPane tabId={3}>
        {activeTab === 3 && <TimeSchedules callbackActive={callbackActive} />}
      </TabPane>
      <TabPane tabId={4}>
        {activeTab === 4 && <Review callbackActive={callbackActive} />}
      </TabPane>
    </TabContent>
  );
};

export default CustomFormTabContent;
