import { PlusCircle } from "react-feather";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";

const CreateNewServer = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const navigate = useNavigate();
  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className={`btn ${
            userPersonalizationData?.customColor2 == null ? "btn-primary" : ""
          }`}
          style={{
            color: "white",
            backgroundColor: `${
              userPersonalizationData !== null &&
              userPersonalizationData?.customColor2
            }`,
          }}
          onClick={() => {
            navigate(
              `${process.env.PUBLIC_URL}/super-admin/setup/server_details/createNewServer`
            );
          }}
        >
          <PlusCircle />
          Create New Server
        </button>
      </div>
    </Col>
  );
};

export default CreateNewServer;
