import { Container, Row } from "reactstrap";
import CustomHorizontalWizard from "./CustomHorizontalWizard";

interface CreateNewSaleLeadProps {
  iscreateNewSaleLead: boolean;
  setIscreateNewSaleLead: any
}

const CreateNewSaleLead: React.FC<CreateNewSaleLeadProps> = ({
  iscreateNewSaleLead,
  setIscreateNewSaleLead,
}) => {

  return (
    <>
      <Container fluid>
        <Row>
          <CustomHorizontalWizard heading="" xs={12} iscreateNewSaleLead={iscreateNewSaleLead} setIscreateNewSaleLead={setIscreateNewSaleLead} />
        </Row>
      </Container>
    </>
  );
};

export default CreateNewSaleLead;
