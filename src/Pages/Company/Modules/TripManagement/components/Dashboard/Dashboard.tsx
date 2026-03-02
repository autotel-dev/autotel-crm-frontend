import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Button,
  Badge,
  Container,
} from "reactstrap";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { MdCheckCircle, MdWarning, MdError } from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import { PlusCircle } from "react-feather";
import TripMap from "./TripMap";
import { H4, H5 } from "../../../../../../AbstractElements";
import Breadcrumbs from "../../../../../../CommonElements/Breadcrumbs/Breadcrumbs";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { getAll } from "../../../../../../Utilities/api";
import {
  GET_ACTIVE_TRIPS,
  GET_LAST_TRIPS,
  GET_TRIP_DASHBOARD_METRICS,
} from "../../../../../../Utilities/api/apiEndpoints";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [activeViolationsList, setActiveViolationsList] = useState<any>([]);
  const [allTripsList, setAllTripsList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const fetchDashboardData = async () => {
      try {
        const metricsRes: any = await getAll({ url: GET_TRIP_DASHBOARD_METRICS });
        if (metricsRes?.success) {
          setDashboardMetrics(metricsRes.data);
        }

        const activeRes: any = await getAll({ url: GET_ACTIVE_TRIPS });
        if (activeRes?.success) {
          setActiveViolationsList(activeRes.data);
        }

        const tripsRes: any = await getAll({ url: GET_LAST_TRIPS });
        if (tripsRes?.success) {
          setAllTripsList(tripsRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data
  const stats = {
    totalActiveTrips: 0,
    completedToday: 0,
    tripsInCompliance: 0,
    compliancePercentage: 100,
    complianceTrend: "+5%",
    activeViolations: 0,
    pendingRisks: 0,
  };

  // Dummy trip data
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

  const filters = [
    { label: "All", color: "#35bfbf" },
    { label: "Compliant", color: "#4CAF50" },
    { label: "Warning", color: "#FF9800" },
    { label: "Critical", color: "#F44336" },
  ];

  // Table columns
  const tripColumns: any = [
    {
      name: "S.No.",
      selector: (row: any) => row.sNo,
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
      name: "Status",
      selector: (row: any) => row.status,
      sortable: true,
      center: "true",
      width: "12%",
      cell: (row: any) => (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            padding: "5px",
            borderRadius: "5px",
            color: "black",
            fontSize: "12px",
            backgroundColor:
              row.status === "COMPLETED"
                ? "rgba(0, 255, 0, 0.3)"
                : row.status === "SCHEDULED"
                  ? "rgba(0, 100, 255, 0.2)"
                  : row.status === "ON_GOING"
                    ? "rgba(0, 255, 0, 0.1)"
                    : "rgba(255, 0, 0, 0.2)",
          }}
        >
          {row.status.replace("_", " ")}
        </div>
      ),
    },
    {
      name: "Dynamic ETA",
      selector: (row: any) => row.dynamicEta,
      sortable: true,
      width: "13%",
    },
  ];

  const statsCards = [
    {
      title: "Total Active Trips",
      value: dashboardMetrics?.totalActive ?? 0,
      subtitle: "",
      badgeColor: "primary",
      icon: <TbRoute color="#35bfbf" size={18} />,
      percentage: "",
      percentageColor: "dark",
      arrowIcon: "arrow-up",
    },
    {
      title: "Trips In Compliance",
      value: `${dashboardMetrics?.inCompliance ?? 0}`,
      subtitle: "",
      badgeColor: "primary",
      icon: <MdCheckCircle color="#35bfbf" size={18} />,
      percentage: "",
      percentageColor: "dark",
      arrowIcon: "arrow-up",
    },
    {
      title: "Active Violations",
      value: dashboardMetrics?.activeViolations ?? 0,
      subtitle: "",
      badgeColor: "primary",
      icon: <MdError color="#35bfbf" size={18} />,
      percentage: "",
      percentageColor: "success",
      arrowIcon: "arrow-down",
    },
    {
      title: "Pending Risks",
      value: dashboardMetrics?.pendingRisks ?? 0,
      subtitle: "",
      badgeColor: "primary",
      icon: <MdWarning color="#35bfbf" size={18} />,
      percentage: "",
      percentageColor: "success",
      arrowIcon: "arrow-down",
    },
  ];

  return (
    <div>
      {/* Breadcrumbs - SAIO Style */}
      <div style={{ margin: "-10px 30px 0px 15px" }}>
        <Breadcrumbs
          mainTitle="Dashboard"
          parent="Trip Management"
          title="Dashboard"
        />
      </div>

      <Container
        fluid
        className="dashboard_default"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Stats Cards - SAIO Style */}
        <Row className="widget-grid">
          {statsCards.map((data, index) => (
            <Col
              xxl="3"
              xl="3"
              lg="6"
              sm="12"
              className="box-col-3"
              key={index}
            >
              <Card className="total-earning">
                <CardBody>
                  <Row>
                    <Col sm="12" className="box-col-12">
                      <div className="d-flex">
                        <Badge
                          style={{
                            fontSize: "1rem",
                            padding: "0.2rem 0.5rem",
                            width: "40px",
                            height: "40px",
                          }}
                          color="transparent"
                          className={`bg-light-${data.badgeColor} badge-rounded font-primary me-2`}
                        >
                          {data.icon}
                        </Badge>
                        <div className="flex-grow-1">
                          <H4>{data.title}</H4>
                        </div>
                      </div>
                      <div style={{ margin: "15px 0px" }}></div>
                      <H5>{data.value}</H5>
                      <div style={{ margin: "15px 0px" }}></div>
                      {/* <P2 className="d-flex">
                      <span className={`bg-light-${data.percentageColor} me-2`}>
                        <SVG iconId={data.arrowIcon} />
                      </span>
                      <span className={`font-${data.percentageColor} me-2`}>
                        {data.percentage} %
                      </span>
                    </P2> */}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Map and Active Violations Section - Side by Side */}
        <Row style={{ marginBottom: "20px" }}>
          {/* Map Section - 70% Width */}
          <Col
            style={{
              maxWidth: "70%",
              minWidth: "70%",
              paddingRight: "10px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ overflow: "hidden", height: "100%" }}
            >
              <Card
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  height: "100%",
                }}
              >
                <CardBody style={{ padding: "20px" }}>
                  {/* Search Bar and Filters in one row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "15px",
                      alignItems: "center",
                    }}
                  >
                    {/* Search Bar */}
                    <div style={{ position: "relative", flex: 1 }}>
                      <FaSearch
                        style={{
                          position: "absolute",
                          left: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                        }}
                      />
                      <Input
                        type="text"
                        placeholder="Search trips, vehicles, drivers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          paddingLeft: "45px",
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          height: "45px",
                        }}
                      />
                    </div>

                    {/* Filter Buttons */}
                    {/* {filters.map((filter) => (
                      <Button
                        key={filter.label}
                        onClick={() => setActiveFilter(filter.label)}
                        style={{
                          backgroundColor:
                            activeFilter === filter.label
                              ? filter.color
                              : "white",
                          color:
                            activeFilter === filter.label ? "white" : "#6c757d",
                          border: `1px solid ${
                            activeFilter === filter.label
                              ? filter.color
                              : "#dee2e6"
                          }`,
                          padding: "8px 20px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                          height: "45px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {filter.label}
                      </Button>
                    ))} */}
                  </div>

                  {/* Google Map */}
                  <div
                    style={{
                      height: "450px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <TripMap
                      activeViolations={activeViolationsList}
                      selectedViolation={selectedViolation}
                      onMarkerClose={() => setSelectedViolation(null)}
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </Col>

          {/* Active Violations Section - 30% Width */}
          <Col
            style={{
              maxWidth: "30%",
              minWidth: "30%",
              paddingLeft: "10px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ overflow: "hidden", height: "100%" }}
            >
              <Card
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  height: "100%",
                }}
              >
                <CardBody style={{ padding: "20px", paddingBottom: "0px" }}>
                  {/* Header matching stats cards style */}
                  <div className="d-flex" style={{ marginBottom: "15px" }}>
                    {/* <Badge
                      style={{
                        fontSize: "1rem",
                        padding: "0.2rem 0.5rem",
                        width: "40px",
                        height: "40px",
                      }}
                      color="transparent"
                      className="bg-light-primary badge-rounded font-primary me-2"
                    >
                      <MdCheckCircle color="#35bfbf" size={18} />
                    </Badge> */}
                    <div className="flex-grow-1">
                      <H4>Active Violations</H4>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "10px",
                      paddingBottom: "0px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      height: "490px",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    {activeViolationsList.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "150px 20px",
                        }}
                      >
                        <MdCheckCircle
                          size={64}
                          color="#4CAF50"
                          style={{ opacity: 0.5 }}
                        />
                        <h4
                          style={{
                            color: "#4CAF50",
                            marginTop: "15px",
                            fontWeight: "600",
                          }}
                        >
                          All Trips Compliant
                        </h4>
                        <p
                          style={{
                            color: "#6c757d",
                            fontSize: "14px",
                            margin: "10px 0 0 0",
                          }}
                        >
                          No active violations at this time
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {activeViolationsList.map((violation: any, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              padding: "12px",
                              backgroundColor: "white",
                              borderRadius: "8px",
                              borderLeft: "4px solid #F44336",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              cursor: "pointer",
                              transition: "transform 0.2s ease",
                            }}
                            onClick={() => setSelectedViolation(violation)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}>
                                {violation.registrationNo}
                              </span>
                              <span style={{ fontSize: "11px", color: "#6c757d" }}>
                                {new Date(violation.time).toLocaleTimeString()}
                              </span>
                            </div>
                            <div style={{ fontSize: "13px", color: "#F44336", marginBottom: "3px", fontWeight: "500" }}>
                              {violation.violation}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              Trip: {violation.tripTitle}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Active Trips Table - SAIO Style */}
        <Row style={{ width: "100%" }}>
          <Col sm={12}>
            <Card>
              <CardBody>
                <div
                  className="table-responsive support-table"
                  style={{ overflow: "auto", scrollbarWidth: "none" }}
                >
                  {/* Create Trip Button - SAIO Style */}
                  {/* <Row>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        paddingRight: "25px",
                      }}
                    >
                      <button
                        className={`btn ${userPersonalizationData?.buttonsAndBarsColor == null
                          ? "btn-primary"
                          : ""
                          }`}
                        style={{
                          color: "white",
                          backgroundColor: `${userPersonalizationData !== null &&
                            userPersonalizationData?.buttonsAndBarsColor
                            }`,
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          // Handle create trip
                        }}
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
                  </Row> */}

                  {/* Search Input - SAIO Style */}
                  <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col sm={12} md={12} lg={12} xl={12}>
                      <input
                        className="global-search-field"
                        type="text"
                        placeholder="Type to Search.."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Col>
                  </Row>

                  {/* DataTable - SAIO Style */}
                  <DataTable
                    columns={tripColumns}
                    data={allTripsList}
                    pagination
                    selectableRows
                    progressPending={loading}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
