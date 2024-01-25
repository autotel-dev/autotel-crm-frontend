import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import { Checkmeout, Email, Password, Signin } from "../../../utils/Constant";
type propsType = {
  toggle: () => void;
};
const ChangePasswordForm = ({ toggle }: propsType) => {
  return (
    <Form>
      <Row className="g-3">
        <Col md={12}>
          <Label htmlFor="inputPassword4">{Password}</Label>
          <Input
            id="inputPassword4"
            type="password"
            placeholder="Enter Your Password"
          />
        </Col>
        <Col md={12}>
          <Button
            color="primary"
            type="submit"
            onClick={() => {
              toggle();
            }}
          >
            {Signin}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ChangePasswordForm;
