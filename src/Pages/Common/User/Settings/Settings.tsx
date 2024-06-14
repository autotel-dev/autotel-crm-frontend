import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { UserEdits, Users } from "../../../../utils/Constant";

import { useEffect, useState } from "react";
import { getAll, getImage } from "../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../../Utilities/Skeleton/Skeleton";
import {
  setServerPermissions,
  setUserData,
} from "../../../../ReaduxToolkit/Reducer/UserSlice";
import Loader from "../../../Utilities/Loader/Loader";
import Attachements from "./Personalization/Personalization";
import Swal from "sweetalert2";
import Personalization from "./Personalization/Personalization";
import {
  getOperatorCompanyUserId,
  getUserId,
  getUserRole,
} from "../../../../Utilities/globals/globals";
import {
  setIsConnected,
  setUserPersonalizationData,
} from "../../../../ReaduxToolkit/Reducer/PersonalizationSlice";
import NoInternetConnection from "../../../Utilities/NoInternetConnection/NoInternetConnection";
import { ROLES } from "../../../../constants/roles";
import { GET_COMPANY_PERSONALIZATION, GET_SUPERADMIN_PERSONALIZATION } from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";

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
        getUserRole() === ROLES.COMPANY
          ? `${GET_COMPANY_PERSONALIZATION}/${getUserId()}`
          : getUserRole() === ROLES.OPERATOR
          ? `${GET_COMPANY_PERSONALIZATION}/${getOperatorCompanyUserId()}`
          : GET_SUPERADMIN_PERSONALIZATION,
    }).then((parentData: any) => {
      // console.log("api call --- >", parentData);
      if (parentData == undefined) {
        // setUndefinedData(true);
        Swal.fire({
          text: "No personalization found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
        dispatch(setUserPersonalizationData(null));
      }

      if (parentData !== undefined) {
        if (
          !parentData.success &&
          parentData.message === ERROR_MESSAGE
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
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                //   height: "80vh",
                //   backgroundColor: "white",
                //   alignItems: "center",
                // }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      height: "75vh",
                      // alignItems: "center",
                    }}
                  >
                    {/* <Loader /> */}

                    <div
                      style={{
                        display: "flex",
                        // flexDirection: "column",
                        width: "100%",
                        backgroundColor: "white",
                        marginTop: "40px",
                        padding: "20px 20px",
                      }}
                    >
                    
                      <Skeleton
                        height="40px"
                        width="100%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                       <Skeleton
                        height="40px"
                        width="100%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                      
                      <Skeleton
                        height="40px"
                        width="100%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                      <Skeleton
                        height="40px"
                        width="100%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                     
                    </div>
                    <div style={{backgroundColor:"white"}}>
                    <Skeleton
                        height="30px"
                        width="20%"
                        marginLeft="20px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                    </div>
                  
                    <div
                      style={{
                        display: "flex",
                        // flexDirection: "column",
                        width: "100%",
                        backgroundColor: "white",
                        padding: "20px 20px",
                      }}
                    >
                    
                      <Skeleton
                        height="40px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                       <Skeleton
                        height="40px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                     
                     
                    </div>
                    <div
                      style={{
                        display: "flex",
                        // flexDirection: "column",
                        width: "100%",
                        backgroundColor: "white",
                        padding: "20px 20px",
                      }}
                    >
                    
                      <Skeleton
                        height="50px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                       <Skeleton
                        height="50px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                      <Skeleton
                        height="50px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                        borderRadius="5px"
                      />
                     
                     
                    </div>
                    <div
                      style={{
                        display: "flex",
                        // flexDirection: "column",
                        width: "100%",
                        backgroundColor: "white",
                        padding: "20px 20px",
                      }}
                    >
                    
                      <Skeleton
                        height="50px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                      />
                       <Skeleton
                        height="50px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="50px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        marginRight="20px"
                      />
                     
                     
                    </div>
                    
                    
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
