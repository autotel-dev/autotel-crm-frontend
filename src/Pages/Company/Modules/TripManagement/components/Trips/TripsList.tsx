import { useState } from "react";
import { Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlusCircle } from "react-feather";

const TripsList = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  function hexToRgb(hex: any) {
    hex = hex?.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  // Mock trip data - same as Dashboard
  const tripData = [
    {
      id: 1,
      tripId: "TRIP-001",
      vehicle: "ABC-123",
      driver: "John Doe",
      currentPoint: "Islamabad, Pakistan",
      status: "ON_TIME",
      eta: "2 hrs 30 mins",
      date: "2025-12-12, 10:30:00 AM",
    },
    {
      id: 2,
      tripId: "TRIP-002",
      vehicle: "XYZ-456",
      driver: "Jane Smith",
      currentPoint: "Lahore, Pakistan",
      status: "DELAYED",
      eta: "4 hrs 15 mins",
      date: "2025-12-12, 09:15:00 AM",
    },
    {
      id: 3,
      tripId: "TRIP-003",
      vehicle: "DEF-789",
      driver: "Mike Johnson",
      currentPoint: "Karachi, Pakistan",
      status: "ON_TIME",
      eta: "1 hr 45 mins",
      date: "2025-12-12, 11:00:00 AM",
    },
  ];

  const [data, setData] = useState(tripData);

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);

    const filteredData = tripData.filter(
      (item: any) =>
        item?.tripId.toLowerCase().includes(searchKey) ||
        item?.vehicle.toLowerCase().includes(searchKey) ||
        item?.driver.toLowerCase().includes(searchKey) ||
        item?.currentPoint.toLowerCase().includes(searchKey)
    );
    setData(filteredData);
  };

  const handleRowClicked = (row: any) => {
    // Navigate to trip details page
    // navigate(`${process.env.PUBLIC_URL}/company/modules/trip-management/trips/${row.id}`);
  };

  const handleCreateTrip = () => {
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/trip-management/trips/create-trip`
    );
  };

  const tripColumns = [
    {
      name: "S.No.",
      selector: (row: any) => row.id,
      sortable: true,
      width: "7%",
    },
    {
      name: "Date",
      selector: (row: any) => row.date,
      sortable: true,
      width: "15%",
    },
    {
      name: "Trip ID",
      selector: (row: any) => row.tripId,
      sortable: true,
      width: "10%",
    },
    {
      name: "Vehicle",
      selector: (row: any) => row.vehicle,
      sortable: true,
      width: "10%",
    },
    {
      name: "Driver",
      selector: (row: any) => row.driver,
      sortable: true,
      width: "12%",
    },
    {
      name: "Current Point",
      selector: (row: any) => row.currentPoint,
      sortable: true,
      width: "20%",
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      sortable: true,
      center: true,
      width: "10%",
      cell: (row: any) => (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "5px",
            borderRadius: "5px",
            color: "black",
            backgroundColor:
              row.status === "ON_TIME"
                ? "rgba(0, 255, 0, 0.3)"
                : row.status === "DELAYED"
                ? "rgba(255, 200, 0, 0.3)"
                : "rgba(255, 0, 0, 0.3)",
          }}
        >
          {row.status.replace("_", " ")}
        </div>
      ),
    },
    {
      name: "Dynamic ETA",
      selector: (row: any) => row.eta,
      sortable: true,
      width: "13%",
    },
  ];

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
              display: "flex",
              alignItems: "center",
            }}
            onClick={handleCreateTrip}
          >
            <PlusCircle
              size={18}
              style={{
                marginRight: "5px",
              }}
            />
            Create Trip
          </button>
        </div>
      </Row>

      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col sm={12} md={12} lg={12} xl={12}>
          <input
            className="global-search-field"
            type="text"
            placeholder="Type to Search.."
            value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </Col>
      </Row>

      <DataTable
        columns={tripColumns}
        data={data}
        pagination
        selectableRows
        onRowClicked={handleRowClicked}
        style={{
          cursor: "pointer",
        }}
        customStyles={{
          rows: {
            style: {
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
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
    </div>
  );
};

export default TripsList;
