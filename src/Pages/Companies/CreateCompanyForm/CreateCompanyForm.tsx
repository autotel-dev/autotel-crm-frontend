import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import {
  Businesshorizontalwizard,
  Businessverticalwizard,
  Customhorizontalwizard,
  Customverticalwizard,
  FormLayouts,
  FormWizard2Heading,
} from "../../../utils/Constant";
import CustomHorizontalWizard from "./CustomHorizontalWizard";
// import BusinessVerticalWizard from "./BusinessVerticalWizard/BusinessVerticalWizard";

const CreateCompanyForm = () => {
  return (
    <>
      <Breadcrumbs
        mainTitle={FormWizard2Heading}
        parent={FormLayouts}
        title={FormWizard2Heading}
      />
      <Container fluid>
        <Row>
          <CustomHorizontalWizard heading={Customhorizontalwizard} xs={12} />

          {/* <CustomHorizontalWizard
            heading={Customverticalwizard}
            horizontalWizardWrapperClassName="vertical-options vertical-variations"
            firstXl={3}
            secondXl={9}
          /> */}
          {/* <BusinessVerticalWizard heading={Businesshorizontalwizard} xs={12} /> */}
        </Row>
      </Container>
    </>
  );
};

export default CreateCompanyForm;
