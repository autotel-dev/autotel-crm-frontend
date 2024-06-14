// import React, { useState } from "react";
// import { PlusCircle } from "react-feather";
// import {
//   Col,
//   Button,
//   FormGroup,
//   Label,
//   Modal,
//   ModalBody,
//   Row,
// } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { H4, P } from "../../../../../AbstractElements";
// import { Checkbox } from "antd";
// import { create, getAll } from "../../../../../Utilities/api";
// import Swal from "sweetalert2";
// import {
//   setGeofences,
//   setGeofencesGroup,
//   setType,
// } from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";

// interface PropsTypes {
//   isVisible: boolean;
//   setIsVisible: any;
//   geofences: any[];
// }

// const AddGroupModal: React.FC<PropsTypes> = ({
//   isVisible,
//   setIsVisible = () => {},
//   geofences,
// }) => {
//   // console.log(geofences);

//   const { userPersonalizationData } = useSelector(
//     (state: any) => state.personalization
//   );
//   const dispatch = useDispatch();
//   const [geofencesList, setGeofencesList] = useState(() => {
//     // Find the geofence group with the group name 'Ungrouped'
//     const ungroupedGeofence = geofences.find(
//       (geofence) => geofence.group === "Ungrouped"
//     );

//     // If the ungrouped geofence is found, map the items to the desired format
//     if (ungroupedGeofence) {
//       return ungroupedGeofence.items.map((item: any) => ({
//         label: item?.title,
//         value: item?._id,
//         checked: false,
//       }));
//     }

//     // If no ungrouped geofence is found, return an empty array
//     return [];
//   });
//   console.log("geofencesList", geofencesList);

//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const selectAllGeofences = () => {
//     const updatedList = geofencesList.map((geofence: any) => ({
//       ...geofence,
//       checked: true,
//     }));
//     setGeofencesList(updatedList);
//   };

//   const deselectAllGeofences = () => {
//     const updatedList = geofencesList.map((geofence: any) => ({
//       ...geofence,
//       checked: false,
//     }));
//     setGeofencesList(updatedList);
//   };

//   const addToggle = () => {
//     if (!loading) {
//       setIsVisible(!isVisible);
//     }
//   };

//   const [formData, setFormData] = useState({
//     title: "",
//     //   selectedGeofences: [] as string[],
//   });

//   const onChangeHandler = (event: any) => {
//     let name = event.target.name;
//     let value = event.target.value;
//     setFormData({ ...formData, [name]: value });
//   };

//   const createGroup = async () => {
//     const groups: any = [];
//     const groupDevicesObj: any = {};
//     const initialGroupDevices: any = [];
//     const allcheckedGeofences = geofencesList
//       .filter((item: any) => item.checked)
//       .map((item: any) => item.value);

//     console.log("allcheckedGeofences", allcheckedGeofences);

//     if (formData.title !== "") {
//       try {
//         await create(
//           {
//             ...formData,
//             geofences: allcheckedGeofences,
//           },
//           {
//             url: "monitoring/geofence-group/create-group",
//           }
//         ).then((data: any) => {
//           if (data !== undefined) {
//             if (
//               !data.success &&
//               data.message === "ERROR_INTERNET_DISCONNECTED"
//             ) {
//               setLoading(false);
//             }
//             if (!data.success) {
//               Swal.fire({
//                 text: `${data.message}`,
//                 icon: "error",
//                 timer: 2000,
//                 showConfirmButton: false,
//               });
//               setLoading(false);
//             }
//             if (data.success) {
//               // console.log(data);
//               addToggle();
//               // dispatch(setCountriesStart());
//               getAll({ url: "monitoring/geofence-group/get-all-groups" }).then(
//                 (data: any) => {
//                   console.log("group-data", data);

//                   // console.log("api call --- >", data);
//                   if (data == undefined) {
//                     Swal.fire({
//                       text: "Failed to fetch due to connection refused",
//                       icon: "error",
//                       timer: 2000,
//                       showConfirmButton: false,
//                     });

