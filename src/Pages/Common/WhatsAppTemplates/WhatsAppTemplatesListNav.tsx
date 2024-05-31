import { Col, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../ReaduxToolkit/Hooks";
import { useSelector } from "react-redux";
import CreateNewWhatsAppTemplate from "./CreateNewWhatsAppTemplate";


const WhatsAppTemplatesListNav = () => {
  const { activeTab } = useAppSelector((state) => state.project);
  const dispatch = useAppDispatch();
  var tempList: any = [];
  const { countries, filterCountries } = useSelector(
    (state: any) => state.countries
  );
  return (
    <Row>
      <Col md={6}>
      </Col>
      <CreateNewWhatsAppTemplate />
    </Row>
  );
};

export default WhatsAppTemplatesListNav;
