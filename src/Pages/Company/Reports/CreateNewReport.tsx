// Refactored by Antigravity - Logic Optimized, UI Preserved, New Reports Added
import { PlusCircle } from "react-feather";
import { Col, Input } from "reactstrap";
import { useEffect, useState, useMemo, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { H3, P } from "../../../AbstractElements";
import { create, getAll } from "../../../Utilities/api";
import { Select } from "antd";
import Swal from "sweetalert2";
import { ReportsType } from "./ReportsType/ReportsTypes";
import {
  setBranchesForReport,
  setOperatorsForReport,
  setProductsForReport,
  setProductTypesForReport,
  setReports,
  setWarehousesForReport,
} from "../../../ReaduxToolkit/Reducer/ReportsSlice";
import CustomDropdown from "./CustomDropdown";
import {
  GET_ALL_ACTIVE_SUB_ROLES,
  GET_ALL_ACTIVE_TYPES,
  GET_ALL_BRANCHES,
  GET_ALL_CUSTOMER_VEHICLES,
  GET_ALL_CUSTOMERS,
  GET_ALL_OPERATORS,
  GET_ALL_PRODUCT_TYPES,
  GET_ALL_PRODUCTS,
  GET_ALL_VENDORS,
  GET_ALL_WAREHOUSES,
  GET_COMPLAINT_CENTER_PRIORITY_STATUS,
  GET_COMPLAINT_CENTER_STATUS_TYPES,
  GET_REPORT_BASE_URL,
  GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT,
  GET_ALL_TRIPS_DROPDOWN,
  GET_OPERATORS_DROPDOWN,
} from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const CreateNewReport = ({ dropDownDevices }: any) => {
  const dispatch = useDispatch();
  const { userPersonalizationData } = useSelector((state: any) => state.personalization);
  const { reports, reportsType } = useSelector((state: any) => state.reports);

  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [endDate, setEndDate] = useState<string>(new Date().toISOString());
  const [startDateTime, setStartDateTime] = useState<string>(new Date().toISOString());
  const [endDateTime, setEndDateTime] = useState<string>(new Date().toISOString());

  // Filter States
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [operatorIds, setOperatorIds] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [branch, setBranch] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [vendorIds, setVendorIds] = useState<string[]>([]);
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const [customerForVehicleOperationActivity, setCustomerForVehicleOperationActivity] = useState("");
  const [vehicleIdForActivities, setVehicleIdForActivities] = useState("");
  const [activityStatus, setActivityStatus] = useState("");
  const [activityType, setActivityType] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [complaintStatus, setComplaintStatus] = useState("");
  const [complaintPriority, setComplaintPriority] = useState("");
  const [complaintDepartment, setComplaintDepartment] = useState("");
  const [availability, setAvailability] = useState(false);

  // New Report States
  const [vehicleId, setVehicleId] = useState("");
  const [tripId, setTripId] = useState("");
  const [operatorId, setOperatorId] = useState("ALL");
  const [reportVehicleIds, setReportVehicleIds] = useState<string[]>([]);

  // List States for dropdowns
  const [operatorsForReportsList, setOperatorsForReportsList] = useState<any[]>([]);
  const [productTypesForReportsList, setProductTypesForReportsList] = useState<any[]>([]);
  const [productsForReportsList, setProductsForReportsList] = useState<any[]>([]);
  const [branchesForReportsList, setBranchesForReportsList] = useState<any[]>([]);
  const [warehousesForReportsList, setWarehousesForReportsList] = useState<any[]>([]);
  const [vendorsForReportsList, setVendorsForReportsList] = useState<any[]>([]);
  const [customersForReportsList, setCustomersForReportsList] = useState<any[]>([]);
  const [customersForOperationActivitiesReportsList, setCustomersForOperationActivitiesReportsList] = useState<any[]>([]);
  const [vehiclesForOperationActivitiesReportsList, setVehiclesForOperationActivitiesReportsList] = useState<any[]>([]);
  const [complaintTypesForReportsList, setComplaintTypesForReportsList] = useState<any[]>([]);
  const [complaintStatusForReportsList, setComplaintStatusForReportsList] = useState<any[]>([]);
  const [complaintPriorityForReportsList, setComplaintPriorityForReportsList] = useState<any[]>([]);
  const [complaintDepartmentForReportsList, setComplaintDepartmentForReportsList] = useState<any[]>([]);

  // New List States
  const [vehiclesForReportsList, setVehiclesForReportsList] = useState<any[]>([]);
  const [tripsForReportsList, setTripsForReportsList] = useState<any[]>([]);
  const [operatorsDropdownList, setOperatorsDropdownList] = useState<any[]>([]);

  const formattedDevicesForAlertEvent = useMemo(() => {
    if (type === "/get-all-alert-events-report") {
      return [{
        title: "All Vehicles",
        items: (vehiclesForReportsList || []).map(v => ({
          id: v.deviceId,
          name: v.label,
          imei: v.imei || "",
          title: "All Vehicles"
        }))
      }];
    }
    return Array.isArray(dropDownDevices) ? dropDownDevices : [];
  }, [type, vehiclesForReportsList, dropDownDevices]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReportsType>();

  const resetFilters = useCallback(() => {
    setOperatorIds([]);
    setProductTypes([]);
    setProducts([]);
    setBranch("");
    setWarehouse("");
    setVendorIds([]);
    setCustomerIds([]);
    setCustomerForVehicleOperationActivity("");
    setVehicleIdForActivities("");
    setActivityStatus("");
    setActivityType("");
    setComplaintType("");
    setComplaintStatus("");
    setComplaintPriority("");
    setComplaintDepartment("");
    setAvailability(false);
    setSelectedItems([]);
    setVehicleId("");
    setTripId("");
    setOperatorId("ALL");
    setReportVehicleIds([]);
  }, []);

  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        title: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        imei: "",
      });
      setType("");
      resetFilters();
    }
  };

  const reportsTypeListMemo = useMemo(() => {
    const existing = reportsType.map((item: any) => ({
      value: item.endPoint,
      label: item.title,
      P: item.title,
    }));
    // Add new ones if not present
    const extra = [
      { value: "/get-live-alert-report", label: "Live Alert", P: "Live Alert" },
      { value: "/get-vehicle-history-report", label: "Vehicle History", P: "Vehicle History" },
      { value: "/get-event-agent-response-report", label: "Event Agent Response", P: "Event Agent Response" },
      { value: "/get-trip-detail-report", label: "Trip Detail", P: "Trip Detail" },
      { value: "/get-travel-summary-report", label: "Travel Summary", P: "Travel Summary" },
      { value: "/get-daily-travel-report", label: "Daily Travel", P: "Daily Travel" }
    ];
    extra.forEach(e => {
      if (!existing.find((x: any) => x.value === e.value)) {
        existing.push(e);
      }
    });
    return existing;
  }, [reportsType]);

  const periodList = useMemo(() => [
    { value: "Today", label: "Today", P: "Today" },
    { value: "Yesterday", label: "Yesterday", P: "Yesterday" },
    { value: "This Week", label: "This Week", P: "This Week" },
    { value: "Last Week", label: "Last Week", P: "Last Week" },
    { value: "This Month", label: "This Month", P: "This Month" },
    { value: "Last Month", label: "Last Month", P: "Last Month" },
  ], []);

  const handleDateSelection = (selectedType: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (selectedType) {
      case "Today":
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        end = new Date(today);
        break;
      case "Yesterday":
        start = new Date(today);
        start.setDate(today.getDate() - 2);
        end = new Date(today);
        end.setDate(today.getDate() - 1);
        break;
      case "Last Week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() - 6 - 7);
        end = new Date(today);
        end.setDate(today.getDate() - today.getDay() - 7);
        break;
      case "This Week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        end = new Date(today);
        break;
      case "Last Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "This Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        start = new Date();
        end = new Date();
    }
    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
    setStartDateTime(start.toISOString().slice(0, 16));
    setEndDateTime(end.toISOString().slice(0, 16));
  };

  useEffect(() => {
    handleDateSelection("Yesterday");
  }, []);

  useEffect(() => {
    if (!type) return;

    const fetchData = async () => {
      try {
        if (type === "/get-operator-performance-report") {
          const data: any = await getAll({ url: GET_ALL_OPERATORS });
          if (data?.success) {
            dispatch(setOperatorsForReport(data.data));
            setOperatorsForReportsList(data.data
              .filter((item: any) => item.subRole?.name === "Control Room")
              .map((item: any) => ({ value: item._id, label: item.fullName, P: item.fullName })));
          }
        } else if (type === "/get-inventory-report") {
          const [ptData, pData, bData, wData]: any = await Promise.all([
            getAll({ url: GET_ALL_PRODUCT_TYPES }),
            getAll({ url: GET_ALL_PRODUCTS }),
            getAll({ url: GET_ALL_BRANCHES }),
            getAll({ url: GET_ALL_WAREHOUSES })
          ]);
          if (ptData?.success) {
            dispatch(setProductTypesForReport(ptData.data));
            setProductTypesForReportsList(ptData.data.allProductTypes.map((item: any) => ({ value: item.value, label: item.title, P: item.title })));
          }
          if (pData?.success) {
            dispatch(setProductsForReport(pData.data));
            setProductsForReportsList(pData.data.map((item: any) => ({ value: item._id, label: item.name, P: item.name })));
          }
          if (bData?.success) {
            dispatch(setBranchesForReport(bData.data));
            setBranchesForReportsList(bData.data.map((item: any) => ({ value: item._id, label: item.name, P: item.name })));
          }
          if (wData?.success) {
            dispatch(setWarehousesForReport(wData.data));
            setWarehousesForReportsList(wData.data.map((item: any) => ({ value: item._id, label: item.name, P: item.name })));
          }
        } else if (type === "/get-sale-invoice-report") {
          const data: any = await getAll({ url: GET_ALL_CUSTOMERS });
          if (data?.success) setCustomersForReportsList(data.data.map((item: any) => ({ value: item._id, label: item.fullName, P: item.fullName })));
        } else if (type === "/get-purchase-invoice-report") {
          const data: any = await getAll({ url: GET_ALL_VENDORS });
          if (data?.success) setVendorsForReportsList(data.data.map((item: any) => ({ value: item._id, label: item.vendorName, P: item.vendorName })));
        } else if (type === "/get-activity-report") {
          const data: any = await getAll({ url: GET_ALL_CUSTOMERS });
          if (data?.success) setCustomersForOperationActivitiesReportsList(data.data.map((item: any) => ({ value: item._id, label: item.fullName, P: item.fullName })));
        } else if (type === "/get-complaint-report") {
          const [ctData, csData, cpData, cdData]: any = await Promise.all([
            getAll({ url: GET_ALL_ACTIVE_TYPES }),
            getAll({ url: GET_COMPLAINT_CENTER_STATUS_TYPES }),
            getAll({ url: GET_COMPLAINT_CENTER_PRIORITY_STATUS }),
            getAll({ url: GET_ALL_ACTIVE_SUB_ROLES })
          ]);
          if (ctData?.success) setComplaintTypesForReportsList(ctData.data.map((item: any) => ({ value: item?._id, label: item?.title, P: item?.title })));
          if (csData?.success) setComplaintStatusForReportsList(csData.data.internalComplaintStatusTypes.map((item: any) => ({ value: item.value, label: item.title, P: item.title })));
          if (cpData?.success) setComplaintPriorityForReportsList(cpData.data.internalComplaintPriortyStatusTypes.map((item: any) => ({ value: item.value, label: item.title, P: item.title })));
          if (cdData?.success) setComplaintDepartmentForReportsList(cdData.data.map((item: any) => ({ value: item._id, label: item.name, P: item.name })));
        } else if (type === "/get-all-alert-events-report" || type === "/get-live-alert-report" || type === "/get-vehicle-history-report" || type === "/get-trip-detail-report" || type === "/get-travel-summary-report" || type === "/get-daily-travel-report") {
          const data: any = await getAll({ url: GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT });
          if (data?.success) setVehiclesForReportsList(data.data.map((item: any) => ({ value: item._id, label: item.registrationNo, deviceId: item.traccarDeviceId || item.deviceId, imei: item.imei || "", P: item.registrationNo })));
        } else if (type === "/get-event-agent-response-report") {
          const [opData, vData]: any = await Promise.all([
            getAll({ url: GET_OPERATORS_DROPDOWN }),
            getAll({ url: GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT }),
          ]);
          if (opData?.success) setOperatorsDropdownList(opData.data.map((item: any) => ({ value: item._id, label: item.fullName, P: item.fullName })));
          if (vData?.success) setVehiclesForReportsList(vData.data.map((item: any) => ({ value: item._id, label: item.registrationNo, deviceId: item.traccarDeviceId || item.deviceId, imei: item.imei || "", P: item.registrationNo })));
        }
      } catch (error) {
        console.error("Error fetching report options:", error);
      }
    };

    fetchData();
  }, [type, dispatch]);

  useEffect(() => {
    if (customerForVehicleOperationActivity) {
      getAll({ url: `${GET_ALL_CUSTOMER_VEHICLES}/${customerForVehicleOperationActivity}` }).then((data: any) => {
        if (data?.success) {
          setVehiclesForOperationActivitiesReportsList(data.data.map((item: any) => ({ value: item._id, label: item.registrationNo, P: item.registrationNo })));
        } else {
          setVehiclesForOperationActivitiesReportsList([]);
        }
      });
    }
  }, [customerForVehicleOperationActivity]);

  useEffect(() => {
    if (type === "/get-trip-detail-report" && vehicleId) {
      getAll({ url: `${GET_ALL_TRIPS_DROPDOWN}?vehicleId=${vehicleId}` }).then((data: any) => {
        if (data?.success) {
          setTripsForReportsList(data.data.map((item: any) => ({ value: item._id, label: item.title, P: item.title })));
        } else {
          setTripsForReportsList([]);
        }
      });
    }
  }, [type, vehicleId]);

  const handleCreateReport: SubmitHandler<ReportsType> = async (formData) => {
    if (!formData.title || !type) {
      Swal.fire({ text: "Required Fields are empty", icon: "info", timer: 2000, showConfirmButton: false });
      return;
    }

    if ((type === "/get-travel-summary-report" || type === "/get-daily-travel-report") && reportVehicleIds.length === 0) {
      Swal.fire({ text: "Please select at least one vehicle", icon: "info", timer: 2000, showConfirmButton: false });
      return;
    }

    setLoading(true);
    let payload: any = {
      title: formData.title,
      fromDate: startDate,
      toDate: endDate,
    };

    switch (type) {
      case "/get-all-alert-events-report":
        payload.deviceIds = selectedItems.length > 0
          ? selectedItems.map(d => d.deviceId)
          : formattedDevicesForAlertEvent.flatMap((g: any) => g.items.map((i: any) => i.id));
        break;
      case "/get-operator-performance-report":
        payload.operatorIds = operatorIds;
        break;
      case "/get-inventory-report":
        payload = { ...payload, branch: branch || undefined, warehouse: warehouse || undefined, productId: products.length ? products : undefined, productType: productTypes.length ? productTypes : undefined, availability };
        break;
      case "/get-sale-invoice-report":
        payload.customerIds = customerIds;
        break;
      case "/get-purchase-invoice-report":
        payload.vendorIds = vendorIds;
        break;
      case "/get-inventory-lifecycle-report":
        payload.serialNumber = formData.imei;
        break;
      case "/get-activity-report":
        payload = { ...payload, vehicleId: vehicleIdForActivities, activityType, status: activityStatus };
        break;
      case "/get-complaint-report":
        payload = { ...payload, status: complaintStatus, priority: complaintPriority, type: complaintType, subRole: complaintDepartment };
        break;
      case "/get-live-alert-report":
        payload.vehicleId = vehicleId;
        break;
      case "/get-vehicle-history-report":
        payload = {
          title: formData.title,
          fromDateTime: new Date(startDateTime).toISOString(),
          toDateTime: new Date(endDateTime).toISOString(),
          deviceId: vehiclesForReportsList.find(v => v.value === vehicleId)?.deviceId || ""
        };
        break;
      case "/get-event-agent-response-report":
        payload = {
          title: formData.title,
          vehicleIds: reportVehicleIds,
          operatorId: operatorId,
          // fromDate -> start of day (12:00 AM), toDate -> end of day (11:59 PM)
          fromDate: `${startDate.slice(0, 10)}T00:00:00.000Z`,
          toDate: `${endDate.slice(0, 10)}T23:59:59.000Z`,
        };
        break;
      case "/get-trip-detail-report":
        payload = { tripId: tripId };
        break;
      case "/get-travel-summary-report":
      case "/get-daily-travel-report":
        payload = {
          title: formData.title,
          vehicleIds: reportVehicleIds,
          // fromDate -> start of day (12:00 AM), toDate -> end of day (11:59 PM)
          fromDate: `${startDate.slice(0, 10)}T00:00:00.000Z`,
          toDate: `${endDate.slice(0, 10)}T23:59:59.999Z`,
        };
        break;
    }

    try {
      const response: any = await create(payload, { url: `${GET_REPORT_BASE_URL}${type}` });
      if (response.success) {
        let newReport: any;
        if (type === "/get-trip-detail-report") {
          newReport = {
            type: type,
            data: {
              title: formData.title,
              startDate: response.data.tripInfo.start,
              endDate: response.data.tripInfo.end,
              data: response.data,
            }
          };
        } else {
          // Find registrationNo for relevant reports
          let regNo = "";
          if (type === "/get-live-alert-report" || type === "/get-vehicle-history-report") {
            regNo = vehiclesForReportsList.find((v: any) => v.value === vehicleId)?.label || "";
          }

          newReport = {
            type: type,
            data: {
              title: payload.title || formData.title,
              startDate: payload.fromDate || payload.fromDateTime || startDate,
              endDate: payload.toDate || payload.toDateTime || endDate,
              registrationNo: regNo,
              data: response.data,
            },
          };
        }
        dispatch(setReports([...reports, newReport]));
        Swal.fire({ text: "Report Generated Successfully", icon: "success", timer: 2000, showConfirmButton: false });
        addToggle();
      } else {
        Swal.fire({ text: response.message || "Failed to create report", icon: "error", timer: 2000, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ text: "Failed to create report due to connection error", icon: "error", timer: 2000, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  };

  const handleMultiSelect = (setter: Function, list: any[]) => (values: string[]) => {
    if (values.includes("All")) {
      setter(list.map(item => item.value));
    } else {
      setter(values);
    }
  };

  return (
    <Col md={6}>
      <div className="text-end">
        <button
          className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null ? "btn-primary" : ""}`}
          style={{ color: "white", backgroundColor: `${userPersonalizationData?.buttonsAndBarsColor || ""}` }}
          onClick={addToggle}
        >
          <PlusCircle /> Create New Report
        </button>
        <Modal isOpen={addModal} toggle={addToggle} size="lg" centered>
          <div className="modal-header">
            <H3 className="modal-title">Create Report</H3>
            <Button color="transparent" className="btn-close" onClick={addToggle}></Button>
          </div>
          <ModalBody style={{ minHeight: "60vh", maxHeight: "655vh" }}>
            <form className="form-bookmark needs-validation" onSubmit={handleSubmit(handleCreateReport)}>
              <Row>
                <FormGroup className="col-md-6 create-group">
                  <P>Title</P>
                  <input className="form-control" type="text" {...register("title", { required: true })} />
                  <span style={{ color: "red" }}>{errors.title && "Report title is required"}</span>
                </FormGroup>

                <FormGroup className="col-md-6 create-group">
                  <div><P>Report Type</P></div>
                  <Select
                    showSearch style={{ width: "100%" }} placeholder="Select Type" optionFilterProp="label"
                    filterOption={(input, option) => (option?.P ?? "").toString().toLowerCase().includes(input.toLowerCase())}
                    onChange={(val, opt: any) => {
                      setType(val);
                      setValue("title", opt.label);
                    }}
                    options={reportsTypeListMemo}
                  />
                </FormGroup>

                <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>Period:</div>
                  <Col md={8}>
                    <Select showSearch style={{ width: "100%" }} placeholder="Select Period" optionFilterProp="label" options={periodList} onChange={handleDateSelection} />
                  </Col>
                </FormGroup>

                {type === "/get-all-alert-events-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ marginTop: "-25px" }}>
                    <div><P>Devices</P></div>
                    <CustomDropdown data={formattedDevicesForAlertEvent} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                  </FormGroup>
                ) : type === "/get-operator-performance-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Operator:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Operator" optionFilterProp="label"
                        onChange={handleMultiSelect(setOperatorIds, operatorsForReportsList)}
                        options={[{ value: "All", label: "All" }, ...operatorsForReportsList]}
                        value={operatorIds}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-inventory-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Product Type:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Type" optionFilterProp="label"
                        onChange={handleMultiSelect(setProductTypes, productTypesForReportsList)}
                        options={[{ value: "All", label: "All" }, ...productTypesForReportsList]}
                        value={productTypes}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-purchase-invoice-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Vendors:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Vendors" optionFilterProp="label"
                        onChange={handleMultiSelect(setVendorIds, vendorsForReportsList)}
                        options={[{ value: "All", label: "All" }, ...vendorsForReportsList]}
                        value={vendorIds}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-sale-invoice-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Customers:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Customers" optionFilterProp="label"
                        onChange={handleMultiSelect(setCustomerIds, customersForReportsList)}
                        options={[{ value: "All", label: "All" }, ...customersForReportsList]}
                        value={customerIds}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-inventory-lifecycle-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>IMEI:</div>
                    <Col md={9}><input className="form-control" type="text" {...register("imei", { required: true })} /></Col>
                  </FormGroup>
                ) : type === "/get-activity-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Customer:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Customer" optionFilterProp="label" onChange={setCustomerForVehicleOperationActivity} options={customersForOperationActivitiesReportsList} value={customerForVehicleOperationActivity || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-complaint-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Complaint Type:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Type" optionFilterProp="label" onChange={setComplaintType} options={complaintTypesForReportsList} value={complaintType || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-live-alert-report" || type === "/get-vehicle-history-report" || type === "/get-trip-detail-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Vehicle:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Vehicle" optionFilterProp="label" onChange={setVehicleId} options={vehiclesForReportsList} value={vehicleId || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-event-agent-response-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Operator:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Operator" optionFilterProp="label" onChange={setOperatorId} options={[{ value: "ALL", label: "All", P: "All" }, ...operatorsDropdownList]} value={operatorId} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-travel-summary-report" || type === "/get-daily-travel-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Vehicles:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Vehicles" optionFilterProp="label"
                        onChange={handleMultiSelect(setReportVehicleIds, vehiclesForReportsList)}
                        options={[{ value: "All", label: "All" }, ...vehiclesForReportsList]}
                        value={reportVehicleIds}
                      />
                    </Col>
                  </FormGroup>
                ) : <div className="col-md-6 create-group"></div>}

                {type === "/get-vehicle-history-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Date From:</div>
                    <Col md={8}><input className="form-control" type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} /></Col>
                  </FormGroup>
                ) : (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Date From:</div>
                    <Col md={8}><input className="form-control" type="date" value={startDate.slice(0, 10)} onChange={(e) => setStartDate(new Date(e.target.value).toISOString())} /></Col>
                  </FormGroup>
                )}

                {type === "/get-inventory-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Product:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Product" optionFilterProp="label"
                        onChange={handleMultiSelect(setProducts, productsForReportsList)}
                        options={[{ value: "All", label: "All" }, ...productsForReportsList]}
                        value={products}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-activity-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Vehicle:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Vehicle" optionFilterProp="label" onChange={setVehicleIdForActivities} options={vehiclesForOperationActivitiesReportsList} value={vehicleIdForActivities || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-complaint-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Department:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Department" optionFilterProp="label" onChange={setComplaintDepartment} options={complaintDepartmentForReportsList} value={complaintDepartment || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-trip-detail-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Trips:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Trips" optionFilterProp="label" onChange={setTripId} options={tripsForReportsList} value={tripId || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-event-agent-response-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Vehicles:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple" showSearch style={{ width: "100%" }} placeholder="Select Vehicles" optionFilterProp="label"
                        onChange={handleMultiSelect(setReportVehicleIds, vehiclesForReportsList)}
                        options={[{ value: "All", label: "All" }, ...vehiclesForReportsList]}
                        value={reportVehicleIds}
                      />
                    </Col>
                  </FormGroup>
                ) : <div></div>}

                {type === "/get-vehicle-history-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Date To:</div>
                    <Col md={8}><input className="form-control" type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} /></Col>
                  </FormGroup>
                ) : (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Date To:</div>
                    <Col md={8}><input className="form-control" type="date" value={endDate.slice(0, 10)} onChange={(e) => setEndDate(new Date(e.target.value).toISOString())} /></Col>
                  </FormGroup>
                )}

                {type === "/get-inventory-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Branch:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Branch" optionFilterProp="label" onChange={setBranch} options={branchesForReportsList} value={branch || null} />
                    </Col>
                  </FormGroup>
                ) : type === "/get-activity-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Type:</div>
                    <Col md={8}>
                      <Select
                        showSearch style={{ width: "100%" }} placeholder="Select Activity Type" optionFilterProp="label" onChange={setActivityType} value={activityType || null}
                        options={[
                          { label: "Remove", value: "REMOVE" }, { label: "Transfer", value: "TRANSFER" }, { label: "Temporary Remove", value: "TEMPORARY_REMOVE" },
                          { label: "Ownership Change", value: "OWNERSHIP_CHANGE" }, { label: "Redo", value: "REDO" }, { label: "Customer Data Update", value: "CUSTOMER_DATA_UPDATE" },
                        ]}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-complaint-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Status:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Status" optionFilterProp="label" onChange={setComplaintStatus} options={complaintStatusForReportsList} value={complaintStatus || null} />
                    </Col>
                  </FormGroup>
                ) : <div></div>}

                {type === "/get-inventory-report" ? (
                  <>
                    <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>Warehouse:</div>
                      <Col md={8}>
                        <Select showSearch style={{ width: "100%" }} placeholder="Select Warehouse" optionFilterProp="label" onChange={setWarehouse} options={warehousesForReportsList} value={warehouse || null} />
                      </Col>
                    </FormGroup>
                    <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>Availability:</div>
                      <Col md={8}>
                        <Label className="switch mb-0">
                          <Input type="checkbox" checked={availability} onChange={() => setAvailability(!availability)} />
                          <span className="switch-state" style={{ backgroundColor: availability ? "green" : "red" }} />
                        </Label>
                      </Col>
                    </FormGroup>
                  </>
                ) : type === "/get-activity-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Status:</div>
                    <Col md={8}>
                      <Select
                        showSearch style={{ width: "100%" }} placeholder="Select Activity Status" optionFilterProp="label" onChange={setActivityStatus} value={activityStatus || null}
                        options={[{ value: "ASSIGNED", label: "Assigned" }, { value: "INSTALLATION", label: "Performed" }, { value: "COMPLETED", label: "Completed" }]}
                      />
                    </Col>
                  </FormGroup>
                ) : type === "/get-complaint-report" ? (
                  <FormGroup className="col-md-6 create-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Priority:</div>
                    <Col md={8}>
                      <Select showSearch style={{ width: "100%" }} placeholder="Select Priority" optionFilterProp="label" onChange={setComplaintPriority} options={complaintPriorityForReportsList} value={complaintPriority || null} />
                    </Col>
                  </FormGroup>
                ) : null}
              </Row>
              <div style={{ display: "flex", justifyContent: "start", height: "150px", alignItems: "end" }}>
                <Button color="primary" className="me-1" disabled={loading}>{loading ? "Loading ..." : "Generate"}</Button>
                <Button color="secondary" onClick={addToggle} disabled={loading}>Cancel</Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewReport;