//                     dispatch(setGeofencesGroup([]));
//                     return;
//                   }

//                   if (data !== undefined) {
//                     if (data.success) {
//                       dispatch(setGeofencesGroup(data.data));
//                     }
//                   }
//                 }
//               );
//               // ------------------------------------------------

//               getAll({ url: "monitoring/geofence/get-all-geofences" }).then(
//                 (data: any) => {
//                   // console.log("api call --- >", data);
//                   if (data == undefined) {
//                     Swal.fire({
//                       text: "Failed to fetch due to connection refused",
//                       icon: "error",
//                       timer: 2000,
//                       showConfirmButton: false,
//                     });

//                     dispatch(setGeofences([]));

//                     return;
//                   }
//                   // dispatch(setCountriesEnd());
//                   if (data !== undefined) {
//                     if (data.success) {
//                       // console.log("api call --- >", data);
//                       // console.log("length --- >", data.data.length);
//                       for (let i = 0; i < data.data.length; i++) {
//                         var element = "";
//                         if (data.data[i].geofenceGroup == null) {
//                           element = "Ungrouped";
//                         } else {
//                           element = data.data[i].geofenceGroup.title;
//                         }
//                         // const element = data.data[i].geofenceGroup.title;
//                         if (!groups.includes(element)) {
//                           groups.push(element);
//                         }
//                       }
//                       console.log(groups);

//                       groups.forEach((geofenceGroup: any) => {
//                         groupDevicesObj[geofenceGroup] = data.data
//                           .filter((obj: any) => {
//                             if (
//                               !obj.geofenceGroup ||
//                               !obj.geofenceGroup.title
//                             ) {
//                               return geofenceGroup === "Ungrouped";
//                             } else {
//                               return obj.geofenceGroup.title === geofenceGroup;
//                             }
//                           })
//                           .map((item: any) => ({ ...item, checked: false }));
//                       });

//                       // console.log(groups);
//                       console.log(groupDevicesObj);

//                       // Convert groupDevicesObj to initialGroupDevices array format
//                       Object.keys(groupDevicesObj).forEach((group: any) => {
//                         initialGroupDevices.push({
//                           group: group,
//                           checked: false,
//                           items: groupDevicesObj[group],
//                         });
//                       });
//                       console.log("initialGroupDevices", initialGroupDevices);

//                       dispatch(setGeofences(initialGroupDevices));
//                       setLoading(false);
//                     }
//                   }
//                 }
//               );
//             }
//           }
//         });
//         // Handle successful post creation (e.g., show a success message, redirect, etc.)
//       } catch (error: any) {
//         // Handle error (e.g., show an error message)
//         // console.error("Error creating post:", error);
//         setLoading(false);
//         addToggle();
//       }
//     } else {
//       Swal.fire({
//         text: "Please Select all the fields",
//         icon: "info",
//         timer: 2000,
//         showCancelButton: false,
//         showConfirmButton: true,
//       });
//       setLoading(false);
//     }
//   };

//   const onGeofenceChange = (checkedValue: any, index: number) => {
//     const tempList: any = [...geofencesList];
//     tempList[index] = { ...tempList[index], checked: checkedValue };
//     setGeofencesList(tempList);
//   };

