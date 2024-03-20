import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import {
  AboutMe,
  Address,
  City,
  Company,
  Country,
  EditProfile,
  Emailaddress,
  FirstName,
  Lastname,
  PostalCode,
  UpdateProfile,
  Username,
} from "../../../../../utils/Constant";
import { H3 } from "../../../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { getUserRole } from "../../../../../Api/globals";
import { getAll, update } from "../../../../../Api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { setUserData } from "../../../../../ReaduxToolkit/Reducer/UserSlice";
import { ROLES } from "../../../../../constants/roles";

// interface PropTypes {
//   isEdit: boolean;
//   setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const EditProfileForm: React.FC<PropTypes> = ({ isEdit, setIsEdit }) => {

const EditProfileForm = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var profile = userPermissions.find((item: any) => item.title === "Profile");
  console.log("profile", profile);
  const { userData } = useSelector((state: any) => state.user);
  const [name, setName] = useState<string>(userData.fullName);
  const [phoneNo, setPhoneNo] = useState<string>(userData.phoneNo);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (getUserRole() == "COMPANY") {
      setAddress(userData.address);
    }
  }, []);

  const editUserProfile = (e: any) => {
    e.preventDefault();
    if (isEdit) {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("phoneNo", phoneNo);
      if (getUserRole() == "COMPANY") {
        formData.append("address", address);
      }

      update(formData, {
        url:
          getUserRole() == "COMPANY"
            ? "company/update-company"
            : `super-admin/update-super-admin`,
      })
        .then((data: any) => {
          console.log("api call --- >", data);
          if (data !== undefined) {
            if (
              !data.success &&
              data.message == "ERROR_INTERNET_DISCONNECTED"
            ) {
              setLoading(false);
              setIsEdit(!isEdit);
            }
            if (!data.success) {
              Swal.fire({
                text: `${data.message}`,
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
              setLoading(false);
              setIsEdit(!isEdit);
            }
            if (data.success) {
              getAll({ url: "user/get-user" }).then((parentData: any) => {
                console.log("api call --- >", parentData);
                if (parentData == undefined) {
                  Swal.fire({
                    text: "Failed to Fetch",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setLoading(false);
                  setIsEdit(!isEdit);
                }

                if (parentData !== undefined) {
                  if (parentData.success) {
                    dispatch(setUserData(parentData.data.user));
                    setLoading(false);
                    setIsEdit(!isEdit);
                  }
                  if (!parentData.success) {
                    setLoading(false);
                    setIsEdit(!isEdit);
                  }
                }
              });
            }
          }
        })
        .catch((err: any) => {
          console.log("catch data", err);

          setLoading(false);
          setIsEdit(!isEdit);
        });
    }
  };
  return (
    <Col xl={8}>
      <Form className="card" onSubmit={editUserProfile}>
        <CardHeader className="pb-0">
          <H3 className="card-title mb-0">{EditProfile}</H3>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Enter Name here"
                  disabled={!isEdit}
                  defaultValue={name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  placeholder="Enter Phone Number here"
                  disabled={!isEdit}
                  defaultValue={phoneNo}
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </FormGroup>
            </Col>
            {getUserRole() == "COMPANY" && userData.address !== null && (
              <Col md={12}>
                <FormGroup>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    placeholder="Enter Address here"
                    disabled={!isEdit}
                    defaultValue={address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormGroup>
              </Col>
            )}
            {/* <Col md={5}>
              <FormGroup>
                <Label >{Company}</Label>
                <Input type="text" placeholder="Company" />
              </FormGroup>
            </Col>
            <Col sm={6} md={3} >
              <FormGroup>
                <Label>{Username}</Label>
                <Input type="text" placeholder="Username" />
              </FormGroup>
            </Col>
            <Col sm={6} md={4} >
              <FormGroup>
                <Label >{Emailaddress}</Label>
                <Input type="email" placeholder="Email" />
              </FormGroup>
            </Col>
            <Col sm={6} md={6} >
              <FormGroup>
                <Label >{FirstName}</Label>
                <Input type="text" placeholder="Company" />
              </FormGroup>
            </Col>
            <Col sm={6} md={6} >
              <FormGroup>
                <Label >{Lastname}</Label>
                <Input type="text" placeholder="Last Name" />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label >{Address}</Label>
                <Input type="text" placeholder="Home Address" />
              </FormGroup>
            </Col>
            <Col sm={6} md={4} >
              <FormGroup>
                <Label >{City}</Label>
                <Input type="text" placeholder="City" />
              </FormGroup>
            </Col>
            <Col sm={6} md={3} >
              <FormGroup>
                <Label >{PostalCode}</Label>
                <Input type="number" placeholder="ZIP Code" />
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label>{Country}</Label>
                <Input type='select' className="btn-square form-select">
                  <option>{'Select'}</option>
                  <option>{'Germany'}</option>
                  <option>{'Canada'}</option>
                  <option>{'Usa'}</option>
                  <option>{'Aus'}</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={12}>
              <Label>{AboutMe}</Label>
              <textarea className="form-control" rows={3} placeholder="Enter About your description" />
            </Col> */}
          </Row>
        </CardBody>
        {getUserRole() == ROLES.SUPER_ADMIN ? (
          <CardFooter className="text-end">
            {isEdit && (
              <Button
                style={{ marginRight: "15px" }}
                color="primary"
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setIsEdit(!isEdit);
                }}
              >
                Cancel
              </Button>
            )}

            <Button
              color="primary"
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                setIsEdit(!isEdit);
              }}
            >
              {loading ? "Loading..." : isEdit ? "Save" : "Edit"}
            </Button>
          </CardFooter>
        ) : (getUserRole() == ROLES.COMPANY ||
            getUserRole() == ROLES.OPERATOR) &&
          profile != undefined &&
          profile?.edit ? (
          <CardFooter className="text-end">
            {isEdit && (
              <Button
                style={{ marginRight: "15px" }}
                color="primary"
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setIsEdit(!isEdit);
                }}
              >
                Cancel
              </Button>
            )}

            <Button
              color="primary"
              type="submit"
              disabled={loading}
              onClick={(e) => {
                if (isEdit == false) {
                  e.preventDefault();
                  setIsEdit(!isEdit);
                }
              }}
            >
              {loading ? "Loading..." : isEdit ? "Save" : "Edit"}
            </Button>
          </CardFooter>
        ) : null}
      </Form>
    </Col>
  );
};

export default EditProfileForm;
