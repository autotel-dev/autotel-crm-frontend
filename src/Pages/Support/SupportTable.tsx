import { useCallback, useEffect, useState } from "react";
import { supportColumns, SupportDataType } from "./data/SupportData";
import { Button, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import { Delete, DeleteData } from "../../utils/Constant";
import { H4 } from "../../AbstractElements";
import { PlusCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
import CreateNewTicket from "./CreateNewTicket";
import { useSelector } from "react-redux";

const TicketTable = () => {
  // Function to transform supportData into allBugReports format
  const { bugReports } = useSelector((state: any) => state.support);
  const supportData = () => {
    return bugReports.map((item: any) => ({
      id: item._id,
      username: item.user.fullName,
      email: item.user.emailAddress,
      ticket_name: item.name,
      description: item.description,
      isActive: item.isActive ? "true" : "false",
      status: item.status,
      priorty: item.priorty == null ? "N/A" : item.priorty,
      date: "2024-02-19",
    }));
  };

  console.log("allBugReports", supportData());
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
    console.log("Clicked row data:", row);
    
    // Navigate to the ticketDetails page with the row data
    // history.push(`${process.env.PUBLIC_URL}/support/ticketDetails`, {
    //   rowData: row,
    // });
  };
  return (
    <div className="table-responsive support-table">
      <Col md={12} style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Type to Search.."
          // value={searchValue}
          // onChange={(e) => {
          //   filterProvincess(e);
          // }}
          style={{
            backgroundColor: "#f1f1f1",
            borderRadius: "5px",
            padding: "15px",
            margin: "20px 5px",
            width: "86%", // Adjusting width to accommodate padding and margin
            border: "none",
            outline: "none", // Removing default border outline
          }}
        />
        <CreateNewTicket />
      </Col>
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
        }}
      />
    </div>
  );
};

export default TicketTable;
