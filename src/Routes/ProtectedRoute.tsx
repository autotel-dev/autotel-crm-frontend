import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";
import Loader from "../Pages/Loader/Loader";
import { getUserRole } from "../Api/globals";
import { getAll } from "../Api";
import { PERMISSION_VALUES } from "../constants/permissions";
import Roles from "../Pages/Company/Roles/Roles";
import { ROLES } from "../constants/roles";
import Swal from "sweetalert2";

interface PropTypes {
  allowedUserRoles: any;
  permissionValue: any;
}

const ProtectedRoute: React.FC<PropTypes> = ({
  allowedUserRoles,
  permissionValue,
}) => {
  const { crmActiveModules } = useSelector((state: any) => state.crmModules);
  console.log("crmActiveModules", crmActiveModules);

  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var user = userPermissions.find(
    (item: any) => item.title === permissionValue
  );

  console.log("userPermissions:", userPermissions);

  const [hasPermission, setHasPermission] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //   console.log(
    //     "protected route path here crmActiveModules: ",
    //     crmActiveModules
    //   );

    console.log("protected route path here 2: ", window.location.pathname);
    const getLastEndpoint = (pathname: any) => {
      // Split the pathname by '/'
      var pathSegments = pathname.split("/");
      // Get the last segment
      return pathSegments[pathSegments.length - 1];
    };

    const validatePermissions = () => {
      const userRole = getUserRole(); // Assuming getUserRole() returns the user's role
      if (allowedUserRoles.includes(userRole)) {
        console.log("userRole check");

        const pathname = window.location.pathname;
        const lastEndpoint = getLastEndpoint(pathname);

        if (pathname.includes("modules")) {
          console.log("module keywork check");
          console.log("In modules condition: pathname:", pathname);
          console.log("Last Endpoint:", lastEndpoint);
          if (userRole == "COMPANY" || userRole == "OPERATOR") {
            console.log("company or operator check");
            getAll({
              url: "user/get-allowed-modules",
            }).then((data: any) => {
              console.log("active Modules --- >", data);

              if (data !== undefined) {
                // if (
                //   !data.success &&
                //   data.message == "ERROR_INTERNET_DISCONNECTED"
                // ) {
                //   dispatch(setIsConnected(true));
                // }
                if (!data.success) {
                  Swal.fire({
                    text: `${data.message}`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setLoading(false);
                  setHasPermission(true);
                  return;
                }
                if (data.success) {
                  console.log("pathname.includes(modules)", data.data);
                  for (const item of data.data) {
                    const extractedChars = item.route
                      .substring(1)
                      .toLowerCase();
                    console.log("extractedChars", extractedChars);

                    if (extractedChars === lastEndpoint.toLowerCase()) {
                      setLoading(false);
                      setHasPermission(true);
                      return;
                    }
                  }
                  setLoading(false);
                  setHasPermission(false);
                  return;
                }
              }
            });
          }
        } else {
          if (
            permissionValue == PERMISSION_VALUES.DASHBOARD ||
            permissionValue == PERMISSION_VALUES.USER ||
            permissionValue == PERMISSION_VALUES.SUPPORT ||
            permissionValue == PERMISSION_VALUES.PROFILE
          ) {
            if (
              userRole == ROLES.SUPER_ADMIN &&
              permissionValue == PERMISSION_VALUES.DASHBOARD
            ) {
              setLoading(false);
              setHasPermission(true);
              return;
            }
            console.log("permissions check");
            getAll({
              url: "user/get-permissions",
            }).then((data: any) => {
              console.log("user permissions --- >", data);

              if (data !== undefined) {
                if (!data.success) {
                  Swal.fire({
                    text: `${data.message}`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setLoading(false);
                  setHasPermission(true);
                  return;
                }
                if (data.success) {
                  console.log("permisionData", data.data);
                  for (const item of data.data.allowedPermissions) {
                    const itemData = item;
                    console.log("itemData", itemData);

                    if (itemData.value === permissionValue && itemData.read) {
                      setLoading(false);
                      setHasPermission(true);
                      return;
                    }
                  }
                  setLoading(false);
                  setHasPermission(false);
                  return;
                }
              }
            });
          }
          if (permissionValue == "Settings") {
            if (userRole == ROLES.OPERATOR) {
              setLoading(false);
              setHasPermission(false);
              return;
            } else {
              setLoading(false);
              setHasPermission(true);
              return;
            }
          } else {
            console.log("No modules and permissions matched ");
            setLoading(false);
            setHasPermission(true);
            return;
          }
        }
      } else {
        setHasPermission(false);
        setLoading(false);
        return;
      }
    };

    validatePermissions();
  }, [hasPermission]);

  // useEffect(() => {
  //   if (role === getUserRole()) {
  //     console.log("this", role);
  //     if (user !== undefined && user.title == title && user.read == false) {
  //       setHasPermission(false);
  //       setLoading(false);
  //       console.log("this", user);
  //       return;
  //     } else if (
  //       support !== undefined &&
  //       user.title == title &&
  //       support.read == false
  //     ) {
  //       setHasPermission(false);
  //       setLoading(false);
  //       console.log("this", support);
  //       return;
  //     } else if (
  //       profile !== undefined &&
  //       profile.title == title &&
  //       profile.read == false
  //     ) {
  //       setHasPermission(false);
  //       setLoading(false);
  //       console.log("this", profile);
  //       return;
  //     } else if (monitoring !== undefined && title == "Monitoring") {
  //       setHasPermission(false);
  //       setLoading(false);
  //       console.log("this", monitoring);
  //       return;
  //     } else if (controlRoom !== undefined && title == "Control Room") {
  //       setHasPermission(false);
  //       setLoading(false);
  //       console.log("this", controlRoom);
  //       return;
  //     }
  //   } else if (role == "OPERATOR,COMPANY,SUPER_ADMIN") {
  //     console.log("this", role);
  //     console.log("this", profile);
  //     if (
  //       profile !== undefined &&
  //       profile.title == title &&
  //       profile.read == false
  //     ) {
  //       setHasPermission(false);
  //       setLoading(false);
  //       console.log("this", profile);
  //       return;
  //     }
  //   } else {
  //     console.log("this", role);
  //     setHasPermission(false);
  //     setLoading(false);
  //     console.log("else", "else");
  //   }
  // }, []);

  return loading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "90vh",
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Loader />
      </div>
    </div>
  ) : hasPermission ? (
    <Outlet />
  ) : (
    <Navigate to={`${process.env.PUBLIC_URL}/not-accessible`} />
  );
};

export default ProtectedRoute;
