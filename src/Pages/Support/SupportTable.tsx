import { useCallback, useState } from "react";
import {
  supportColumns,
  supportData,
  SupportDataType,
} from "./data/SupportData";
import { Button, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import { Delete, DeleteData } from "../../utils/Constant";
import { H4 } from "../../AbstractElements";
import { PlusCircle } from "react-feather";
import { useNavigate } from "react-router-dom";

const TicketTable = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [data, setData] = useState(supportData);

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${selectedRows.map(
          (r: SupportDataType) => r.name
        )}?`
      )
    ) {
      setToggleDelete(!toggleDelete);
      setData(
        data.filter((item) =>
          selectedRows.filter((elem: SupportDataType) => elem.id === item.id)
            .length > 0
            ? false
            : true
        )
      );
      setSelectedRows([]);
    }
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
        <button
          className="btn btn-primary"
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 10px",
            margin: "0px 15px",
            height: "50px",
            width:"15%"
          }}
          // onClick={addToggle}
        >
          <div style={{ marginRight: "2%" }}>
            <PlusCircle />
          </div>
          <span style={{ fontSize: "100%" }}>Create New Ticket</span>
        </button>
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
        onRowClicked={() => {
          navigate(`${process.env.PUBLIC_URL}/support/ticketDetails`);
        }}
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
