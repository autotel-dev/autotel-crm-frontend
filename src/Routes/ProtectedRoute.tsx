import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";
import Loader from "../Pages/Loader/Loader";
import { getUserRole } from "../Api/globals";

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

  // const validatePermissions = ()=>{

  //   if(allowedUserRoles.includes(getUserRole())){

  //     setHasPermission(true)
  //   }
  //   else{
  //     setHasPermission(false);
  //   }
  // }

  useEffect(() => {
    console.log("protected route path here crmActiveModules: ", crmActiveModules)
    
    console.log("protected route path here 2: ", window.location.pathname)
    const getLastEndpoint = (pathname:any) => {
      // Split the pathname by '/'
      var pathSegments = pathname.split('/');
      // Get the last segment
      return pathSegments[pathSegments.length - 1];
  };
  
  
  const validatePermissions = () => {
      const userRole = getUserRole(); // Assuming getUserRole() returns the user's role
      if (allowedUserRoles.includes(userRole)) {
          const pathname = window.location.pathname;
          const lastEndpoint = getLastEndpoint(pathname);
  
          if (pathname.includes("modules")) {
              console.log("In modules condition: pathname:", pathname);
              console.log("Last Endpoint:", lastEndpoint);

              console.log(" In modules condition crmActiveModules: ", crmActiveModules)
  
              const data = crmActiveModules.find((module:any) => module.name.replaceAll("/", "") === lastEndpoint);
              console.log("Condition Data:", data);
  
              setLoading(false);
              setHasPermission(true);
          } else {
              // Check user permissions here
              setLoading(false);
              setHasPermission(true);
          }
      } else {
          setHasPermission(false);
          setLoading(false);
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
    <Loader />
  ) : hasPermission ? (
    <Outlet />
  ) : (
    <Navigate to={`${process.env.PUBLIC_URL}/not-accessible`} />
  );
};

export default ProtectedRoute;
