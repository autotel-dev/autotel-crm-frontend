import { PlusCircle } from "react-feather";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";

import { useEffect } from "react";
import { getAll } from "../../Api";

const CreateNewCompany = () => {
  
  const navigate = useNavigate();
  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={() => {
            navigate(
              `${process.env.PUBLIC_URL}/super-admin/companies/createComapany`
            );
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
