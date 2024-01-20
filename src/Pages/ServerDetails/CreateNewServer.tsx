import { PlusCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";

const CreateNewServer = () => {
  const navigate = useNavigate();
  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className="btn btn-primary"
          style={{ color: "white" }}
          onClick={() => {
            navigate(
              `${process.env.PUBLIC_URL}/setup/server_details/createNewServer`
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
