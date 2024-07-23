import React, { useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../../AbstractElements";
import { FaRegEdit } from "react-icons/fa";
import { PlusCircle } from "react-feather";
import AddGroupModal from "./AddGroupModal"; // Adjust the import path as necessary
import EditGroupModal from "./EditGroupModal"; // Adjust the import path as necessary
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import deleteAlert from "../../../../../../Utilities/alerts/DeleteAlert";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
}

const GroupListModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const { geofences, geofencesGroup } = useSelector(
    (state: any) => state.geofence
  );

  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [isAddGroupModalVisible, setIsAddGroupModalVisible] = useState(false);
  const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null); // State to hold the selected group
  const [latestGeofences, setLatestGeofences] = useState(geofences);

  const addToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const openAddGroupModal = () => {
    setIsAddGroupModalVisible(true);
  };

  const closeAddGroupModal = () => {
    setIsAddGroupModalVisible(false);
  };

  const openEditGroupModal = (group: any) => {
    setSelectedGroup(group);
    setIsEditGroupModalVisible(true);
  };

  const closeEditGroupModal = () => {
    setIsEditGroupModalVisible(false);
    setSelectedGroup(null); // Reset selected group when closing
  };

  const filteredGeofencesGroup = geofencesGroup.filter((group: any) =>
    group.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    setLatestGeofences(geofences);
    console.log("Called");
  }, [geofences]);

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H4 className="modal-title">Group List</H4>

            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody
            style={{
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button
                className={`btn ${
                  userPersonalizationData?.buttonsAndBarsColor == null
                    ? "btn-primary"
                    : ""
                }`}
                style={{
                  color: "white",
                  backgroundColor: `${
                    userPersonalizationData !== null &&
                    userPersonalizationData?.buttonsAndBarsColor
                  }`,
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 10px 6px 10px ",
                  marginBottom: "10px",
                }}
                onClick={openAddGroupModal}
              >
                <PlusCircle style={{ marginRight: "5px" }} />
                Create New Group
              </button>
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Search groups..."
              value={searchValue}
              onChange={handleSearchChange}
            />

            <div style={{ margin: "0px 10px" }}>
              <P>
                <span
                  style={{
                    fontWeight: "bold",
                    padding: "2px 0px",
                    fontSize: "18px",
                  }}
                >
                  Groups
                </span>
              </P>
              <div
                style={{
                  overflow: "scroll",
                  scrollbarWidth: "none",
                  height: "55vh",
                }}
              >
                {filteredGeofencesGroup.length > 0 ? (
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {filteredGeofencesGroup.map((group: any) => (
                      <li
                        key={group._id}
                        style={{
                          border: "none",
                          borderRadius: "10px",
                          padding: "8px 10px",
                          marginTop: "6px",
                          marginBottom: "6px",
                          marginRight: "2px",
                          marginLeft: "2px",
                          boxShadow: "lightgray 2px 2px 5px",
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{group.title}</span>
                        <div>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              borderRadius: "5px",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
                            onClick={() => {
                              // console.log("345678");
                              var alertData = {
                                title: "Are you sure?",
                                text: "Once deleted, you will not be able to recover this ",
                              };
                              const type = "groupType";
                              deleteAlert(alertData, group._id, type, dispatch);
                            }}
                          >
                            <MdDelete color="red" size={20} />
                          </button>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              borderRadius: "5px",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
                            onClick={() => openEditGroupModal(group)}
                          >
                            <AiFillEdit color="green" size={20} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No groups found</p>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
      <AddGroupModal
        isVisible={isAddGroupModalVisible}
        setIsVisible={setIsAddGroupModalVisible}
        geofences={latestGeofences}
      />
      {selectedGroup && (
        <EditGroupModal
          isVisible={isEditGroupModalVisible}
          setIsVisible={setIsEditGroupModalVisible}
          geofences={latestGeofences}
          group={selectedGroup}
        />
      )}
    </Col>
  );
};

export default GroupListModal;
