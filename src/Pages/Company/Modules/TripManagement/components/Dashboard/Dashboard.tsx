import React, { useState } from "react";
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

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );

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

  const statsCards = [
    {
      title: "Total Active Trips",
      value: stats.totalActiveTrips,
      subtitle: `${stats.completedToday} completed today`,
      badgeColor: "primary",
      icon: <TbRoute color="#35bfbf" size={18} />,
      percentage: "+12.5",
      percentageColor: "dark",
      arrowIcon: "arrow-up",
    },
    {
      title: "Trips In Compliance",
      value: `${stats.tripsInCompliance} (${stats.compliancePercentage}%)`,
      subtitle: stats.complianceTrend + " vs last week",
      badgeColor: "primary",
      icon: <MdCheckCircle color="#35bfbf" size={18} />,
      percentage: "+8.2",
      percentageColor: "dark",
      arrowIcon: "arrow-up",
    },
    {
      title: "Active Violations",
      value: stats.activeViolations,
      subtitle: "",
      badgeColor: "primary",
      icon: <MdError color="#35bfbf" size={18} />,
      percentage: "-15.3",
      percentageColor: "success",
      arrowIcon: "arrow-down",
    },
    {
      title: "Pending Risks",
      value: stats.pendingRisks,
      subtitle: "",
      badgeColor: "primary",
      icon: <MdWarning color="#35bfbf" size={18} />,
      percentage: "-22.7",
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
                    <TripMap />
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
                <CardBody style={{ padding: "20px" }}>
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
                      textAlign: "center",
                      padding: "150px 20px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      height: "95%",
                    }}
                  >
                    <MdCheckCircle
                      size={64}
                      color="primary"
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
                  </Row>

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
                    data={tripData}
                    pagination
                    selectableRows
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
