import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { UserEdits, Users } from "../../../../utils/Constant";
import EditMyProfile from "./EditMyProfile/EditMyProfile";
import EditProfileForm from "./EditProfileForm/EditProfileForm";
import AddProjectsAndUpload from "./AddProjectsAndUpload/AddProjectsAndUpload";
import SecuritySettings from "./SecuritySettings/SecuritySettings";
import ServerPermissions from "./ServerPermissions.tsx/ServerPermissions";
import { useEffect, useState } from "react";
import { IMAGE_BASE_URL, getAll, getImage } from "../../../../Api";
import { useDispatch, useSelector } from "react-redux";
import {
  setServerPermissions,
  setUserData,
} from "../../../../ReaduxToolkit/Reducer/UserSlice";
import Loader from "../../../Loader/Loader";
import { getUserRole } from "../../../../Api/globals";
import Attachements from "./Attachements/Attachements";
import Swal from "sweetalert2";
import AllowedModules from "./AllowedModules/AllowedModules";
import NoInternetConnection from "../../../NoInternetConnection/NoInternetConnection";

const Account = () => {
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var legalAttachements = userPermissions.find(
    (item: any) => item.title === "Legal Documents"
  );
  // console.log("legalAttachements", legalAttachements);
  const dispatch = useDispatch();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [serverPermissionsLoading, setServerPermissionsLoading] =
    useState(true);

  const [ticketImages, setTicketImages] = useState<any[]>([]);
  const [undefinedData, setUndefinedData] = useState<any>(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(false);
  }, []);
  useEffect(() => {
    setUserDataLoading(true);
    setServerPermissionsLoading(true);

    if (getUserRole() === "COMPANY") {
      getAll({ url: "company/permissions" }).then((data: any) => {
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
            dispatch(setServerPermissions(data.data));
          }
        }
      });
    }

    getAll({ url: "user/get-user" }).then((parentData: any) => {
      // console.log("api call --- >", parentData);
      // if (parentData == undefined) {
      //   setUserDataLoading(false);
      //   setUndefinedData(true);
      //   Swal.fire({
      //     text: "Failed to Fetch due to connection refused",
      //     icon: "error",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      // }

      if (parentData !== undefined) {
        if (
          !parentData.success &&
          parentData.message == "ERROR_INTERNET_DISCONNECTED"
        ) {
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
          if (getUserRole() === "SUPER_ADMIN" || getUserRole() === "OPERATOR") {
            setServerPermissionsLoading(false);
            setUserDataLoading(false);
          } else if (getUserRole() === "COMPANY") {
            // cnicFront
            getImage({
              url: `${IMAGE_BASE_URL}/${parentData.data.user.cnicFront.url}`,
            }).then(async (data: any) => {
              // console.log("image api --- >", data);
              ticketImages.push({
                key: "cnicFront",
                url: parentData.data.user.cnicFront.url,
                blob: data,
              });
              // console.log("Ticket Images", ticketImages);
              // cnicBack
              getImage({
                url: `${IMAGE_BASE_URL}/${parentData.data.user.cnicBack.url}`,
              }).then(async (data: any) => {
                // console.log("image api --- >", data);
                ticketImages.push({
                  key: "cnicBack",
                  url: parentData.data.user.cnicBack.url,
                  blob: data,
                });

                // console.log("Ticket Images", ticketImages);
                // ptaCertificate
                getImage({
                  url: `${IMAGE_BASE_URL}/${parentData.data.user.ptaCertificate.url}`,
                }).then(async (data: any) => {
                  // console.log("image api --- >", data);
                  ticketImages.push({
                    key: "ptaCertificate",
                    url: parentData.data.user.ptaCertificate.url,
                    blob: data,
                  });

                  // console.log("Ticket Images", ticketImages);
                  // ntnCertificate
                  getImage({
                    url: `${IMAGE_BASE_URL}/${parentData.data.user.ntnCertificate.url}`,
                  }).then(async (data: any) => {
                    // console.log("image api --- >", data);
                    ticketImages.push({
                      key: "ntnCertificate",
                      url: parentData.data.user.ntnCertificate.url,
                      blob: data,
                    });

                    // console.log("Ticket Images", ticketImages);

                    // otherAttachment
                    getImage({
                      url: `${IMAGE_BASE_URL}/${parentData.data.user.otherAttachment.url}`,
                    }).then(async (data: any) => {
                      // console.log("image api --- >", data);
                      ticketImages.push({
                        key: "otherAttachment",
                        url: parentData.data.user.otherAttachment.url,
                        blob: data,
                      });

                      setTicketImages(ticketImages);
                      // console.log("Ticket Images", ticketImages);
                      if (ticketImages.length == 5) {
                        setUserDataLoading(false);
                      }
                    });
                  });
                });
              });
            });
          }
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

                  {getUserRole() === "COMPANY" && <AllowedModules />}
                  {getUserRole() === "COMPANY" &&
                    legalAttachements !== undefined &&
                    legalAttachements?.read && (
                      <Attachements attachements={ticketImages} />
                    )}
                  {getUserRole() === "COMPANY" && <ServerPermissions />}
                  <SecuritySettings />

                  {/* <AddProjectsAndUpload /> */}
                  {/* <EditMyProfile isEdit={isEdit} setIsEdit={setIsEdit} />
                <EditProfileForm isEdit={isEdit} setIsEdit={setIsEdit} /> */}
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
        </div>
      )}
    </>
  );
};

export default Account;
