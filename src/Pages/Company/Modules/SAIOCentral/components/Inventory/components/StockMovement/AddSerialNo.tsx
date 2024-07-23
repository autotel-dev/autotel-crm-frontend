import { PlusCircle } from "react-feather";
import { Col } from "reactstrap";
import { useState, useEffect } from "react";
import { Select } from "antd"; // Use your custom Select component
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { H3, H4, P } from "../../../../../../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Cancel } from "../../../../../../../../utils/Constant";
import { ProductType } from "./Type/ProductType";

interface AddSerialNoProps {
  addSerialModalOpen: boolean;
  setAddSerialModalOPen: any;
}

const AddSerialNo: React.FC<AddSerialNoProps> = ({
  addSerialModalOpen,
  setAddSerialModalOPen,
}) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]); // State to hold product types
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductType>();
  const addToggle = () => {
    if (!loading) {
      setAddSerialModalOPen(!addSerialModalOpen);
      reset({
        name: "",
        // productType: ""  Reset the product type field
      });
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <Modal isOpen={addSerialModalOpen} toggle={addToggle} size="md" centered>
          <div className="modal-header">
            <H4 className="modal-title">Add Serial No.</H4>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>
          <ModalBody>
            <form
              className="form-bookmark needs-validation"
              // onSubmit={handleSubmit(addCurrency)}
            >
              <Row >
                <Col >
                  <input
                  style={{ width: "100%", height: 36 ,marginLeft:"0px" }}
                    className="global-search-field"
                    type="text"
                    placeholder="Type to Search.."
                    // value={searchValue}
                    // onChange={(e) => {
                    //   handleSearch(e);
                    // }}
                  />
                </Col>
              </Row>
              <Row>
                <FormGroup className="col-md-12 create-group">
                  <P>Add Serial No.</P>
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
                    // onChange={(e: any) => {
                    //   // console.log(e);
                    //   setType(e);
                    // }}
                    // options={branchesList}
                  />
                </FormGroup>
              </Row>
              <Button color="primary" className="me-1">
                {loading ? "Loading ..." : `Save`}
              </Button>
              &nbsp;&nbsp;
              <Button
                disabled={loading ? true : false}
                color="secondary"
                onClick={addToggle}
              >
                {Cancel}
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default AddSerialNo;
