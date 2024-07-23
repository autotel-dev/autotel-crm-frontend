import { Provider, useDispatch, useSelector } from "react-redux";
import Routers from "./Routes";
import Store from "./ReaduxToolkit/Store";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { getAll } from "./Utilities/api";
import { setUserPersonalizationData } from "./ReaduxToolkit/Reducer/PersonalizationSlice";
import { setActiveCRMModules } from "./ReaduxToolkit/Reducer/CRMModuleSlice";
import { getUserRole } from "./Utilities/globals/globals";
import { setPermissions } from "./ReaduxToolkit/Reducer/CompanySlice";
import { setUserPermissions } from "./ReaduxToolkit/Reducer/PermissionSlice";
import { setUserData } from "./ReaduxToolkit/Reducer/UserSlice";
import { ROLES } from "./constants/roles";
import { GET_ALLOWED_MODULES, GET_ALLOWED_PERMISSIONS, GET_ALL_ACTIVE_CRM_MODULES, GET_ALL_PERMISSIONS, GET_COMPANY_PERSONALIZATION, GET_SUPERADMIN_PERSONALIZATION, GET_USER_BY_ID } from "./Utilities/api/apiEndpoints";
const App = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    // console.log(userId);
    if (token !== null) {
      getAll({
        url:
          userId == null && userId == undefined
            ? GET_SUPERADMIN_PERSONALIZATION
            : `${GET_COMPANY_PERSONALIZATION}/${userId}`,

        // url: GET_SUPERADMIN_PERSONALIZATION,
      })
        .then((parentData: any) => {
          // console.log("api call --- >", parentData);
          // console.log("undefined");
          if (parentData == undefined) {
            Swal.fire({
              text: "Failed to Fetch the personalization",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });

            dispatch(setUserPersonalizationData(null));
          }

          if (parentData !== undefined) {
            if (parentData.success) {
              dispatch(setUserPersonalizationData(parentData.data));
            }
            if (!parentData.success) {
              dispatch(setUserPersonalizationData(null));
            }
          }
        })
        .catch((error) => {
          // console.log("error== >", error);
        });

      getAll({
        url:
          getUserRole() === ROLES.COMPANY || getUserRole() === ROLES.OPERATOR
            ? GET_ALLOWED_MODULES
            : GET_ALL_ACTIVE_CRM_MODULES,
      }).then((data: any) => {
        // console.log("active Modules --- >", data);

        if (data !== undefined) {
          if (data.success) {
            // console.log("hhg");

            // console.log(userId);
            dispatch(setActiveCRMModules(data.data));
          }
        }
      });

      if (getUserRole() == ROLES.COMPANY || getUserRole() == ROLES.OPERATOR) {
        getAll({ url: GET_ALLOWED_PERMISSIONS }).then((data: any) => {
          // console.log("api call --- >", data);
          if (data !== undefined) {
            if (data.success) {
              // console.log("hhg");
              dispatch(setUserPermissions(data.data.allowedPermissions));
            }
          }
        });
      }
      dispatch(setUserData(null));
      getAll({ url: GET_USER_BY_ID }).then((parentData: any) => {
        if (parentData !== undefined) {
          if (parentData.success) {
            dispatch(setUserData(parentData.data.user));
          }
        }
      });
      if (getUserRole() === ROLES.SUPER_ADMIN) {
        getAll({ url: GET_ALL_PERMISSIONS }).then((data: any) => {
          // console.log("api call --- >", data);
          if (data !== undefined) {
            if (data.success) {
              // console.log("hhg");
              dispatch(setPermissions(data.data));
            }
          }
        });
      }
    }
  }, []);

  return (
    <>
      <Provider store={Store}>
        <Routers />
        <ToastContainer />
      </Provider>
    </>
  );
};

export default App;
// setting up production environment
