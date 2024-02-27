import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H4, H5 } from "../../../../../AbstractElements";
import { useSelector } from "react-redux";
import "./permissionStyles.css";

const ServerPermissions = () => {
  const { serverPermissions } = useSelector((state: any) => state.user);
  console.log("serverPermissions", serverPermissions);

  return (
    <Col md={12}>
      <Card>
        <CommonHeader
          title="Server Permissions"
          headClass="card-title mb-0 pb-0"
        />
        <CardBody>
          <Row
            style={{
              overflowY: "auto",
              maxHeight: "50vh", // Subtract scrollbar width from max height
              WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
              scrollbarWidth: "thin", // Specify scrollbar width
              WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
              MozBorderRadius: "5px !important", // For Mozilla Firefox
              borderRadius: "5px !important", // For other browsers
              scrollbarColor: "lightgray transparent", // Specify scrollbar color
            }}
          >
            {/* {Object.keys(server.userPermissions).map(
              (key, index) => (
                <div key={index}>
                  <h2>{key}</h2>
                  <p>{JSON.stringify(jsonObject[key])}</p>
                </div>
              )
            )} */}

            {serverPermissions.map((server: any, index: any) => {
              return (
                <div key={index}>
                  <div style={{ marginBottom: "20px" }}>
                    <CommonHeader
                      title={`${index + 1}) ${server.server.companyName}`}
                      headClass="card-title mb-0 pb-0"
                    />
                  </div>

                  {Object.keys(server.userPermissions).map((key, index) => (
                    <Row>
                      <Col
                        key={index}
                        xl={8}
                        lg={8}
                        md={8}
                        sm={8}
                        xs={12}
                        // xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "17px", margin: "15px 0px" }}>
                          {key}
                        </span>
                        <div>
                          <label
                            style={{
                              display: "inline-block",
                              position: "relative",
                              cursor: "pointer",
                              marginRight: "25px",
                              fontSize: "18px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              name="key"
                              value="value"
                              checked={server.userPermissions[key].view}
                              onChange={() => {}}
                              style={{ display: "none" }} // Hide the default checkbox
                            />
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className={
                                server.userPermissions[key].view === true
                                  ? "green"
                                  : "red"
                              }
                            ></span>
                            View
                          </label>
                          <label
                            style={{
                              display: "inline-block",
                              position: "relative",
                              cursor: "pointer",
                              marginRight: "25px",
                              fontSize: "18px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              name="key"
                              value="value"
                              checked={server.userPermissions[key].edit}
                              onChange={() => {}}
                              style={{ display: "none" }} // Hide the default checkbox
                            />
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className={
                                server.userPermissions[key].edit === true
                                  ? "green"
                                  : "red"
                              }
                            ></span>
                            Edit
                          </label>
                          <label
                            style={{
                              display: "inline-block",
                              position: "relative",
                              cursor: "pointer",
                              marginRight: "25px",
                              fontSize: "18px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              name="key"
                              value="value"
                              checked={server.userPermissions[key].remove}
                              onChange={() => {}}
                              style={{ display: "none" }} // Hide the default checkbox
                            />
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className={
                                server.userPermissions[key].remove === true
                                  ? "green"
                                  : "red"
                              }
                            ></span>
                            Remove
                          </label>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              );
            })}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ServerPermissions;
