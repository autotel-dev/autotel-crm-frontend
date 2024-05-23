import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Pages/Loader/Loader";
import { getUserRole } from "../Api/globals";
import { getAll } from "../Api";
import { PERMISSION_VALUES } from "../constants/permissions";
import { ROLES } from "../constants/roles";
import Swal from "sweetalert2";
import NoInternetConnection from "../Pages/NoInternetConnection/NoInternetConnection";

interface PropTypes {
  allowedUserRoles: any;
  permissionValue: any;
}

const ProtectedRoute: React.FC<PropTypes> = ({
  allowedUserRoles,
  permissionValue,
}) => {
  const { crmActiveModules } = useSelector((state: any) => state.crmModules);
  // console.log("crmActiveModules", crmActiveModules);

  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var user = userPermissions.find(
    (item: any) => item.title === permissionValue
  );
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  // console.log("userPermissions:", userPermissions);

  const [hasPermission, setHasPermission] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    //   // console.log(
    //     "protected route path here crmActiveModules: ",
    //     crmActiveModules
    //   );

    // console.log("protected route path here 2: ", window.location.pathname);
    const getLastEndpoint = (pathname: any) => {
      // Split the pathname by '/'
      var pathSegments = pathname.split("/");
      // Get the last segment
      return pathSegments[pathSegments.length - 1];
    };

    const validatePermissions = () => {


      const userRole = getUserRole(); // Assuming getUserRole() returns the user's role
      // console.log("userRole", userRole);
      // console.log("allowedUserRoles", allowedUserRoles);

      if (allowedUserRoles.includes(userRole)) {
        // console.log("permissionValue outside if dash dash 3", permissionValue);
        // console.log("userRole check");

        const pathname = window.location.pathname;
        const lastEndpoint = getLastEndpoint(pathname);

        if (pathname.includes("modules")) {
          // console.log("module keywork check");
          // console.log("In modules condition: pathname:", pathname);
          // console.log("Last Endpoint:", lastEndpoint);
          if (userRole === "COMPANY" || userRole === "OPERATOR") {
            // console.log("company or operator check");
            getAll({
              url: "user/get-allowed-modules",
            }).then((data: any) => {
              // console.log("active Modules --- >", data);

              if (data !== undefined) {
                if (
                  !data.success &&
                  data.message === "ERROR_INTERNET_DISCONNECTED"
                ) {
                  setIsConnected(true);
                }
                if (!data.success) {
                  Swal.fire({
                    text: `${data.message}`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  setLoading(false);
                  setHasPermission(false);
                  return;
                }
                if (data.success) {
                  // console.log("pathname.includes(modules)", data.data);
                  for (const item of data.data) {
                    const extractedChars = item.route
                      .substring(1)
                      .toLowerCase();
                    // console.log("extractedChars", extractedChars);

                    if (extractedChars === lastEndpoint.toLowerCase()) {
                      setLoading(false);
                      setIsConnected(false);
                      setHasPermission(true);
                      return;
                    }
                  }
                  setLoading(false);
                  setIsConnected(false);
                  setHasPermission(false);
                  return;
                }
              }
            });
          }
        } else {
          if (
            allowedUserRoles.includes(userRole) &&
            permissionValue === PERMISSION_VALUES.PROFILE
          ) {
            setLoading(false);
            setHasPermission(true);
            return;
          }
          // console.log("permissionValue outside if", permissionValue);

          if (
            permissionValue === PERMISSION_VALUES.USER ||
            permissionValue === PERMISSION_VALUES.SUPPORT ||
            permissionValue === PERMISSION_VALUES.PROFILE
          ) {
            // console.log("permissionValue inside if", permissionValue);

            getAll({
              url: "user/get-permissions",
            }).then((data: any) => {
              // console.log("user permissions --- >", data);

              if (data !== undefined) {
                if (
                  !data.success &&
                  data.message === "ERROR_INTERNET_DISCONNECTED"
                ) {
                  setIsConnected(true);
                }
                if (!data.success) {
                  Swal.fire({
                    text: `${data.message}`,
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });

                  setLoading(false);
                  setHasPermission(false);
                  return;
                }
                if (data.success) {
                  // console.log("permisionData", data.data);
                  for (const item of data.data.allowedPermissions) {
                    const itemData = item;
                    // console.log("itemData", itemData);

                    if (itemData.value === permissionValue && itemData.read) {
                      setLoading(false);
                      setIsConnected(false);
                      setHasPermission(true);
                      return;
                    }
                  }
                  setLoading(false);
                  setIsConnected(false);
                  setHasPermission(false);
                  return;
                }
              }
            });
          }
          if (permissionValue === "Settings") {
            if (userRole === ROLES.OPERATOR) {
              setLoading(false);
              setIsConnected(false);
              setHasPermission(false);
              return;
            } else {
              setLoading(false);
              setIsConnected(false);
              setHasPermission(true);
              return;
            }
          } else {
            // console.log("No modules and permissions matched ");
            setLoading(false);
            setIsConnected(false);
            setHasPermission(true);
            return;
          }
        }
      } else {
        setHasPermission(false);
        setIsConnected(false);
        setLoading(false);
        return;
      }
    };

    validatePermissions();
    // console.log("hasPermission", hasPermission);

  }, [hasPermission]);

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
  ) : isConnected ? (
    <NoInternetConnection />
  ) : hasPermission ? (
    <div style={{
      height: "100vh", overflow: "auto", backgroundColor: `${userPersonalizationData !== null &&
        userPersonalizationData?.backgroundColor !== null
        ? userPersonalizationData?.backgroundColor
        : ""
        }`,
    }}>
      <Outlet />
    </div>
  ) : (
    <Navigate to={`${process.env.PUBLIC_URL}/not-accessible`} />
  );
};

export default ProtectedRoute;
