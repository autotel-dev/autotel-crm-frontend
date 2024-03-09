import { Provider, useDispatch, useSelector } from "react-redux";
import Routers from "./Routes";
import Store from "./ReaduxToolkit/Store";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { getAll } from "./Api";
import { setUserPersonalizationData } from "./ReaduxToolkit/Reducer/PersonalizationSlice";
import { setActiveCRMModules } from "./ReaduxToolkit/Reducer/CRMModuleSlice";
import { getUserRole } from "./Api/globals";
import { setPermissions } from "./ReaduxToolkit/Reducer/CompanySlice";
import { setUserPermissions } from "./ReaduxToolkit/Reducer/PermissionSlice";
const App = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log(userId);
    if (token !== null) {
      getAll({
        url:
          userId == null && userId == undefined
            ? "super-admin/get-personalization"
            : `company/get-personalization/${userId}`,

        // url: "super-admin/get-personalization",
      })
        .then((parentData: any) => {
          console.log("api call --- >", parentData);
          console.log("undefined");
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
          console.log("error== >", error);
        });

      getAll({
        url:
          getUserRole() == "COMPANY" || getUserRole() == "OPERATOR"
            ? "user/get-allowed-modules"
            : "crm-module/get-all-active-modules",
      }).then((data: any) => {
        console.log("active Modules --- >", data);

        if (data !== undefined) {
          if (data.success) {
            console.log("hhg");

            console.log(userId);
            dispatch(setActiveCRMModules(data.data));
          }
        }
      });

      if (getUserRole() == "COMPANY" || getUserRole() == "OPERATOR") {
        getAll({ url: "user/get-permissions" }).then((data: any) => {
          console.log("api call --- >", data);
          if (data !== undefined) {
            if (data.success) {
              console.log("hhg");
              dispatch(setUserPermissions(data.data.allowedPermissions));
            }
          }
        });
      }
      if (getUserRole() == "SUPER_ADMIN") {
        getAll({ url: "permissions/get-all-permissions" }).then((data: any) => {
          console.log("api call --- >", data);
          if (data !== undefined) {
            if (data.success) {
              console.log("hhg");
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
