import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { UserEdits, Users } from "../../../../utils/Constant";
import EditMyProfile from "./EditMyProfile/EditMyProfile";
import EditProfileForm from "./EditProfileForm/EditProfileForm";
import AddProjectsAndUpload from "./AddProjectsAndUpload/AddProjectsAndUpload";
import SecuritySettings from "./SecuritySettings/SecuritySettings";
import ServerPermissions from "./ServerPermissions.tsx/ServerPermissions";
import { useEffect, useState } from "react";
import { getAll } from "../../../../Api";
import { useDispatch } from "react-redux";
import {
  setServerPermissions,
  setUserData,
} from "../../../../ReaduxToolkit/Reducer/UserSlice";
import Loader from "../../../Loader/Loader";
import { getUserRole } from "../../../../Api/globals";

const UserEdit = () => {
  const dispatch = useDispatch();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [serverPermissionsLoading, setServerPermissionsLoading] =
    useState(true);
  useEffect(() => {
    setUserDataLoading(true);
    setServerPermissionsLoading(true);

    if (getUserRole() === "COMPANY") {
      getAll({ url: "company/permissions" }).then((data: any) => {
        console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            setServerPermissionsLoading(false);
            dispatch(setServerPermissions(data.data));
          }
        }
      });
    }

    getAll({ url: "user/get-user" }).then((data: any) => {
      console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          setUserDataLoading(false);
          if (getUserRole() === "SUPER_ADMIN") {
            setServerPermissionsLoading(false);
          }

          dispatch(setUserData(data.data.user));
        }
      }
    });
  }, []);

  return (
    <>
      <Breadcrumbs title={UserEdits} mainTitle={UserEdits} parent={Users} />
      <Container fluid>
        <div className="edit-profile">
          {!userDataLoading && !serverPermissionsLoading ? (
            <Row>
              <EditMyProfile />
              <EditProfileForm />
              {/* <AddProjectsAndUpload /> */}

              {getUserRole() === "COMPANY" && <ServerPermissions />}
              <SecuritySettings />
            </Row>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "80vh",
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Loader />
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default UserEdit;
