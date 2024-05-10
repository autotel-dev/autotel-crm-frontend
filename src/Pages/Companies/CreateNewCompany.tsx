import { PlusCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";

import { useEffect } from "react";
import { getAll } from "../../Api";

const CreateNewCompany = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const navigate = useNavigate();
  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className={`btn ${
            userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""
          }`}
          style={{
            color: "white",
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.buttonsAndBarsColor
            }`,
          }}
          onClick={() => {
            navigate(
              `${process.env.PUBLIC_URL}/super-admin/companies/createComapany`
            );
          }}
        >
          <PlusCircle />
          Create New Company
        </button>
      </div>
    </Col>
  );
};

export default CreateNewCompany;
