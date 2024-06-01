import React, { useState } from "react";
import { PlusCircle } from "react-feather";
import {
  Col,
  Button,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H4, P } from "../../../../../AbstractElements";
import { Checkbox } from "antd";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
  geofencesList: any[];
  setGeofencesList: any;
}

const AddGroupModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  geofencesList,
  setGeofencesList,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectAllGeofences = () => {
    const updatedList = geofencesList.map((geofence) => ({
      ...geofence,
      checked: true,
    }));
    setGeofencesList(updatedList);
  };

  const deselectAllGeofences = () => {
    const updatedList = geofencesList.map((geofence) => ({
      ...geofence,
      checked: false,
    }));
    setGeofencesList(updatedList);
  };

  const addToggle = () => {
    if (!loading) {
      setIsVisible(!isVisible);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    //   selectedGeofences: [] as string[],
  });

  const onChangeHandler = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const onGeofenceChange = (checkedValue: any, index: number) => {
    const tempList = [...geofencesList];
    tempList[index] = { ...tempList[index], checked: checkedValue };
    setGeofencesList(tempList);
    //   setFormData({ ...formData, selectedGeofences: checkedValues });
  };

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
                <P>Title</P>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  onChange={onChangeHandler}
                />
                <span style={{ color: "red" }}>
                  {/* {errors.name && "Country name is required"} */}
                </span>
              </div>
              <div style={{ margin: "0px 10px" }}>
                <P>Ungrouped Geofences</P>
                <div style={{ display: "flex" }}>
                <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectAllGeofences();
                    }}
                    style={{
                      width: "50%",
                      padding: "7px 10px",
                      borderRadius: "8px",
                      backgroundColor: "gray",
                      color: "white",
                      margin: "8px 0px",
                      marginRight: "8px",
                      border: "0px",
                      outline: "none",
                      textAlign: "center",
                    }}
                  >
                    Select ALL
                  </button>
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deselectAllGeofences();
                    }}
                    style={{
                      width: "50%",
                      padding: "7px 10px",
                      borderRadius: "8px",
                      backgroundColor: "gray",
                      color: "white",
                      margin: "8px 0px",
                     
                      border: "0px",
                      outline: "none",
                      textAlign: "center",
                    }}
                  >
                    Deselect ALL
                  </button>
                
                </div>

                <div style={{ display: "flex", flexWrap: "wrap",margin:"10px 0px", }}>
                  {geofencesList.map((geofence, index) => (
                    <Checkbox
                      key={index}
                      value={geofence.value}
                      checked={geofence.checked}
                      // onChange={(e) => onGeofenceChange(e.target.checked ? [...formData.selectedGeofences, geofence.value] : formData.selectedGeofences.filter(v => v !== geofence.value))}
                      onChange={(e) =>
                        onGeofenceChange(e.target.checked, index)
                      }
                      style={{
                        flexBasis: "20%", // 100% / 5 items per line = 20%
                        // marginRight: "8px",
                        marginBottom: "8px"
                      }}
                    >
                      {geofence.label}
                    </Checkbox>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <button
                  onClick={(e: any) => {
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
                  onClick={(e: any) => {
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
                  Add
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
