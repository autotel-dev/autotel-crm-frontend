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
import {
  formatUnderscoredString,
  getUserRole,
} from "../../../../../Api/globals";
import { useState } from "react";

interface PropTypes {
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditMyProfile: React.FC<PropTypes> = ({ isEdit, setIsEdit }) => {
  const { userData } = useSelector((state: any) => state.user);
  const [accountStatus, setAcountStatus] = useState(userData.accountStatus);

  
  return (
    <Col xl={4}>
      <Card>
        <CommonHeader title={MyProfile} headClass="card-title mb-0 pb-0" />
        <CardBody>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Row className="mb-3">
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
              <H3 className="mb-1">{userData.emailAddress}</H3>
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <H3 className="mb-1">{userData.phoneNo}</H3>
            </FormGroup>
            {getUserRole() == "COMPANY" && userData.address !== null && (
              <FormGroup>
                <Label>Address</Label>
                <H3 className="mb-1">{userData.address}</H3>
              </FormGroup>
            )}
            {getUserRole() == "COMPANY" && userData.gstNo !== null && (
              <FormGroup>
                <Label>Gst No</Label>
                <H3 className="mb-1">{userData.gstNo}</H3>
              </FormGroup>
            )}
            {getUserRole() == "COMPANY" && userData.ntn !== null && (
              <FormGroup>
                <Label>NTN</Label>
                <H3 className="mb-1">{userData.ntn}</H3>
              </FormGroup>
            )}

            <FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "30px",
                }}
              >
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
                        disabled
                        // value={
                        //   accountStatus == "ACTIVE" ? "on" : "off"
                        // }
                        // onChange={(e) => {
                        //   if (accountStatus == "ACTIVE") {
                        //     setAcountStatus("NOT ACTIVE");
                        //   } else {
                        //     setAcountStatus("ACTIVE");
                        //   }

                        //   console.log(e.target.value);
                        // }}
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
              <Button
                color="primary"
                className="d-block"
                disabled={isEdit}
                onClick={() => setIsEdit(!isEdit)}
              >
                Edit
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default EditMyProfile;
