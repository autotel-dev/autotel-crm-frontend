import { useCallback, useEffect, useState } from "react";
import { supportColumns, SupportDataType } from "./data/SupportData";
import { Button, Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { Delete, DeleteData } from "../../utils/Constant";
import { H4 } from "../../AbstractElements";
import { useNavigate } from "react-router-dom";
import CreateNewTicket from "./CreateNewTicket";
import { useDispatch, useSelector } from "react-redux";
import { setTableRow } from "../../ReaduxToolkit/Reducer/SupportSlice";
import { getUserRole } from "../../Api/globals";
import { ROLES } from "../../constants/roles";

const TicketTable = () => {
  const dispatch = useDispatch();
  // Function to transform supportData into allBugReports format
  const { bugReports } = useSelector((state: any) => state.support);
  const { userPermissions } = useSelector(
    (state: any) => state.userPermissions
  );
  var support = userPermissions.find((item: any) => item.title === "Support");
  // console.log("support", support);
  const supportData = () => {
    return bugReports
      .filter(
        (item: any) =>
          item.ticketId.toLowerCase().split("-")[1].includes(searchValue) ||
          item.name.toLowerCase().includes(searchValue) ||
          item.user.emailAddress.toLowerCase().includes(searchValue)
      )
      .map((item: any) => ({
        ticket_id: item?._id,
        id: item?.ticketId,
        username: item?.user?.fullName,
        email: item?.user?.emailAddress,
        ticket_name: item?.name,
        description: item?.description,
        isActive: item?.isActive ? "true" : "false",
        status: item?.status,
        priorty: item?.priorty == null ? "N/A" : item?.priorty,
        date: `${item?.updatedAt.toString().slice(0, 10)},  ${new Date(
          item?.updatedAt
        )
          .toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .toString()}`,
      }));
  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setData(supportData());
  }, [searchValue]);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);
  };

  // console.log("allBugReports", supportData());
  useEffect(() => {
    setData(supportData());
  }, [bugReports]);

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
          (r: SupportDataType) => r.id
        )}?`
      )
    ) {
      setToggleDelete(!toggleDelete);
      setData(
        data.filter((item: any) =>
          selectedRows.filter((elem: SupportDataType) => elem.id === item.id)
            .length > 0
            ? false
            : true
        )
      );
      setSelectedRows([]);
    }
  };

  const handleRowClicked = (row: any) => {
    // Here 'row' contains the data of the clicked row
    // console.log("Clicked row data:", row);

    // Navigate to the ticketDetails page with the row data
    dispatch(setTableRow(row));
    navigate(
      `${process.env.PUBLIC_URL}/super-admin/support/ticketDetails/${row.ticket_id}`
    );
  };
  return (
    <div className="table-responsive support-table">
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col
          sm={support !== undefined && support?.create ? 12 : 12}
          md={
            support !== undefined && support?.create
              ? 10
              : getUserRole() === ROLES.SUPER_ADMIN
              ? 12
              : 12
          }
          lg={
            support !== undefined && support?.create
              ? 10
              : getUserRole() === ROLES.SUPER_ADMIN
              ? 10
              : 12
          }
          xl={
            support !== undefined && support?.create
              ? 10
              : getUserRole() === ROLES.SUPER_ADMIN
              ? 10
              : 12
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
              padding: "15px",
              margin: "20px 0px",
              width: "100%", // Adjusting width to accommodate padding and margin
              border: "none",
              outline: "none", // Removing default border outline
            }}
          />
        </Col>
        {getUserRole() === ROLES.SUPER_ADMIN ? (
          <Col
            sm={support !== undefined && support?.create ? 2 : 0}
            md={support !== undefined && support?.create ? 2 : 0}
            lg={support !== undefined && support?.create ? 2 : 0}
            xl={support !== undefined && support?.create ? 2 : 0}
          >
            <CreateNewTicket />
          </Col>
        ) : (getUserRole() === ROLES.COMPANY ||
            getUserRole() === ROLES.OPERATOR) &&
          support !== undefined &&
          support?.create ? (
          <Col sm={12} md={12} lg={2} xl={2}>
            <CreateNewTicket />
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
        striped={true}
        pagination
        selectableRows
        onSelectedRowsChange={handleRowSelected}
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

export default TicketTable;
