import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H4, H5, P } from "../../../../../AbstractElements";
import { useSelector } from "react-redux";
import "./allowedModules.css";

const AllowedModules = () => {
  const { userData } = useSelector((state: any) => state.user);
  //   // console.log("userData", userData);

  return (
    <Col md={12}>
      <Card>
        <CardHeader className="pb-0">
          <H4>Allowed Modules</H4>
        </CardHeader>
        <CardBody>
          <Row
            style={{
              overflowY: "auto",
              maxHeight: "30vh", // Subtract scrollbar width from max height
              WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
              scrollbarWidth: "thin", // Specify scrollbar width
              WebkitBorderRadius: "5px !important", // For WebKit browsers (Chrome, Safari)
              MozBorderRadius: "5px !important", // For Mozilla Firefox
              borderRadius: "5px !important", // For other browsers
              scrollbarColor: "lightgray transparent", // Specify scrollbar color
            }}
          >
            {userData.allowedModules.map((module: any, index: any) => {
              return (
                <div key={index}>
                  <Row>
                    <Col
                      key={index}
                      xl={6}
                      lg={6}
                      md={9}
                      sm={12}
                      xs={12}
                      // xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <P>{module.name}</P>
                      <div>
                        <label
                          style={{
                            display: "inline-block",
                            position: "relative",
                            cursor: "pointer",
                            marginRight: "25px",
                            marginBottom: "15px",
                            fontSize: "18px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            name="key"
                            value="value"
                            checked={module.isActive}
                            onChange={() => {}}
                            style={{ display: "none" }} // Hide the default checkbox
                          />
                          <span
                            onClick={(e) => e.stopPropagation()}
                            className="green"
                          ></span>
                        </label>
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AllowedModules;
