import { PlusCircle } from "react-feather";
import { Col, Input } from "reactstrap";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormGroup, Label, Modal, ModalBody, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { H3, P } from "../../../../../../AbstractElements";
import { create, getAll } from "../../../../../../Utilities/api";

import { jwtDecode } from "jwt-decode";
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
} from "../../../../../../ReaduxToolkit/Reducer/ReportsSlice";
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
} from "../../../../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../../../../Utilities/constants/constants";

const CreateNewReport = ({ dropDownDevices }: any) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization,
  );
  const { reports, reportsType } = useSelector((state: any) => state.reports);
  var tempReports: any = [...reports];
  const [decodedToken, setDecodedToken]: any = useState(null);
  const authToken = localStorage.getItem("token");
  useEffect(() => {
    if (authToken !== null) {
      const decodedToken = jwtDecode(authToken);
      // console.log(decodedToken);
      setDecodedToken(decodedToken);
    }
  }, []);

  useEffect(() => {
    tempReports = [...reports];
  }, [reports]);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReportsType>();
  const [addModal, setAddModal] = useState(false);
  const addToggle = () => {
    if (!loading) {
      setAddModal(!addModal);
      reset({
        title: "",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        imei: "",
      });
      setRole("");
      setLoading(false);
    }
  };
  const [selectedItems, setSelectedItems]: any = useState([]);

  const [reportsTypeList, setReportsType] = useState([]);
  const [role, setRole] = useState("");

  // const typeList: any = [reportsType];
  const [type, setType] = useState("");
  const tempReportsTypeList: any = [];
  useEffect(() => {
    reportsType.map((item: any, index: any) => {
      tempReportsTypeList.push({
        value: `${item.endPoint}`,
        label: `${item.title}`,
      });
    });
    setReportsType(tempReportsTypeList);
  }, [reportsType]);

  const [reportPeriodList, setReportPeriodType] = useState([]);

  const periodList: any = [
    { _id: 1, name: "Today" },
    { _id: 2, name: "Yesterday" },
    { _id: 3, name: "This Week" },
    { _id: 4, name: "Last Week" },
    { _id: 5, name: "This Month" },
    { _id: 6, name: "Last Month" },
  ];
  const tempReportPeriodList: any = [];
  useEffect(() => {
    periodList.map((item: any, index: any) => {
      tempReportPeriodList.push({
        value: `${item.name}`,
        P: `${item.name}`,
      });
    });
    setReportPeriodType(tempReportPeriodList);
  }, []);

  const [operatorsForReportsList, setOperatorsForReportsList]: any = useState(
    [],
  );
  const [productsForReportsList, setProductsForReportsList]: any = useState([]);
  const [productTypesForReportsList, setProductTypesForReportsList]: any =
    useState([]);
  const [branchesForReportsList, setBranchesForReportsList]: any = useState([]);
  const [warehousesForReportsList, setWarehousesForReportsList]: any = useState(
    [],
  );
  const [vendorsForReportsList, setVendorsForReportsList]: any = useState([]);
  const [customersForReportsList, setCustomersForReportsList]: any = useState(
    [],
  );
  const [availability, setAvailability] = useState(false);
  const [imei, setIMEI] = useState("");

  const [
    customersForOperationActivitiesReportsList,
    setCustomersForOperationActivitiesReportsList,
  ]: any = useState([]);
  const [
    vehiclesForOperationActivitiesReportsList,
    setvehiclesForOperationActivitiesReportsList,
  ]: any = useState([]);

  // Complaint Reports

  const [complaintTypesForReportsList, setComplaintTypesForReportsList]: any =
    useState([]);
  const [
    complaintPriorityForReportsList,
    setComplaintPriorityForReportsList,
  ]: any = useState([]);
  const [complaintStatusForReportsList, setComplaintStatusForReportsList]: any =
    useState([]);
  const [
    complaintDepartmentForReportsList,
    setComplaintDepartmentForReportsList,
  ]: any = useState([]);

  useEffect(() => {
    if (type == "/get-operator-performance-report") {
      getAll({ url: GET_ALL_OPERATORS }).then((data: any) => {
        if (data?.success) {
          dispatch(setOperatorsForReport(data.data));
          setOperatorsForReportsList(
            data.data
              .map((item: any) => {
                if (item.subRole.name === "Control Room") {
                  return {
                    value: `${item._id}`,
                    label: `${item.fullName}`,
                  };
                }
                return null; // Return null if condition doesn't match
              })
              .filter((item: any) => item !== null), // Remove null values from the array
          );
        } else {
          setOperatorsForReportsList([]);
        }
      });
    }

    if (type == "/get-inventory-report") {
      getAll({ url: GET_ALL_PRODUCT_TYPES }).then((data: any) => {
        if (data?.success) {
          dispatch(setProductTypesForReport(data.data));
          setProductTypesForReportsList(
            data.data.allProductTypes.map((item: any, index: any) => {
              return {
                value: `${item.value}`,
                label: `${item.title}`,
              };
            }),
          );
        } else {
          setProductTypesForReportsList([]);
        }
      });
      getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
        if (data?.success) {
          dispatch(setProductsForReport(data.data));
          setProductsForReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.name}`,
              };
            }),
          );
        } else {
          setProductsForReportsList([]);
        }
      });
      getAll({ url: GET_ALL_BRANCHES }).then((data: any) => {
        if (data?.success) {
          dispatch(setBranchesForReport(data.data));
          setBranchesForReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.name}`,
              };
            }),
          );
        } else {
          setBranchesForReportsList([]);
        }
      });

      getAll({ url: GET_ALL_WAREHOUSES }).then((data: any) => {
        if (data?.success) {
          dispatch(setWarehousesForReport(data.data));
          setWarehousesForReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.name}`,
              };
            }),
          );
        } else {
          setWarehousesForReportsList([]);
        }
      });
    }

    if (type == "/get-sale-invoice-report") {
      getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setCustomersForReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.fullName}`,
              };
            }),
          );
        } else {
          setCustomersForReportsList([]);
        }
      });
    }
    if (type == "/get-purchase-invoice-report") {
      getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setVendorsForReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.vendorName}`,
              };
            }),
          );
        } else {
          setVendorsForReportsList([]);
        }
      });
    }
    if (type == "/get-activity-report") {
      getAll({ url: GET_ALL_CUSTOMERS }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setCustomersForOperationActivitiesReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.fullName}`,
              };
            }),
          );
        } else {
          setCustomersForOperationActivitiesReportsList([]);
        }
      });
    }
    if (type == "/get-complaint-report") {
      getAll({ url: GET_ALL_ACTIVE_TYPES }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setComplaintTypesForReportsList(
            data?.data?.map((item: any, index: any) => {
              return {
                value: `${item?._id}`,
                label: `${item?.title}`,
              };
            }),
          );
        } else {
          setComplaintTypesForReportsList([]);
        }
      });
      getAll({ url: GET_COMPLAINT_CENTER_STATUS_TYPES }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setComplaintStatusForReportsList(
            data?.data?.internalComplaintStatusTypes.map(
              (item: any, index: any) => {
                return {
                  value: `${item?.value}`,
                  label: `${item?.title}`,
                };
              },
            ),
          );
        } else {
          setComplaintStatusForReportsList([]);
        }
      });
      getAll({ url: GET_COMPLAINT_CENTER_PRIORITY_STATUS }).then(
        (data: any) => {
          if (data?.success) {
            // dispatch(setProductTypesForReport(data.data));
            setComplaintPriorityForReportsList(
              data?.data?.internalComplaintPriortyStatusTypes.map(
                (item: any, index: any) => {
                  return {
                    value: `${item?.value}`,
                    label: `${item?.title}`,
                  };
                },
              ),
            );
          } else {
            setComplaintPriorityForReportsList([]);
          }
        },
      );
      getAll({ url: GET_ALL_ACTIVE_SUB_ROLES }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setComplaintDepartmentForReportsList(
            data?.data?.map((item: any, index: any) => {
              return {
                value: `${item?._id}`,
                label: `${item?.name}`,
              };
            }),
          );
        } else {
          setComplaintDepartmentForReportsList([]);
        }
      });
    }
  }, [type]);

  const [reportType, setReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString());

  // Data

  const [operatorIds, setOperatorIds]: any = useState([]);
  const [productTypes, setProductTypes]: any = useState([]);
  const [products, setProducts]: any = useState([]);
  const [branch, setBranch]: any = useState("");
  const [warehouse, setWarehouse]: any = useState("");

  const [vendorIds, setVendorIds]: any = useState([]);
  const [customerIds, setCustomerIds]: any = useState([]);
  const [
    customerForVehicleOperationActivity,
    setCustomerForVehicleOperationActivity,
  ] = useState("");
  const [vehicleIdForActivities, setVehicleIdForActivities]: any = useState("");
  const [activityStatus, setActivityStatus]: any = useState("");
  const [activityType, setActivityType]: any = useState("");

  const [complaintType, setComplaintType]: any = useState("");
  const [complaintStatus, setComplaintStatus]: any = useState("");
  const [complaintPriority, setComplaintPriority]: any = useState("");
  const [complaintDepartment, setComplaintDepartment]: any = useState("");

  useEffect(() => {
    if (customerForVehicleOperationActivity !== "") {
      getAll({
        url: `${GET_ALL_CUSTOMER_VEHICLES}/${customerForVehicleOperationActivity}`,
      }).then((data: any) => {
        if (data?.success) {
          // dispatch(setProductTypesForReport(data.data));
          setvehiclesForOperationActivitiesReportsList(
            data.data.map((item: any, index: any) => {
              return {
                value: `${item._id}`,
                label: `${item.registrationNo}`,
              };
            }),
          );
        } else {
          setvehiclesForOperationActivitiesReportsList([]);
        }
      });
    }
  }, [customerForVehicleOperationActivity]);

  const addReportForAlertEvents: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        id: 1,
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
      };

      try {
        var deviceIds: number[];
        if (selectedItems.length === 0) {
          const allItems = await dropDownDevices.flatMap((group: any) =>
            group.items.map((item: any) => ({
              deviceId: item.id,
              name: item.name,
              title: item.title,
            })),
          );
          // console.log("allItems", allItems);

          await setSelectedItems([...allItems]);
          deviceIds = await selectedItems.map((device: any) => device.deviceId);
          // console.log(deviceIds);
        } else {
          deviceIds = await selectedItems.map((device: any) => device.deviceId);
          // console.log(deviceIds);
        }

        await create(
          {
            toDate: endDate,
            fromDate: startDate,
            deviceIds: deviceIds,
          },
          {
            url: `${GET_REPORT_BASE_URL}${type}`,
          },
        ).then((data: any) => {
          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            setSelectedItems([]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());

            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            setSelectedItems([]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            setSelectedItems([]);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        setSelectedItems([]);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForOperatorPerformance: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        operatorIds: operatorIds,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setOperatorIds([]);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setOperatorIds([]);
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setOperatorIds([]);
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForInventoryReport: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        branch: branch !== "" ? branch : undefined,
        warehouse: warehouse !== "" ? warehouse : undefined,
        productId: products.length == 0 ? undefined : products,
        productType: productTypes.length == 0 ? undefined : productTypes,
        availability: availability,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setProductTypes([]);
            setProducts([]);
            setBranch("");
            setWarehouse("");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setProductTypes([]);
            setProducts([]);
            setBranch("");
            setWarehouse("");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setProductTypes([]);
            setProducts([]);
            setBranch("");
            setWarehouse("");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setProductTypes([]);
        setProducts([]);
        setBranch("");
        setWarehouse("");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForSaleInvoices: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        customerIds: customerIds,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setCustomerIds([]);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setCustomerIds([]);
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setCustomerIds([]);
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForPurchaseInvoices: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        vendorIds: vendorIds,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setVendorIds([]);
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setVendorIds([]);
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setVendorIds([]);
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForInventoryLifecycle: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        serialNumber: data.imei,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setIMEI("");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setIMEI("");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setIMEI("");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForOperationActivity: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        vehicleId: vehicleIdForActivities,
        activityType: activityType,
        status: activityStatus,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setVehicleIdForActivities("");
            setActivityStatus("");
            setActivityType("");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setVehicleIdForActivities("");
            setActivityStatus("");
            setActivityType("");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setVehicleIdForActivities("");
        setActivityStatus("");
        setActivityType("");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForAMCDue: SubmitHandler<ReportsType> = async (data: any) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };
  const addReportForInternalComplaint: SubmitHandler<ReportsType> = async (
    data: any,
  ) => {
    setLoading(true);
    if (
      data.title !== "" &&
      startDate !== null &&
      endDate !== null &&
      type !== ""
    ) {
      const report = {
        title: data.title,
        toDate: endDate,
        fromDate: startDate,
        status: complaintStatus,
        priority: complaintPriority,
        type: complaintType,
        subRole: complaintDepartment,
      };

      try {
        await create(report, {
          url: `${GET_REPORT_BASE_URL}${type}`,
        }).then((data: any) => {
          // console.log("data", data);

          if (!data.success && data.message === ERROR_MESSAGE) {
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
            setComplaintDepartment("");
            setComplaintPriority("");
            setComplaintStatus("");
            setComplaintType("");
          }
          if (!data.success) {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
            });
            setLoading(false);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            addToggle();
            setType("Select Type");
          }
          if (data.success) {
            // console.log(data);
            tempReports.push({
              type: type,
              data: {
                title: report.title,
                startDate: startDate,
                endDate: endDate,
                data: data.data,
              },
            });

            // console.log("Reports", reports);
            dispatch(setReports(tempReports));
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
            setStartDate(yesterday.toISOString());
            // setStartDate(new Date().toISOString());
            setEndDate(new Date().toISOString());
            setLoading(false);
            addToggle();
            setType("Select Type");
            setComplaintDepartment("");
            setComplaintPriority("");
            setComplaintStatus("");
            setComplaintType("");
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error: any) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
        setStartDate(yesterday.toISOString());
        // setStartDate(new Date().toISOString());
        setEndDate(new Date().toISOString());
        if (data == undefined) {
          Swal.fire({
            text: "Failed to create due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });

          return;
        }
        setLoading(false);
        addToggle();
        setType("Select Type");
        setComplaintDepartment("");
        setComplaintPriority("");
        setComplaintStatus("");
        setComplaintType("");
      }
    } else {
      Swal.fire({
        text: "Required Fields are empty",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };

  const getReport = (data: any) => {
    if (type == "/get-all-alert-events-report") {
      addReportForAlertEvents(data);
    } else if (type == "/get-operator-performance-report") {
      addReportForOperatorPerformance(data);
    } else if (type == "/get-inventory-report") {
      addReportForInventoryReport(data);
    } else if (type == "/get-sale-invoice-report") {
      addReportForSaleInvoices(data);
    } else if (type == "/get-purchase-invoice-report") {
      addReportForPurchaseInvoices(data);
    } else if (type == "/get-inventory-lifecycle-report") {
      addReportForInventoryLifecycle(data);
    } else if (type == "/get-activity-report") {
      addReportForOperationActivity(data);
    } else if (type == "/get-amc-due-report") {
      addReportForAMCDue(data);
    } else if (type == "/get-complaint-report") {
      addReportForInternalComplaint(data);
    }
  };

  const handleReportTypeChange = (selectedOption: any) => {
    setReportType(selectedOption);
    handleDateSelection(selectedOption);
  };

  const handleDateSelection = (selectedType: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (selectedType) {
      case "Today":
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        end = new Date(today);
        end.setDate(today.getDate());
        break;
      case "Yesterday":
        start = new Date(today);
        start.setDate(today.getDate() - 2);
        end = new Date(today);
        end.setDate(today.getDate() - 1);
        break;
      case "Last Week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay() - 6 - 7); // Previous Monday
        end = new Date(today);
        end.setDate(today.getDate() - today.getDay() - 7); // Previous Sunday
        break;
      case "This Week":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // This Monday
        end = new Date(today);
        break; // Today is the end of the week

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
  };

  useEffect(() => {
    handleDateSelection("Yesterday"); // Default selection
  }, []);
  const data = [
    { title: "LHR", items: [] }, // Fill in your data here
    { title: "Ungrouped", items: [] },
    { title: "NLC", items: [] },
    { title: "ISB", items: [] },
    { title: "Testing Lynkworld", items: [] },
  ];

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
          <PlusCircle />
          Create New Report
        </button>
        <Modal
          isOpen={addModal}
          toggle={addToggle}
          size="lg"
          centered
          style={
            {
              // he
            }
          }
        >
          <div className="modal-header">
            <H3 className="modal-title">Create Report</H3>
            <Button
              color="transprant"
              className="btn-close"
              onClick={addToggle}
            ></Button>
          </div>

          <ModalBody
            style={{
              minHeight: "60vh",
              maxHeight: "655vh",
            }}
          >
            <form
              className="form-bookmark needs-validation"
              onSubmit={handleSubmit(getReport)}
            >
              <Row>
                <FormGroup className="col-md-6 create-group">
                  <P>Title</P>
                  <input
                    className="form-control"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  <span style={{ color: "red" }}>
                    {errors.title && "Report title is required"}
                  </span>
                </FormGroup>
                <FormGroup className="col-md-6 create-group">
                  <div>
                    <P>Report Type</P>
                  </div>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
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
                    onChange={(e: any, options) => {
                      setValue("title", options.label);
                      // console.log(e);
                      setType(e);
                    }}
                    options={reportsTypeList}
                  />
                </FormGroup>

                <FormGroup
                  className="col-md-6 create-group"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Period:</div>
                  <Col md={8}>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select Period"
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.P ?? "").includes(input)
                      }
                      options={reportPeriodList}
                      onChange={handleReportTypeChange}
                    />
                  </Col>
                </FormGroup>

                {type == "/get-all-alert-events-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{ marginTop: "-25px" }}
                  >
                    <div>
                      <P>Devices</P>
                    </div>
                    <CustomDropdown
                      data={dropDownDevices}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                    />
                  </FormGroup>
                ) : type == "/get-operator-performance-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Operator:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Operator"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          // console.log("e", e);

                          if (e.includes("All")) {
                            setOperatorIds(
                              operatorsForReportsList.map(
                                (operator: any) => operator.value,
                              ),
                            );
                          } else {
                            setOperatorIds(e);
                          }
                        }}
                        // options={operatorsForReportsList}
                        options={[
                          { value: "All", label: "All" }, // Adding the 'All' option
                          ...operatorsForReportsList,
                        ]}
                        value={operatorIds}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-inventory-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Product Type:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
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
                        onChange={(e: any, options) => {
                          // console.log("e", e);

                          if (e.includes("All")) {
                            setProductTypes(
                              productTypesForReportsList.map(
                                (pt: any) => pt.value,
                              ),
                            );
                          } else {
                            setProductTypes(e);
                          }
                        }}
                        options={[
                          { value: "All", label: "All" }, // Adding the 'All' option
                          ...productTypesForReportsList,
                        ]}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-purchase-invoice-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Vendors:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Vendors"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          // console.log("e", e);

                          if (e.includes("All")) {
                            setVendorIds(
                              vendorsForReportsList.map((v: any) => v.value),
                            );
                          } else {
                            setVendorIds(e);
                          }
                        }}
                        options={[
                          { value: "All", label: "All" }, // Adding the 'All' option
                          ...vendorsForReportsList,
                        ]}
                        value={vendorIds}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-sale-invoice-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Customers:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Customers"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          // console.log("e", e);

                          if (e.includes("All")) {
                            setCustomerIds(
                              customersForReportsList.map((c: any) => c.value),
                            );
                          } else {
                            setCustomerIds(e);
                          }
                        }}
                        options={[
                          { value: "All", label: "All" }, // Adding the 'All' option
                          ...customersForReportsList,
                        ]}
                        value={customerIds}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-inventory-lifecycle-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>IMEI:</div>
                    <Col md={9}>
                      <input
                        className="form-control"
                        type="text"
                        // onChange={(e) => setIMEI(e.target.value)}
                        {...register("imei", { required: true })}
                      />
                      {/* <span style={{ color: "red" }}>
                        {errors.imei && "IMEI is required"}
                      </span> */}
                    </Col>
                  </FormGroup>
                ) : type == "/get-activity-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Customer:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Customer"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setCustomerForVehicleOperationActivity(e);
                        }}
                        options={customersForOperationActivitiesReportsList}
                        value={
                          customerForVehicleOperationActivity !== ""
                            ? customerForVehicleOperationActivity
                            : null
                        }
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-complaint-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Complaint Type:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
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
                        onChange={(e: any, options) => {
                          setComplaintType(e);
                        }}
                        options={complaintTypesForReportsList}
                        value={complaintType !== "" ? complaintType : null}
                      />
                    </Col>
                  </FormGroup>
                ) : (
                  <div className="col-md-6 create-group"></div>
                )}
                <FormGroup
                  className="col-md-6 create-group"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Date From:</div>
                  <Col md={8}>
                    <input
                      className="form-control"
                      type="date"
                      value={startDate.slice(0, 10)}
                      onChange={(e) => {
                        setStartDate(new Date(e.target.value).toISOString());
                        // console.log("e", e.target.value);
                      }}
                    />
                  </Col>
                </FormGroup>
                {type == "/get-inventory-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Product:</div>
                    <Col md={8}>
                      <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
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
                        onChange={(e: any, options) => {
                          // console.log("e", e);

                          if (e.includes("All")) {
                            setProducts(
                              productsForReportsList.map((p: any) => p.value),
                            );
                          } else {
                            setProducts(e);
                          }
                        }}
                        options={[
                          { value: "All", label: "All" }, // Adding the 'All' option
                          ...productsForReportsList,
                        ]}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-activity-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Vehicle:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Vehicle"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setVehicleIdForActivities(e);
                        }}
                        options={vehiclesForOperationActivitiesReportsList}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-complaint-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Department:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Department"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setComplaintDepartment(e);
                        }}
                        options={complaintDepartmentForReportsList}
                      />
                    </Col>
                  </FormGroup>
                ) : (
                  <div></div>
                )}
                <FormGroup
                  className="col-md-6 create-group"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Date To:</div>
                  <Col md={8}>
                    <input
                      className="form-control"
                      type="date"
                      value={endDate.slice(0, 10)}
                      onChange={(e) => {
                        setEndDate(new Date(e.target.value).toISOString());
                        // console.log("e", e.target.value);
                      }}
                    />
                  </Col>
                </FormGroup>
                {type == "/get-inventory-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Branch:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Branch"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setBranch(e);
                        }}
                        options={branchesForReportsList}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-activity-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Type:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Activity Type"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setActivityType(e);
                        }}
                        options={[
                          { label: "Remove", value: "REMOVE" },
                          { label: "Transfer", value: "TRANSFER" },
                          {
                            label: "Temporary Remove",
                            value: "TEMPORARY_REMOVE",
                          },
                          {
                            label: "Ownership Change",
                            value: "OWNERSHIP_CHANGE",
                          },
                          { label: "Redo", value: "REDO" },
                          {
                            label: "Customer Data Update",
                            value: "CUSTOMER_DATA_UPDATE",
                          },
                        ]}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-complaint-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Status:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Status"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setComplaintStatus(e);
                        }}
                        options={complaintStatusForReportsList}
                      />
                    </Col>
                  </FormGroup>
                ) : (
                  <div></div>
                )}
                <FormGroup className="col-md-6 create-group"></FormGroup>
                {type == "/get-inventory-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Warehouse:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Warehouse"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setWarehouse(e);
                        }}
                        options={warehousesForReportsList}
                        // onChange={(e: any, options) => {
                        //   console.log("e", e);

                        //   if (e.includes("All")) {
                        //     setWarehouse(
                        //       warehousesForReportsList.map((w: any) => w.value)
                        //     );
                        //   } else {
                        //     setWarehouse(e);
                        //   }
                        // }}
                        // options={[
                        //   { value: "All", label: "All" }, // Adding the 'All' option
                        //   ...warehousesForReportsList,
                        // ]}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-activity-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Status:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Activity Status"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setActivityStatus(e);
                        }}
                        options={[
                          {
                            value: "ASSIGNED",
                            label: "Assigned",
                          },
                          {
                            value: "INSTALLATION",
                            label: "Performed",
                          },
                          {
                            value: "COMPLETED",
                            label: "Completed",
                          },
                        ]}
                      />
                    </Col>
                  </FormGroup>
                ) : type == "/get-complaint-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Priority:</div>
                    <Col md={8}>
                      <Select
                        // mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Priority"
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) =>
                          (option?.P ?? "").includes(input)
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.P ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.P ?? "").toLowerCase())
                        }
                        onChange={(e: any, options) => {
                          setComplaintPriority(e);
                        }}
                        options={complaintPriorityForReportsList}
                      />
                    </Col>
                  </FormGroup>
                ) : (
                  <div></div>
                )}
                <FormGroup className="col-md-6 create-group"></FormGroup>
                {type == "/get-inventory-report" ? (
                  <FormGroup
                    className="col-md-6 create-group"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>Availability:</div>
                    <Col md={8}>
                      <div
                        className={`flex-shrink-0 icon-state 
                            }`}
                      >
                        <Label className="switch mb-0">
                          <Input
                            type="checkbox"
                            defaultChecked={availability}
                            checked={availability}
                            onChange={async (e: any) => {
                              setAvailability(!availability);
                            }}
                          />
                          <span
                            // className={`switch-state ${
                            //   row.isActive ? "bg-primary" : "bg-secondary"
                            // }`}
                            className="switch-state"
                            style={{
                              backgroundColor: availability ? "green" : "red",
                            }}
                          />
                        </Label>
                      </div>
                    </Col>
                  </FormGroup>
                ) : (
                  <div></div>
                )}
              </Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  height: "150px",
                  alignItems: "end",
                }}
              >
                <Button color="primary" className="me-1">
                  {loading ? "Loading ..." : `Generate`}
                </Button>
                &nbsp;&nbsp;
                <Button
                  disabled={loading ? true : false}
                  color="secondary"
                  onClick={addToggle}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Col>
  );
};

export default CreateNewReport;
