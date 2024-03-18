import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { UserEdits, Users } from "../../../../utils/Constant";

import { useEffect, useState } from "react";
import { getAll, getImage } from "../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setServerPermissions,
  setUserData,
} from "../../../../ReaduxToolkit/Reducer/UserSlice";
import Loader from "../../../Loader/Loader";
import Attachements from "./Personalization/Personalization";
import Swal from "sweetalert2";
import Personalization from "./Personalization/Personalization";
import {
  getOperatorCompanyUserId,
  getUserId,
  getUserRole,
} from "../../../../Api/globals";
import {
  setIsConnected,
  setUserPersonalizationData,
} from "../../../../ReaduxToolkit/Reducer/PersonalizationSlice";
import NoInternetConnection from "../../../NoInternetConnection/NoInternetConnection";

const Settings = () => {
  const { userPersonalizationData, isConnected } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [serverPermissionsLoading, setServerPermissionsLoading] =
    useState(false);

  // const [ticketImages, setTicketImages] = useState<any[]>([]);
  // const [undefinedData, setUndefinedData] = useState<any>(false);
  const [loading, setLoading] = useState<any>(true);
  // const [personalizationImages, setPersonalizationImages] = useState<any[]>([]);
  const [undefinedData, setUndefinedData] = useState<any>(false);

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  useEffect(() => {
    getAll({
      url:
        getUserRole() == "COMPANY"
          ? `company/get-personalization/${getUserId()}`
          : getUserRole() == "OPERATOR"
          ? `company/get-personalization/${getOperatorCompanyUserId()}`
          : "super-admin/get-personalization",
    }).then((parentData: any) => {
      console.log("api call --- >", parentData);
      // if (parentData == undefined) {
      //   setUndefinedData(true);
      //   Swal.fire({
      //     text: "Failed to Fetch due to connection refused",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      //   setLoading(false);
      //   dispatch(setUserPersonalizationData(null));
      // }

      if (parentData !== undefined) {
        if (
          !parentData.success &&
          parentData.message == "ERROR_INTERNET_DISCONNECTED"
        ) {
          dispatch(setIsConnected(true));
        }
        if (!parentData.success) {
          Swal.fire({
            text: `${parentData.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
          setUndefinedData(false);
          dispatch(setUserPersonalizationData(null));
        }
        if (parentData.success) {
          dispatch(setUserPersonalizationData(parentData.data));
          setUndefinedData(false);
          setLoading(false);
        }
      }
    });
  }, []);

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs title="Settings" mainTitle="Settings" parent="Users" />
          <Container fluid>
            <div className="edit-profile">
              {!loading ? (
                !undefinedData ? (
                  <Row>
                    {/* <Profile />
            <WilliamProfile />
            <Profile2 />
            <ProfileDetails />
            <DetailImg /> */}

                    <Personalization />
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
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      No Data Found
                    </div>
                  </div>
                )
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
        </div>
      )}
    </>
  );
};

export default Settings;
