import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { createNewCRMModule } from "../../utils/Constant";
import { Link } from "react-router-dom";

const CreateNewCRMModule = () => {
  return (
    <Col md={6}>
      <div className="text-end">
        <Link
          className="btn btn-primary"
          style={{ color: "white" }}
          to={`${process.env.PUBLIC_URL}/apps/project/createnew`}
        >
          <PlusCircle />
          {createNewCRMModule}
        </Link>
      </div>
    </Col>
  );
};

export default CreateNewCRMModule;
