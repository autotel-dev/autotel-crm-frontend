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

// interface PropTypes {
//   isEdit: boolean;
//   setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const EditMyProfile: React.FC<PropTypes> = ({ isEdit, setIsEdit }) => {
const EditMyProfile = () => {
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
              <H3 className="mb-1">Email Address</H3>
              <Label>{userData.emailAddress}</Label>
            </FormGroup>
            <FormGroup>
              <H3 className="mb-1">Phone Number</H3>
              <Label>{userData.phoneNo}</Label>
            </FormGroup>
            {getUserRole() == "COMPANY" && userData.address !== null && (
              <FormGroup>
                <H3 className="mb-1">{userData.address}</H3>
                <Label>Address</Label>
              </FormGroup>
            )}
            {getUserRole() == "COMPANY" && userData.gstNo !== null && (
              <FormGroup>
                <H3 className="mb-1">Gst No</H3>
                <Label>{userData.gstNo}</Label>
              </FormGroup>
            )}
            {getUserRole() == "COMPANY" && userData.ntn !== null && (
              <FormGroup>
                <H3 className="mb-1">NTN</H3>
                <Label>{userData.ntn}</Label>
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
                    <Label
                      className="switch mb-0"
                      style={{ cursor: "not-allowed" }}
                    >
                      <Input
                        type="checkbox"
                        defaultChecked={
                          accountStatus == "ACTIVE" ? true : false
                        }
                        disabled
                        style={{ cursor: "not-allowed" }}
                      />
                      <span
                        style={{ cursor: "not-allowed" }}
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
            {/* {profile?.edit && (
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
            )} */}
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default EditMyProfile;
