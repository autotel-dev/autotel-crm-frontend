import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { UserEdits, Users } from "../../../../utils/Constant";
import EditMyProfile from "./EditMyProfile/EditMyProfile";
import EditProfileForm from "./EditProfileForm/EditProfileForm";
import AddProjectsAndUpload from "./AddProjectsAndUpload/AddProjectsAndUpload";
import SecuritySettings from "./SecuritySettings/SecuritySettings";
import ServerPermissions from "./ServerPermissions.tsx/ServerPermissions";
import { useEffect, useRef, useState } from "react";
import { getAll, getImage } from "../../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../../Utilities/Skeleton/Skeleton";
import {
  setServerPermissions,
  setUserData,
} from "../../../../ReaduxToolkit/Reducer/UserSlice";
import Loader from "../../../Utilities/Loader/Loader";
import { getUserRole } from "../../../../Utilities/globals/globals";
import Attachements from "./Attachements/Attachements";
import Swal from "sweetalert2";
import AllowedModules from "./AllowedModules/AllowedModules";
import NoInternetConnection from "../../../Utilities/NoInternetConnection/NoInternetConnection";
import { ROLES } from "../../../../constants/roles";
import ServerCredentials from "./ServerCredentials/ServerCredentials";
import {
  GET_COMPANY_GIVEN_PERMISSION,
  GET_USER_BY_ID,
  IMAGE_BASE_URL,
} from "../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../Utilities/constants/constants";
import InactiveTimeLimit from "./InactivetimeLimit/InactiveTimeLimit";

