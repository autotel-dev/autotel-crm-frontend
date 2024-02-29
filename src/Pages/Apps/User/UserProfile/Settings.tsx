import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { UserEdits, Users } from "../../../../utils/Constant";

import { useEffect, useState } from "react";
import { getAll, getImage } from "../../../../Api";
import { useDispatch } from "react-redux";
import {
  setServerPermissions,
  setUserData,
} from "../../../../ReaduxToolkit/Reducer/UserSlice";
import Loader from "../../../Loader/Loader";
import { getUserRole } from "../../../../Api/globals";
import Attachements from "./Personalization/Personalization";
import Swal from "sweetalert2";
import Personalization from "./Personalization/Personalization";

const Settings = () => {
  const dispatch = useDispatch();
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [serverPermissionsLoading, setServerPermissionsLoading] =
    useState(false);

  const [ticketImages, setTicketImages] = useState<any[]>([]);
  const [undefinedData, setUndefinedData] = useState<any>(false);
  const [isEdit, setIsEdit] = useState(false);
  // useEffect(() => {
  //   setUserDataLoading(true);
  //   setServerPermissionsLoading(true);

  //   if (getUserRole() === "COMPANY") {
  //     getAll({ url: "company/permissions" }).then((data: any) => {
  //       console.log("api call --- >", data);
  //       if (data == undefined) {
  //         setServerPermissionsLoading(false);
  //       }
  //       if (data !== undefined) {
  //         if (!data.success) {
  //           setServerPermissionsLoading(false);
  //         }
  //         if (data.success) {
  //           setServerPermissionsLoading(false);
  //           dispatch(setServerPermissions(data.data));
  //         }
  //       }
  //     });
  //   }

  //   getAll({ url: "user/get-user" }).then((parentData: any) => {
  //     console.log("api call --- >", parentData);
  //     if (parentData == undefined) {
  //       setUserDataLoading(false);
  //       setUndefinedData(true);
  //       Swal.fire({
  //         text: "Failed to Fetch",
  //         icon: "error",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //     }

  //     if (parentData !== undefined) {
  //       if (parentData.success) {
  //         setUndefinedData(false);
  //         dispatch(setUserData(parentData.data.user));
  //         if (getUserRole() === "SUPER_ADMIN") {
  //           setServerPermissionsLoading(false);
  //           setUserDataLoading(false);
  //         } else {
  //           // cnicFront
  //           getImage({
  //             url: `http://124.29.238.127:8080/${parentData.data.user.cnicFront.url}`,
  //           }).then(async (data: any) => {
  //             console.log("image api --- >", data);
  //             ticketImages.push({
  //               key: "cnicFront",
  //               url: parentData.data.user.cnicFront.url,
  //               blob: data,
  //             });
  //             console.log("Ticket Images", ticketImages);
  //             // cnicBack
  //             getImage({
  //               url: `http://124.29.238.127:8080/${parentData.data.user.cnicBack.url}`,
  //             }).then(async (data: any) => {
  //               console.log("image api --- >", data);
  //               ticketImages.push({
  //                 key: "cnicBack",
  //                 url: parentData.data.user.cnicBack.url,
  //                 blob: data,
  //               });

  //               console.log("Ticket Images", ticketImages);
  //               // ptaCertificate
  //               getImage({
  //                 url: `http://124.29.238.127:8080/${parentData.data.user.ptaCertificate.url}`,
  //               }).then(async (data: any) => {
  //                 console.log("image api --- >", data);
  //                 ticketImages.push({
  //                   key: "ptaCertificate",
  //                   url: parentData.data.user.ptaCertificate.url,
  //                   blob: data,
  //                 });

  //                 console.log("Ticket Images", ticketImages);
  //                 // ntnCertificate
  //                 getImage({
  //                   url: `http://124.29.238.127:8080/${parentData.data.user.ntnCertificate.url}`,
  //                 }).then(async (data: any) => {
  //                   console.log("image api --- >", data);
  //                   ticketImages.push({
  //                     key: "ntnCertificate",
  //                     url: parentData.data.user.ntnCertificate.url,
  //                     blob: data,
  //                   });

  //                   console.log("Ticket Images", ticketImages);

  //                   // otherAttachment
  //                   getImage({
  //                     url: `http://124.29.238.127:8080/${parentData.data.user.otherAttachment.url}`,
  //                   }).then(async (data: any) => {
  //                     console.log("image api --- >", data);
  //                     ticketImages.push({
  //                       key: "otherAttachment",
  //                       url: parentData.data.user.otherAttachment.url,
  //                       blob: data,
  //                     });

  //                     setTicketImages(ticketImages);
  //                     console.log("Ticket Images", ticketImages);
  //                     if (ticketImages.length == 5) {
  //                       setUserDataLoading(false);
  //                     }
  //                   });
  //                 });
  //               });
  //             });
  //           });
  //         }
  //       }
  //     }
  //   });
  // }, []);

  return (
    <>
      <Breadcrumbs title="Settings" mainTitle="Settings" parent="Users" />
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

export default Settings;
