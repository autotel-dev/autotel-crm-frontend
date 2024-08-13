import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../../../../CssConstaints/Style.css";
import CreateNewVendorModal from "./components/CreateNewVendorModal";
import { getAll } from "../../../../../../../../Utilities/api";
import {
  GET_ALL_VENDORS,
  GET_ALL_ACTIVE_CITIES,
  GET_ALL_ACTIVE_COUNTRIES,
} from "../../../../../../../../Utilities/api/apiEndpoints";
import {
  setCities,
  setCountries,
  setVendor,
} from "../../../../../../../../ReaduxToolkit/Reducer/VendorSlice";
import UpdateVendor from "./components/UpdateVendor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import deleteAlert from "../../../../../../../../Utilities/alerts/DeleteAlert";

const VendorsTable = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const { vendor } = useSelector((state: any) => state.vendor);
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  function hexToRgb(hex: any) {
    // Remove the hash sign if present
    hex = hex?.replace(/^#/, "");
    // Parse the hex values to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  useEffect(() => {
    // Fetch vendors from API
    getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
      if (data?.success) {
        dispatch(setVendor(data.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    // Fetch countries and cities from API
    getAll({ url: GET_ALL_ACTIVE_COUNTRIES }).then((data: any) => {
      if (data?.success) {
        dispatch(setCountries(data.data));
      }
    });

    getAll({ url: GET_ALL_ACTIVE_CITIES }).then((data: any) => {
      if (data?.success) {
        dispatch(setCities(data.data));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    // Transform vendor data for DataTable
    const transformData = () => {
      return vendor
        ?.filter(
          (vendor: any) =>
            vendor.vendorName.toLowerCase().includes(searchValue) ||
            vendor.emailAddress.toLowerCase().includes(searchValue)
        )
        .map((vendor: any) => ({
          ...vendor,
          isActive: vendor.isActive ? "Active" : "Inactive",
        }));
    };

    setData(transformData());
  }, [searchValue, vendor]);

  const handleSearch = (e: any) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const handleRowSelected = (state: any) => {
    setSelectedRows(state.selectedRows);
    console.log(state.selectedRows);
  };

  //   const handleDelete = () => {
  //     if (
  //       window.confirm(
  //         `Are you sure you want to delete:\r ${selectedRows
  //           .map((r: any) => r.vendorName)
  //           .join(", ")}?`
  //       )
  //     ) {
  //       setToggleDelete(!toggleDelete);
  // setData(
  //   data.filter((item: any) =>
  //     selectedRows.filter((elem: any) => elem._id === item._id).length > 0
  //       ? false
  //       : true
  //   )
  // );
  // setSelectedRows([]);
  //     }
  //   };

  const handleRowClicked = (row: any) => {
    setSelectedVendor(row);
    setIsUpdateModalOpen(true);
  };

  return (
    <div
      className="table-responsive support-table"
      style={{ overflow: "auto", scrollbarWidth: "none" }}
    >
      <Row>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            paddingRight: "25px",
          }}
        >
          <CreateNewVendorModal />
        </div>
      </Row>
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col sm={12}>
          <input
            className="global-search-field"
            type="text"
            placeholder="Type to Search.."
            value={searchValue}
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <DataTable
        columns={[
          {
            name: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  paddingLeft: "0px ",
                }}
              >
                {selectedRows.length > 0 && (
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    // onClick={handleDelete}
                    onClick={() => {
                      // console.log("345678");
                      var alertData = {
                        title: "Are you sure?",
                        text: "Once deleted, you will not be able to recover this ",
                      };
                      const type = "vendorType";
                      deleteAlert(
                        alertData,
                        selectedRows[0]._id,
                        type,
                        dispatch
                      ).then(() => {
                        console.log("empty");

                        setSelectedRows([]);
                      });
                    }}
                    style={{
                      cursor: "pointer",
                      color: "red",
                      marginRight: "20px",
                      paddingLeft: "0px",
                    }}
                  />
                )}
                Vendor Name
              </div>
            ),
            selector: (row: any) => row.vendorName,
            sortable: true,
            width: "180px",
            cell: (row: any) => (
              <div
                style={{
                  width: "180px",
                  textAlign: "center",
                  paddingRight: "60px",
                  borderRadius: "5px",
                }}
              >
                {row.vendorName}
              </div>
            ),
          },
          {
            name: "Phone No",
            selector: (row: any) => row.phoneNo,
            sortable: true,
          },
          { name: "CNIC", selector: (row: any) => row.cnic, sortable: true },
          {
            name: "Email Address",
            selector: (row: any) => row.emailAddress,
            sortable: true,
          },
          {
            name: "Address",
            selector: (row: any) => row.address,
            sortable: true,
          },
          { name: "NTN", selector: (row: any) => row.ntn, sortable: true },
          {
            name: "Contact Person Name",
            selector: (row: any) => row.contactPersonName,
            sortable: true,
          },
          {
            name: "Country",
            selector: (row: any) => row.country.name,
            sortable: true,
          },
          { name: "City", selector: (row: any) => row.city.name, sortable: true },
          {
            name: "Company",
            selector: (row: any) => row.company.fullName,
            sortable: true,
          },
          {
            name: "Status",
            selector: (row: any) => row.isActive,
            sortable: true,
          },
        ]}
        data={data}
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        onRowClicked={handleRowClicked}
        clearSelectedRows={toggleDelete}
        style={{ cursor: "pointer" }}
        className="custom-data-table"
        customStyles={{
          rows: {
            style: {
              cursor: "pointer",
              transition: "background-color 0.2s", // Smooth transition for background color change
              "&:hover": { // Define hover style
                backgroundColor: `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`,
              },
            },
          },
          head: {
            style: {
              fontWeight: "bold",
              fontSize: "13px",
            },
          },
        }}
      />
      <style>
        {`
          .custom-data-table thead th {
            text-align: center !important;
          }
        `}
      </style>
      {selectedVendor && (
        <UpdateVendor
          isVisible={isUpdateModalOpen}
          setIsVisible={setIsUpdateModalOpen}
          selectedVendor={selectedVendor}
        />
      )}
    </div>
  );
};

export default VendorsTable;