//   return (
//     <Col md={6}>
//       <div className="text-end">
//         <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
//           <div className="modal-header">
//             <H4 className="modal-title">Add Group</H4>
//             <Button
//               color="transprant"
//               className="btn-close"
//               onClick={addToggle}
//             ></Button>
//           </div>
//           <ModalBody>
//             <form>
//               <div style={{ margin: "0px 10px" }}>
//                 <P>Title</P>
//                 <input
//                   className="form-control"
//                   type="text"
//                   placeholder="Enter Title"
//                   name="title"
//                   onChange={onChangeHandler}
//                 />
//                 <span style={{ color: "red" }}>
//                   {/* {errors.name && "Country name is required"} */}
//                 </span>
//               </div>
//               <div style={{ margin: "0px 10px" }}>
//                 <P>Ungrouped Geofences</P>
//                 <div style={{ display: "flex" }}>
//                   <button
//                     onClick={(e: any) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       selectAllGeofences();
//                     }}
//                     style={{
//                       width: "50%",
//                       padding: "7px 10px",
//                       borderRadius: "8px",
//                       backgroundColor: "gray",
//                       color: "white",
//                       margin: "8px 0px",
//                       marginRight: "8px",
//                       border: "0px",
//                       outline: "none",
//                       textAlign: "center",
//                     }}
//                   >
//                     Select ALL
//                   </button>
//                   <button
//                     onClick={(e: any) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       deselectAllGeofences();
//                     }}
//                     style={{
//                       width: "50%",
//                       padding: "7px 10px",
//                       borderRadius: "8px",
//                       backgroundColor: "gray",
//                       color: "white",
//                       margin: "8px 0px",

//                       border: "0px",
//                       outline: "none",
//                       textAlign: "center",
//                     }}
//                   >
//                     Deselect ALL
//                   </button>
//                 </div>

//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     margin: "10px 0px",
//                   }}
//                 >
//                   {geofencesList.map((geofence: any, index:number) => (
//                     <Checkbox
//                       key={index}
//                       value={geofence.value}
//                       checked={geofence.checked}
//                       // onChange={(e) => onGeofenceChange(e.target.checked ? [...formData.selectedGeofences, geofence.value] : formData.selectedGeofences.filter(v => v !== geofence.value))}
//                       onChange={(e) =>
//                         onGeofenceChange(e.target.checked, index)
//                       }
//                       style={{
//                         flexBasis: "20%", // 100% / 5 items per line = 20%
//                         // marginRight: "8px",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       {geofence.label}
//                     </Checkbox>
//                   ))}
//                 </div>
//               </div>
//               <div style={{ display: "flex" }}>
//                 <button
//                   onClick={(e: any) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     addToggle();
//                   }}
//                   style={{
//                     width: "50%",
//                     padding: "7px 10px",
//                     borderRadius: "8px",
//                     backgroundColor: "green",
//                     color: "white",
//                     margin: "8px",
//                     border: "0px",
//                     outline: "none",
//                     textAlign: "center",
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={(e: any) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     setLoading(true);
//                     // addToggle();
//                     createGroup();
//                   }}
//                   style={{
//                     width: "50%",
//                     padding: "7px 10px",
//                     borderRadius: "8px",
//                     backgroundColor: "green",
//                     color: "white",
//                     margin: "8px",
//                     border: "0px",
//                     outline: "none",
//                     textAlign: "center",
//                   }}
//                 >
//                   {loading ? "Loading..." : "Add"}
//                 </button>
//               </div>
//             </form>
//           </ModalBody>
//         </Modal>
//       </div>
//     </Col>
//   );
// };

// export default AddGroupModal;


import React, { useState, useEffect } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../AbstractElements";
import { create, getAll } from "../../../../../Utilities/api";
import Swal from "sweetalert2";
import {
  setGeofences,
  setGeofencesGroup,
} from "../../../../../ReaduxToolkit/Reducer/GeofenceSlice";
import { log } from "console";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  geofences: any[];
}

const AddGroupModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  geofences,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();

  const [geofencesList, setGeofencesList] = useState(() => {
    const ungroupedGeofence = geofences.find(
      (geofence) => geofence.group === "Ungrouped"
    );

    if (ungroupedGeofence) {
      return ungroupedGeofence.items.map((item: any) => ({
        label: item?.title,
        value: item?._id,
        checked: false,
      }));
    }

    return [];
  });

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "" });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const allChecked = geofencesList.every((item : any) => item.checked);
    setSelectAll(allChecked);
  }, [geofencesList]);

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const updatedList = geofencesList.map((geofence : any) => ({
      ...geofence,
      checked: checked,
    }));
    setGeofencesList(updatedList);
  };

  const onGeofenceChange = (checkedValue: boolean, index: number) => {
    const tempList = [...geofencesList];
    tempList[index] = { ...tempList[index], checked: checkedValue };
    setGeofencesList(tempList);

    const allChecked = tempList.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  const createGroup = async () => {
    const allcheckedGeofences = geofencesList
      .filter((item : any) => item.checked)
      .map((item : any) => item.value);

    if (formData.title !== "") {
      try {
        await create(
          {
            ...formData,
            geofences: allcheckedGeofences,
          },
          { url: "monitoring/geofence-group/create-group" }
        ).then((data: any) => {
          if (data.success) {
            Swal.fire({
              text: "Group created successfully",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

            getAll({ url: "monitoring/geofence-group/get-all-groups" }).then(
              (data: any) => {
                if (data.success) {
                  dispatch(setGeofencesGroup(data.data));
                }
              }
            );

            getAll({ url: "monitoring/geofence/get-all-geofences" }).then(
              (data: any) => {
                if (data.success) {
                  const groups: any = [];
                  const groupDevicesObj: any = {};
                  data.data.forEach((item: any) => {
                    const group = item.geofenceGroup
                      ? item.geofenceGroup.title
                      : "Ungrouped";
                    if (!groups.includes(group)) {
                      groups.push(group);
                    }
                    if (!groupDevicesObj[group]) {
                      groupDevicesObj[group] = [];
                    }
                    groupDevicesObj[group].push({ ...item, checked: false });
                  });

                  const initialGroupDevices = Object.keys(groupDevicesObj).map(
                    (group) => ({
                      group,
                      checked: false,
                      items: groupDevicesObj[group],
                    })
                  );

                  dispatch(setGeofences(initialGroupDevices));
                }
              }
            );

            addToggle();
          } else {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        Swal.fire({
          text: "Error creating group",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        text: "Please provide a title",
        icon: "info",
        timer: 2000,
        showConfirmButton: true,
      });
      setLoading(false);
    }
  };

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Filter geofences based on search query
  const filteredGeofences = geofencesList.filter((geofence : any) =>
    geofence.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  console.log("checking data arry");
  console.log(filteredGeofences);
  
  
  

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Group</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form>
              <div style={{ margin: "0px 10px" }}>
                <P><span style={{fontWeight:"700",}}>Title</span></P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  onChange={onChangeHandler}
                />
              </div>
              <div style={{ margin: "0px 10px" }}>
                <P><span style={{fontWeight:"700", marginTop:"10px"}}>Ungrouped Geofences</span></P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search geofences..."
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                {filteredGeofences.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", margin:"15px 0px 0px 0px" }}>
                    <label style={{ display: "flex", alignItems: "center" , fontWeight:"700"}}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                        style={{ marginRight: "8px" }}
                      />
                      Select All
                    </label>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "0px 0px",
                  }}
                >
                  {filteredGeofences.map((geofence : any, index : any) => (
                    <label
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexBasis: "20%",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={geofence.value}
                        checked={geofence.checked}
                        onChange={(e) =>
                          onGeofenceChange(e.target.checked, index)
                        }
                        style={{ marginRight: "8px" }}
                      />
                      {geofence.label}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex" , marginTop:"15px",}}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToggle();
                  }}
                  style={{
                    width: "50%",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    backgroundColor: "green",
                    color: "white",
                    margin: "8px",
                    border: "0px",
                    outline: "none",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLoading(true);
                    createGroup();
                  }}
                  style={{
                    width: "50%",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    backgroundColor: "green",
                    color: "white",
                    margin: "8px",
                    border: "0px",
                    outline: "none",
                    textAlign: "center",
                  }}
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default AddGroupModal;



