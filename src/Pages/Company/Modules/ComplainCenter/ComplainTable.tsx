import { useCallback, useEffect, useState } from "react";
import { supportColumns, ComplainDataType } from "./data/SupportData";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { Delete, DeleteData } from "../../../../utils/Constant";
import { H4 } from "../../../../AbstractElements";
import { useNavigate } from "react-router-dom";
import CreateNewTicket from "./CreateNewComplain";
import { useDispatch, useSelector } from "react-redux";
import { getUserRole } from "../../../../Api/globals";
import { ROLES } from "../../../../constants/roles";
import CreateNewComplain from "./CreateNewComplain";
import { setTableRow } from "../../../../ReaduxToolkit/Reducer/ComplainCenterSlice";

const ComplainTable = () => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { allComplains, filteredRole } = useSelector((state: any) => state.complainCenter);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  // console.log("support", support);
  const supportData = () => {
    if (filteredRole == "All") {
      return allComplains
        .filter(
          (item: any) =>
            item.complaintId.toLowerCase().split("-")[1].includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue) ||
            item.deviceName.toLowerCase().includes(searchValue)
        )
        .map((item: any) => ({
          complaint_id: item?._id,
          id: item?.complaintId,
          device_name: item?.deviceName,
          user: item?.createdBy.fullName,
          comment: item?.description,
          department: item?.subRole.name,
          server: item?.server.companyName,
          status: item?.status,
          priorty: item?.priorty == null ? "N/A" : item?.priorty,
          date: `${item?.createdAt.toString().slice(0, 10)},  ${new Date(
            item?.updatedAt
          )
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,
        }));
    }
    else {
      return allComplains
        .filter(
          (item: any) =>
            item.complaintId.toLowerCase().split("-")[1].includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue) ||
            item.deviceName.toLowerCase().includes(searchValue)
        ).filter((item: any) => item.subRole.name == filteredRole)
        .map((item: any) => ({
          complaint_id: item?._id,
          id: item?.complaintId,
          device_name: item?.deviceName,
          user: item?.createdBy.fullName,
          comment: item?.description,
          department: item?.subRole.name,
          server: item?.server.companyName,
          status: item?.status,
          priorty: item?.priorty == null ? "N/A" : item?.priorty,
          date: `${item?.createdAt.toString().slice(0, 10)},  ${new Date(
            item?.updatedAt
          )
            .toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .toString()}`,
        }));
    }

  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(supportData());
  }, [searchValue, filteredRole]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(supportData());
  }, [allComplains]);

  const navigate = useNavigate();
  // const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(supportData());

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${selectedRows.map(
          (r: ComplainDataType) => r.id
        )}?`
      )
    ) {
      setToggleDelete(!toggleDelete);
      setData(
        data.filter((item: any) =>
          selectedRows.filter((elem: ComplainDataType) => elem.id === item.id)
            .length > 0
            ? false
            : true
        )
      );
      setSelectedRows([]);
    }
  };
  const [changeStatusValue, setChangeStatusValue] = useState(false)

  const handleRowClicked = (row: any) => {
    // Set the state variable


    // // Store the state variable in sessionStorage
    // sessionStorage.setItem('stateVariable', JSON.stringify(changeStatusValue));

    // // Create a broadcast channel with a unique name
    // const broadcastChannel = new BroadcastChannel('stateChannel');

    // // Send the state variable through the broadcast channel
    // broadcastChannel.postMessage(JSON.stringify(changeStatusValue));

    // // Clean up by closing the broadcast channel
    // broadcastChannel.close();

    dispatch(setTableRow(row));
    // if (getUserRole() == "COMPANY") {
    //   navigate(
    //     `${process.env.PUBLIC_URL}/company/modules/complain-center/complainDetails/${row.complaint_id}`
    //   );
    // }
    // if (getUserRole() == "OPERATOR") {
    //   navigate(
    //     `${process.env.PUBLIC_URL}/operator/modules/complain-center/complainDetails/${row.complaint_id}`
    //   );
    // }
    if (getUserRole() === "COMPANY") {
      window.open(
        `${process.env.PUBLIC_URL}/company/modules/complain-center/complainDetails/${row.complaint_id}`,
        '_blank'
      );
    }

    if (getUserRole() === "OPERATOR") {
      window.open(
        `${process.env.PUBLIC_URL}/operator/modules/complain-center/complainDetails/${row.complaint_id}`,
        '_blank'
      );
    }

  };
  return (
    <div className="table-responsive support-table">
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col
          sm={12}
          md={
            10
          }
          lg={
            10
          }
          xl={
            10
          }
        >
          <input
            type="text"
            placeholder="Type to Search.."
            value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
            style={{
              backgroundColor: "#f1f1f1",
              borderRadius: "5px",
              padding: "12px",
              height: "40px",
              margin: "20px 0px",
              width: "100%", // Adjusting width to accommodate padding and margin
              border: "none",
              outline: "none", // Removing default border outline
            }}
          />
        </Col>
        {getUserRole() === ROLES.SUPER_ADMIN ? (
          <Col
            sm={12}
            md={2}
            lg={2}
            xl={2}
          >
            <CreateNewComplain />
          </Col>
        ) : (getUserRole() === ROLES.COMPANY ||
          getUserRole() === ROLES.OPERATOR)
          ? (
            <Col sm={12} md={12} lg={2} xl={2}>
              <CreateNewComplain />
            </Col>
          ) : null}
      </Row>
      {selectedRows.length !== 0 && (
        <div
          className={`d-flex align-items-center justify-content-between bg-light-info p-2`}
        >
          <H4 className="text-muted m-0">{DeleteData}</H4>
          <Button color="danger" onClick={() => handleDelete()}>
            {Delete}
          </Button>
        </div>
      )}
      <DataTable
        columns={supportColumns}
        data={data}
        // striped={true}
        pagination
        selectableRows

        // onSelectedRowsChange={handleRowSelected}
        onRowClicked={handleRowClicked} // Pass the event handler for row clicks
        clearSelectedRows={toggleDelete}
        style={{
          cursor: "pointer",
        }}
        className="custom-data-table" // Add a class to your DataTable for styling
        // You can add more props as needed
        customStyles={{
          rows: {
            style: {
              cursor: "pointer",
              transition: "background-color 0.2s", // Smooth transition for background color change
              "&:hover": { // Define hover style
                backgroundColor: `${userPersonalizationData.buttonsAndBarsColor}`,
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
    </div>
  );
};

export default ComplainTable;
