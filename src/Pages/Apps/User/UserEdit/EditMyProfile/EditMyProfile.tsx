import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H3, H6, Image, P } from "../../../../../AbstractElements";
import { dynamicImage } from "../../../../../Service";
import {
  AboutMe,
  Emailaddress,
  MyProfile,
  Password,
  Save,
  Website,
} from "../../../../../utils/Constant";
import { useSelector } from "react-redux";
import { formatUnderscoredString } from "../../../../../Api/globals";
import { useState } from "react";

const EditMyProfile = () => {
  const { userData } = useSelector((state: any) => state.user);
  const [accountStatus, setAcountStatus] = useState(userData.accountStatus);
  return (
    <Col xl={4}>
      <Card>
        <CommonHeader title={MyProfile} headClass="card-title mb-0 pb-0" />
        <CardBody>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Row className="mb-2">
              <div className="col-auto">
                <Image
                  width={70}
                  height={70}
                  className="img-70 rounded-circle"
                  alt="edit-user"
                  src={dynamicImage("user/7.jpg")}
                />
              </div>
              <Col>
                <H3 className="mb-1">{userData.fullName}</H3>
                <P className="mb-4">{formatUnderscoredString(userData.role)}</P>
              </Col>
            </Row>

            <FormGroup>
              <Label>Email Address</Label>
              <Input placeholder="Email" defaultValue={userData.emailAddress} />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="text"
                placeholder="Phone Number"
                defaultValue={userData.phoneNo}
              />
            </FormGroup>
            <FormGroup>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <H3>Account Status</H3>
                <div className="d-flex">
                  <div
                    className={`text-end flex-shrink-0 icon-state 
                            }`}
                  >
                    <Label className="switch mb-0">
                      <Input
                        type="checkbox"
                        defaultChecked={
                          accountStatus == "ACTIVE" ? true : false
                        }
                        value={
                          accountStatus == "ACTIVE" ? "on" : "off"
                        }
                        onChange={(e) => {
                          if (accountStatus == "ACTIVE") {
                            setAcountStatus("NOT ACTIVE");
                          } else {
                            setAcountStatus("ACTIVE");
                          }

                          console.log(e.target.value);
                        }}
                      />
                      <span
                        className={`switch-state ${
                          accountStatus == "ACTIVE"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </FormGroup>
            <div className="form-footer">
              <Button color="primary" className="d-block">
                {Save}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default EditMyProfile;
