import { Container, Row } from "reactstrap";
import CustomHorizontalWizard from "./CustomHorizontalWizard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CreateNewCustomer = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Container fluid>
        <Row>
          <CustomHorizontalWizard heading="" xs={12} />
        </Row>
      </Container>
    </>
  );
};

export default CreateNewCustomer;
