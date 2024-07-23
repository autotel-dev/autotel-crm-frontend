import React, { useEffect, useState } from "react";
import { Col, Button, Modal, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import { H4 } from "../../../../../../../../../../../../AbstractElements";

interface PropsTypes {
    isVisible: boolean;
    setIsVisible: any;
    type: string;
}

const SelectProductModel: React.FC<PropsTypes> = ({
    isVisible,
    setIsVisible = () => { },
    type
}) => {
    const { userPersonalizationData } = useSelector(
        (state: any) => state.personalization
    );
    const { geofences, geofencesGroup } = useSelector(
        (state: any) => state.geofence
    );

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
  

    const addToggle = () => {
        setIsVisible(!isVisible);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };


    // const fetchSubGroups = async (groupId: string) => {

    //     const subGroupData: any = await getAll({
    //         url: `${GET_ALL_SUBGROUPS_BY_GROUP_ID}/${groupId}`,
    //     });

    //     if (subGroupData.success) {
    //         const initialCheckedState = subGroupData.data.map((subGroup: any) => ({
    //             ...subGroup,
    //             checked: false,
    //         }));
    //         setSubGroupList(initialCheckedState);
    //         setCheckedSubGroups(initialCheckedState);
    //         setLoading(false);
    //     } else {
    //         setSubGroupList([]);
    //         setCheckedSubGroups([]);
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (group !== "") {
    //         fetchSubGroups(group);
    //     }
    // }, [isAddGroupModalVisible, isEditGroupModalVisible]);



    return (
        <Col md={6}>
            <div className="text-end">
                <Modal isOpen={isVisible} toggle={addToggle} size="lg" centered >
                    <div className="modal-header">
                        <H4 className="modal-title">Select {type}</H4>
                        <Button
                            color="transprant"
                            className="btn-close"
                            onClick={addToggle}
                        ></Button>
                    </div>
                    <ModalBody style={{ overflow: "hidden",height:"450px" }}>

                        <div style={{ margin: "0px 10px" }}>
                            <p
                                style={{
                                    fontWeight: "bold",
                                    padding: "2px ",
                                    fontSize: "18px",
                                    margin: "0px",
                                }}
                            >
                                Search {type}
                            </p>
                            <Select
                                showSearch
                                style={{ width: "100%", height: 36, marginBottom: "10px" }}
                                placeholder="Select group"
                                optionFilterProp="children"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? "")
                                //         .toLowerCase()
                                //         .includes(input.toLowerCase())
                                // }
                                // onChange={async (value: any, options: any) => {
                                //     setGroup(value === "none" ? null : value);
                                //     console.log("options", options);

                                //     setSelectedGroup(options);
                                //     setLoading(true);
                                //     await fetchSubGroups(value);
                                // }}
                                // options={[
                                //     { label: "None", value: "none" },
                                //     ...geofencesGroup.map((group: any) => ({
                                //         label: group?.title,
                                //         value: group?._id,
                                //     })),
                                // ]}
                                // value={group || undefined}
                            />
                        </div>


                    </ModalBody>
                </Modal>
            </div>

        </Col>
    );
};

export default SelectProductModel;
