import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CommonHeader from "../../../../../Common/CommonHeader";
import { H5, H6, Image, P, H4 } from "../../../../../AbstractElements";
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
import { ROLES } from "../../../../../constants/roles";

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
        <CardHeader className="pb-0">
          <H4 className="card-title mb-0">My Profile</H4>
        </CardHeader>
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
                <H5 className="mb-1">{userData.fullName}</H5>
                <P className="mb-4">{formatUnderscoredString(userData.role)}</P>
              </Col>
            </Row>

            <FormGroup>
              <H5 className="mb-1">Email Address</H5>
              <P>{userData.emailAddress}</P>
            </FormGroup>
            <FormGroup>
              <H5 className="mb-1">Phone Number</H5>
              <P>{userData.phoneNo}</P>
            </FormGroup>
            {getUserRole() === ROLES.COMPANY && userData.address !== null && (
              <FormGroup>
                <H5 className="mb-1">{userData.address}</H5>
                <P>Address</P>
              </FormGroup>
            )}
            {getUserRole() === ROLES.COMPANY && userData.gstNo !== null && (
              <FormGroup>
                <H5 className="mb-1">Gst No</H5>
                <P>{userData.gstNo}</P>
              </FormGroup>
            )}
            {getUserRole() === ROLES.COMPANY && userData.ntn !== null && (
              <FormGroup>
                <H5 className="mb-1">NTN</H5>
                <P>{userData.ntn}</P>
              </FormGroup>
            )}

            <FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <H5>Account Status</H5>
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
                          accountStatus === "ACTIVE" ? true : false
                        }
                        disabled
                        style={{ cursor: "not-allowed" }}
                      />
                      <span
                        style={{ cursor: "not-allowed" }}
                        className={`switch-state ${
                          accountStatus === "ACTIVE"
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