const Account = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  const { errorData, userData } = useSelector((state: any) => state.user);
  var legalAttachements = userPermissions.find(
    (item: any) => item.title === "Legal Documents"
  );
  var serverCredentialsPermissions = userPermissions.find(
    (item: any) => item.value === "SERVER_CREDENTIALS"
  );
  // console.log("legalAttachements", legalAttachements);
  const dispatch = useDispatch();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [serverPermissionsLoading, setServerPermissionsLoading] =
    useState(true);

  const [ticketImages, setTicketImages] = useState<any[]>([]);
  const [undefinedData, setUndefinedData] = useState<any>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [notConnectedServers, setNotConnectedServers]: any = useState([]);
  const serverCredentialsComponent = useRef<HTMLDivElement | null>(null);
  const handleGoToServerCredentaisl = () => {
    if (!serverCredentialsComponent.current) return; // Ensure textareaRef.current exists
    // Scroll to the textarea
    (serverCredentialsComponent.current as HTMLDivElement).scrollIntoView({
      behavior: "smooth",
      block: "start", // Scroll to the center of the viewport
      inline: "nearest", // Scroll to the nearest edge of the viewport
    });
    // Focus on the textarea
    (serverCredentialsComponent.current as HTMLDivElement).focus();
  };

  useEffect(() => {
    setIsConnected(false);
  }, []);
  useEffect(() => {
    setUserDataLoading(true);
    setServerPermissionsLoading(true);

    if (getUserRole() === ROLES.COMPANY) {
      getAll({ url: GET_COMPANY_GIVEN_PERMISSION }).then((data: any) => {
        const serverIDs = data.data?.serverErrors?.map(
          (item: any, index: any) => {
            return item.server._id;
          }
        );
        setNotConnectedServers(serverIDs);
        // console.log("api call --- >", data);
        if (data == undefined) {
          setServerPermissionsLoading(false);
        }
        if (data !== undefined) {
          if (!data.success) {
            setServerPermissionsLoading(false);
          }
          if (data.success) {
            setServerPermissionsLoading(false);
            dispatch(setServerPermissions(data.data?.userPermissionsArray));
          }
        }
      });
    }

    getAll({ url: GET_USER_BY_ID }).then((parentData: any) => {
      if (parentData !== undefined) {
        if (!parentData.success && parentData.message === ERROR_MESSAGE) {
          setIsConnected(true);
        }
        if (!parentData.success) {
          Swal.fire({
            text: `${parentData.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setServerPermissionsLoading(false);
          setUserDataLoading(false);
        }
        if (parentData.success) {
          setUndefinedData(false);
          dispatch(setUserData(parentData.data.user));
          if (
            getUserRole() === ROLES.SUPER_ADMIN ||
            getUserRole() === ROLES.OPERATOR
          ) {
            setServerPermissionsLoading(false);
            setUserDataLoading(false);
          } else if (getUserRole() === ROLES.COMPANY) {
            // cnicFront
            getImage({
              url: `${IMAGE_BASE_URL}/${parentData.data.user.cnicFront.url}`,
            }).then(async (data: any) => {
              // console.log("image api --- >", data);

              if (parentData.data.user.cnicFront.url !== "") {
                ticketImages.push({
                  key: "cnicFront",
                  url: parentData.data.user.cnicFront.url,
                  blob: data,
                });
                setTicketImages(ticketImages);
              }
            });
            getImage({
              url: `${IMAGE_BASE_URL}/${parentData.data.user.cnicBack.url}`,
            }).then(async (data: any) => {
              if (parentData.data.user.cnicBack.url !== "") {
                ticketImages.push({
                  key: "cnicBack",
                  url: parentData.data.user.cnicBack.url,
                  blob: data,
                });
                setTicketImages(ticketImages);
              }
              // console.log("image api --- >", data);

              // console.log("Ticket Images", ticketImages);
              // ptaCertificate
            });
            getImage({
              url: `${IMAGE_BASE_URL}/${parentData.data.user.ptaCertificate.url}`,
            }).then(async (data: any) => {
              // console.log("image api --- >", data);
              if (parentData.data.user.ptaCertificate.url !== "") {
                ticketImages.push({
                  key: "ptaCertificate",
                  url: parentData.data.user.ptaCertificate.url,
                  blob: data,
                });
                setTicketImages(ticketImages);
              }
              // console.log("Ticket Images", ticketImages);
              // ntnCertificate
            });
            getImage({
              url: `${IMAGE_BASE_URL}/${parentData.data.user.ntnCertificate.url}`,
            }).then(async (data: any) => {
              // console.log("image api --- >", data);
              if (parentData.data.user.ntnCertificate.url !== "") {
                ticketImages.push({
                  key: "ntnCertificate",
                  url: parentData.data.user.ntnCertificate.url,
                  blob: data,
                });
                setTicketImages(ticketImages);
              }
              // console.log("Ticket Images", ticketImages);

              // otherAttachment
            });
            getImage({
              url: `${IMAGE_BASE_URL}/${parentData.data.user.otherAttachment.url}`,
            }).then(async (data: any) => {
              // console.log("image api --- >", data);
              if (parentData.data.user.otherAttachment.url !== "") {
                ticketImages.push({
                  key: "otherAttachment",
                  url: parentData.data.user.otherAttachment.url,
                  blob: data,
                });
                setTicketImages(ticketImages);
              }
              // console.log("Ticket Images", ticketImages);
              // if (ticketImages.length === 5) {
              //   setUserDataLoading(false);
              // }
            });
            setUserDataLoading(false);
          }
        }
      }
    });
  }, []);
  useEffect(() => {
    if (errorData) {
      handleGoToServerCredentaisl();
    }
  });

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs title={UserEdits} mainTitle={UserEdits} parent={Users} />
          <Container fluid>
            <div className="edit-profile">
              {undefinedData ? (
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
              ) : !userDataLoading && !serverPermissionsLoading ? (
                <Row>
                  <EditMyProfile />
                  <EditProfileForm />

                  {getUserRole() === ROLES.COMPANY && <AllowedModules />}
                  {getUserRole() === ROLES.COMPANY &&
                    legalAttachements !== undefined &&
                    legalAttachements?.read && (
                      <Attachements attachements={ticketImages} />
                    )}
                  {getUserRole() === ROLES.COMPANY && <ServerPermissions />}

                  <div ref={serverCredentialsComponent}>
                    {(getUserRole() === ROLES.COMPANY ||
                      getUserRole() === ROLES.OPERATOR) &&
                      serverCredentialsPermissions !== undefined &&
                      serverCredentialsPermissions?.read && (
                        <ServerCredentials
                          notConnectedServers={notConnectedServers}
                        />
                      )}
                  </div>

                  <SecuritySettings />
                  <InactiveTimeLimit />

                  {/* <AddProjectsAndUpload /> */}
                  {/* <EditMyProfile isEdit={isEdit} setIsEdit={setIsEdit} />
                <EditProfileForm isEdit={isEdit} setIsEdit={setIsEdit} /> */}
                </Row>
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
                      display: "flex",
                      height: "75vh",
                      // alignItems: "center",
                    }}
                  >
                    {/* <Loader /> */}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "35%",
                        backgroundColor: "white",
                        marginRight: "20px",
                        borderRadius: "10px",
                        padding: "0px 20px",
                      }}
                    >
                      <Skeleton
                        height="130px"
                        width="100%"
                        marginTop="30px"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="30px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="40px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="30px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="40px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="30px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="40px"
                        width="50%"
                        marginTop="10px"
                        marginBottom="10px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "65%",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        height: "55vh",
                        padding: "20px 20px",
                      }}
                    >
                      <Skeleton
                        height="75px"
                        width="100%"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="30px"
                        width="100%"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="40px"
                        width="100%"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="30px"
                        width="100%"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="40px"
                        width="100%"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginRight="20px"
                      />
                      <Skeleton
                        height="40px"
                        width="10%"
                        marginBottom="20px"
                        borderRadius="10px"
                        marginLeft="90%"
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

export default Account;
