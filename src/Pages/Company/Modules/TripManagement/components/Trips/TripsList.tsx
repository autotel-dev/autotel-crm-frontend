import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PlusCircle } from "react-feather";
import Swal from "sweetalert2";
import { getAll } from "../../../../../../Utilities/api";
import { GET_ALL_TRIPS } from "../../../../../../Utilities/api/apiEndpoints";
import {
  setTrips,
  setFilterTrips,
  setTripStart,
  setTripEnd,
} from "../../../../../../ReaduxToolkit/Reducer/TripSlice";

const TripsList = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const { trips, filterTrips, loading } = useSelector(
    (state: any) => state.trips
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

  // Fetch trips from API on component mount and every 15 seconds for real-time updates
  useEffect(() => {
    // Fetch immediately on mount
    fetchTrips();

    // // Set up interval to fetch every 15 seconds for real-time updates
    // const interval = setInterval(() => {
    //   fetchTrips();
    // }, 15000); // 15 seconds

    // // Cleanup interval on unmount
    // return () => clearInterval(interval);
  }, []);

  const fetchTrips = () => {
    dispatch(setTripStart());
    getAll({ url: GET_ALL_TRIPS })
      .then((data: any) => {
        if (data === undefined) {
          Swal.fire({
            text: "Failed to fetch trips due to connection refused",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          dispatch(setTripEnd());
          dispatch(setTrips([]));
          dispatch(setFilterTrips([]));
          return;
        }

        if (data.success) {
          dispatch(setTrips(data.data || []));
          dispatch(setFilterTrips(data.data || []));
        } else {
          dispatch(setTrips([]));
          dispatch(setFilterTrips([]));
        }
        dispatch(setTripEnd());
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
        dispatch(setTripEnd());
        dispatch(setTrips([]));
        dispatch(setFilterTrips([]));
      });
  };

  const handleSearch = (e: any) => {
    const searchKey = e.target.value.toLowerCase();
    setSearchValue(searchKey);

    const filteredData = trips.filter(
      (item: any) =>
        item?.title?.toLowerCase().includes(searchKey) ||
        item?.vehicle?.registrationNo?.toLowerCase().includes(searchKey) ||
        item?.driver?.name?.toLowerCase().includes(searchKey) ||
        item?.status?.toLowerCase().includes(searchKey)
    );
    dispatch(setFilterTrips(filteredData));
  };

  const handleRowClicked = (row: any) => {
    // Navigate to trip details page
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/trip-management/trips/view/${row._id}`
    );
  };

  const handleCreateTrip = () => {
    navigate(
      `${process.env.PUBLIC_URL}/company/modules/trip-management/trips/create-trip`
    );
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  const calculateTripDuration = (checkPoints: any[]) => {
    if (!checkPoints || checkPoints.length < 2) return "-";

    // Find START and DESTINATION checkpoints
    const startPoint = checkPoints.find((cp) => cp.stopType === "START");
    const destinationPoint = checkPoints.find(
      (cp) => cp.stopType === "DESTINATION"
    );

    if (!startPoint || !destinationPoint) return "-";

    // Get start time
    const startTime = new Date(startPoint.scheduledArrivalTime);

    // Get end time (destination arrival + stay time)
    const destinationArrival = new Date(destinationPoint.scheduledArrivalTime);
    const endTime = new Date(
      destinationArrival.getTime() + destinationPoint.stayTimeMin * 60000
    );

    // Calculate duration in milliseconds
    const durationMs = endTime.getTime() - startTime.getTime();

    // Convert to hours and minutes
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hours, ${minutes} minutes`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else if (minutes > 0) {
      return `${minutes} minutes`;
    }
    return "-";
  };

  const tripColumns = [
    // {
    //   name: "S.No.",
    //   selector: (row: any, index?: number) =>
    //     index !== undefined ? index + 1 : 0,
    //   sortable: false,
    //   width: "7%",
    // },
    {
      name: "Trip Title",
      selector: (row: any) => row.title,
      sortable: true,
      width: "20%",
    },
    {
      name: "Vehicle",
      selector: (row: any) => row.vehicle?.registrationNo || "-",
      sortable: true,
      width: "15%",
    },
    {
      name: "Driver",
      selector: (row: any) => row.driver?.name || "-",
      sortable: true,
      width: "10%",
    },
    {
      name: "Checkpoints",
      selector: (row: any) => row.checkPoints?.length || 0,
      sortable: true,
      center: true,
      width: "12%",
    },
    {
      name: "Time Duration",
      selector: (row: any) => calculateTripDuration(row.checkPoints),
      sortable: false,
      width: "12%",
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
            color: "white",
            fontWeight: "600",
            backgroundColor:
              row.status === "COMPLETED"
                ? "#28a745"
                : row.status === "IN_PROGRESS"
                ? "#007bff"
                : row.status === "SCHEDULED"
                ? "#ffc107"
                : row.status === "CANCELLED"
                ? "#dc3545"
                : "#6c757d",
          }}
        >
          {row.status.replace("_", " ")}
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row: any) => formatDateTime(row.createdAt),
      sortable: true,
      width: "15%",
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
        data={filterTrips}
        pagination
        progressPending={loading}
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
