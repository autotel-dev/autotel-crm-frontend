import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Modal, ModalBody, Row } from "reactstrap";
import { H4, P } from "../../../../../../../../AbstractElements";
import Swal from "sweetalert2";
import { Select } from "antd"; // Use your custom Select component
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../utils/Constant";
import { getAll } from "../../../../../../../../Utilities/api";
import {
  GET_ALL_WAREHOUSES,
  GET_ALL_BRANCHES,
  GET_ALL_ACTIVE_WAREHOUSES,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import AddSerialNo from "./AddSerialNo";
import { MdOutlineMinorCrash } from "react-icons/md";

interface CreateNewStockMovementModalProps {
  branches: any;
  warehouses: any;
}

const CreateNewStockMovementModal: React.FC<
  CreateNewStockMovementModalProps
> = ({ branches, warehouses }) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addSerialModalOpen, setAddSerialModalOPen] = useState(false);
  const [type, setType] = useState("");
  const [branchesList, setBranchesList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const stockMovementTypeList = [
    { label: "Warehouse To Warehouse", value: "Warehouse To Warehouse" },
    { label: "Branch To Branch", value: "Branch To Branch" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        type: "",
        from: "",
        to: "",
        product: "",
        comments: "",
      });
      setType("");
    }
  };

  const handleTypeChange = (value: any) => {
    setType(value);
  };

  const saveStockMovement: SubmitHandler<any> = async (data) => {
    setLoading(true);
    // Implement the save functionality here
    setLoading(false);
    setAddModal(false);
    reset({
      type: "",
      from: "",
      to: "",
      product: "",
      comments: "",
    });
  };

  const tempBranchesList: any = [];
  const tempWareHousesList: any = [];

  useEffect(() => {
    branches.map((item: any, index: any) => {
      tempBranchesList.push({
        value: `${item._id}`,
        label: `${item.name}`,
      });
    });
    setBranchesList(tempBranchesList);
  }, []);
  useEffect(() => {
    warehouses.map((item: any, index: any) => {
      tempWareHousesList.push({
        value: `${item._id}`,
        label: `${item.name}`,
      });
    });
    setWarehousesList(tempWareHousesList);
  }, []);

  return (
    <Col md={6}>
      <div className="text-end">
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
          }}
          onClick={addToggle}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <PlusCircle
              size={18}
              style={{
                marginRight: "5px",
              }}
            />
            Create New Stock Movement
          </span>
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Create New Stock Movement</H4>
            <Button
              color="transparent"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(saveStockMovement)}
            >
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Types</P>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    onChange={(e: any) => {
                      // console.log(e);
                      setType(e);
                    }}
                    options={stockMovementTypeList}
                  />
                </FormGroup>
              </Row>
              {type == "Warehouse To Warehouse" && (
                <>
                  <Row>
                    <FormGroup className="col-md-6 create-group">
                      <P>From Warehouse</P>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="From Warehouse"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any) => {
                          setType(e);
                        }}
                        options={warehousesList}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-6 create-group">
                      <P>To Warehouse</P>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="To Warehouse"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        // onChange={(e: any) => {
                        //   // console.log(e);
                        //   setType(e);
                        // }}
                        options={warehousesList}
                      />
                    </FormGroup>
                  </Row>
                </>
              )}
              {type == "Branch To Branch" && (
                <>
                  <Row>
                    <FormGroup className="col-md-6 create-group">
                      <P>From Branch</P>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="From Branch"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        // onChange={(e: any) => {
                        //   // console.log(e);
                        //   setType(e);
                        // }}
                        options={branchesList}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-6 create-group">
                      <P>To Branch</P>
                      <Select
                        showSearch
                        style={{ width: "100%", height: 36 }}
                        placeholder="To Branch"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        // onChange={(e: any) => {
                        //   // console.log(e);
                        //   setType(e);
                        // }}
                        options={branchesList}
                      />
                    </FormGroup>
                  </Row>
                </>
              )}
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Product</P>
                  <Select
                    showSearch
                    style={{ width: "100%", height: 36 }}
                    placeholder="Select Product"
                    optionFilterProp="children"
                    filterOption={(input: any, option: any) =>
                      (option?.P ?? "").includes(input)
                    }
                    filterSort={(optionA: any, optionB: any) =>
                      (optionA?.P ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.P ?? "").toLowerCase())
                    }
                    // onChange={(e: any) => {
                    //   // console.log(e);
                    //   setType(e);
                    // }}
                    // options={branchesList}
                  />
                </FormGroup>
              </Row>
              <Row>
                <P>Quantity</P>
                <FormGroup
                  className="col-md-12 create-group"
                  style={{ display: "flex" }}
                >
                  <div style={{ width: "85%", paddingRight: "10px" }}>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Quantity Here..."
                      // {...register("comments")}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      className={`btn ${
                        userPersonalizationData?.buttonsAndBarsColor == null
                          ? "btn-primary"
                          : ""
                      }`}
                      style={{
                        color: "white",
                        marginTop: "0px",
                        backgroundColor: `${
                          userPersonalizationData !== null &&
                          userPersonalizationData?.buttonsAndBarsColor
                        }`,
                      }}
                      onClick={() => {
                        setAddSerialModalOPen(true);
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "1px",
                        }}
                      >
                        <MdOutlineMinorCrash size={20} />
                      </span>
                    </button>
                  </div>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Comments</P>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Comments Here..."
                    {...register("comments")}
                  />
                </FormGroup>
              </Row>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Save`}
              </Button>
              &nbsp;&nbsp;
              <Button disabled={loading} color="secondary" onClick={addToggle}>
                {Cancel}
              </Button>
            </form>
          </ModalBody>
        </Modal>
        {addSerialModalOpen && (
          <AddSerialNo
            addSerialModalOpen={addSerialModalOpen}
            setAddSerialModalOPen={setAddSerialModalOPen}
          />
        )}
      </div>
    </Col>
  );
};

export default CreateNewStockMovementModal;
