import { PlusCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";

const CreateNewCompany = () => {
  const navigate = useNavigate();
  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={() => {
            navigate(`${process.env.PUBLIC_URL}/companies/createComapny`);
          }}
        >
          <PlusCircle />
          Create New Comapny
        </button>
      </div>
    </Col>
  );
};

export default CreateNewCompany;
