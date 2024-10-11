import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form, Input } from "reactstrap";

import Swal from "sweetalert2";
import { create, getAll } from "../../../../../../../../../../../Utilities/api";
import {
  CREATE_NEW_SALELEAD_VEHICLE,
  GET_ALL_SALELEADS,
  GET_SINGLE_SALELEAD,
} from "../../../../../../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../../../../../../Utilities/constants/constants";
import {
  setSaleLead,
  setSaleLeads,
} from "../../../../../../../../../../../ReaduxToolkit/Reducer/SalesSlice";
import { H4, P } from "../../../../../../../../../../../AbstractElements";
import { useSelector } from "react-redux";

const SecurityBreifingDetails = ({
  onRemove,
  index,
  securityBriefingData,
  onChange,
}: any) => {
  const [formData, setFormData] = useState(securityBriefingData);
  const { saleLead } = useSelector((state: any) => state.sales);
  // console.log("formData", formData);

  useEffect(() => {
    setFormData(securityBriefingData);
  }, [securityBriefingData]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    onChange(index, { ...formData, [name]: value });
  };

  const handleSelectChange = (name: any, value: any) => {
    setFormData({ ...formData, [name]: value });
    onChange(index, { ...formData, [name]: value });
  };

  return (
    <Form className="vehicle-form">
      <Row className="g-3">
        <Col xl={4} xs={12}>
          <P>
            Login Username
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Login Username"
            value={formData?.username}
            name="username"
            onChange={handleInputChange}
            disabled={saleLead?.vehicles?.every(
              (item: any) =>
                item?.securityBriefing?.authenticationCredentials?.username !==
                  "" &&
                item?.securityBriefing?.authenticationCredentials?.password !==
                  ""
            )}
          />
        </Col>{" "}
        <Col xl={4} xs={12}>
          <P>
            Login Password
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Login Password"
            value={formData?.password}
            name="password"
            onChange={handleInputChange}
            disabled={saleLead?.vehicles?.every(
              (item: any) =>
                item?.securityBriefing?.authenticationCredentials?.username !==
                  "" &&
                item?.securityBriefing?.authenticationCredentials?.password !==
                  ""
            )}
          />
        </Col>{" "}
        <Col xl={4} xs={12}>
          <P>
            Normal Password
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Normal Password"
            value={formData?.normalPassword}
            name="normalPassword"
            onChange={handleInputChange}
            disabled={saleLead?.vehicles?.every(
              (item: any) =>
                item?.securityBriefing?.authenticationCredentials?.username !==
                  "" &&
                item?.securityBriefing?.authenticationCredentials?.password !==
                  ""
            )}
          />
        </Col>{" "}
        <Col xl={4} xs={12}>
          <P>
            Emergency Password
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Emergency Password"
            value={formData?.emergencyPassword}
            name="emergencyPassword"
            onChange={handleInputChange}
            disabled={saleLead?.vehicles?.every(
              (item: any) =>
                item?.securityBriefing?.authenticationCredentials?.username !==
                  "" &&
                item?.securityBriefing?.authenticationCredentials?.password !==
                  ""
            )}
          />
        </Col>
        <Col xl={4} xs={12}>
          <P>
            Mother Name
            <span className="txt-danger">*</span>
          </P>
          <Input
            type="text"
            placeholder="Enter Mother Name"
            value={formData?.motherName}
            name="motherName"
            onChange={handleInputChange}
            disabled={saleLead?.vehicles?.every(
              (item: any) =>
                item?.securityBriefing?.authenticationCredentials?.username !==
                  "" &&
                item?.securityBriefing?.authenticationCredentials?.password !==
                  ""
            )}
          />
        </Col>
        {/* 
                <Col
                    xs={12}
                    className="text-end d-flex justify-content-end gap-2 align-center"
                >
                    {
                        saleLead.vehicles.find((item: any, i: number) => formData.registrationNo == item.registrationNo) ? <>
                            <Button color="primary" onClick={() => setIsCreated(!isCreated)}>
                                {isCreated ? "Edit" : "Save"}
                            </Button></> : <>
                            <Button color="primary" disabled={isCreated} onClick={() => !isCreated ? createVehicle() : null}>
                                {isCreated ? "Created" : loading ? "Loading..." : "Save"}
                            </Button>

                            {!isCreated && < Button color="danger" onClick={() => onRemove(index)}>
                                Remove
                            </Button>}
                        </>
                    }

                </Col> */}
      </Row>
    </Form>
  );
};

export default SecurityBreifingDetails;
