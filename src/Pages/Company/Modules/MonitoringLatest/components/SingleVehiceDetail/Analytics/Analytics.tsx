import React from "react";
import "./Analytics.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaRoad,
  FaClock,
  FaParking,
  FaPlay,
  FaPause,
  FaStop,
  FaBan,
  FaChartLine,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaGasPump,
  FaRoute,
  FaCarSide
} from "react-icons/fa";
import { MdSpeed, MdLocalGasStation } from "react-icons/md";
import { IoSpeedometerOutline } from "react-icons/io5";
import { BiTrip } from "react-icons/bi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const Analytics = () => {
  const { selectedSingleDevice, deviceAnalytics } = useSelector(
    (state: any) => state.monitoring
  );

  // Extract analytics from Redux state
  const analytics = deviceAnalytics?.data || deviceAnalytics;

  const analyticsData = {
    movingTime: analytics?.movingDuration || "6.5h",
    idleTime: analytics?.idleDuration || "2.3h",
    stoppedTime: analytics?.stoppedDuration || "4.8h",
    inactiveTime: analytics?.inactiveDuration || "10.4h",
    totalDistance: analytics?.distanceForDay || "245km",
    avgDistance: "15.3km",
    totalTrips: 16,
    maxSpeed: analytics?.maxSpeed ? analytics.maxSpeed.split(" ")[0] : "98",
    avgSpeed: analytics?.avgSpeed ? analytics.avgSpeed.split(" ")[0] : "45",
    currentSpeed: selectedSingleDevice?.latestPosition?.speed
      ? Number(selectedSingleDevice.latestPosition.speed).toFixed(0)
      : "0",
    fuelRemaining: "32L",
    fuelAvg: "8.5",
  };

  // Activity distribution data (in hours) - converting from raw ms if available
  const activityData = {
    moving: analytics?.raw?.movingDurationMs
      ? analytics.raw.movingDurationMs / (1000 * 3600)
      : 6.5,
    idle: analytics?.raw?.idleDurationMs
      ? analytics.raw.idleDurationMs / (1000 * 3600)
      : 2.3,
    stopped: analytics?.raw?.stopDurationMs
      ? analytics.raw.stopDurationMs / (1000 * 3600)
      : 4.8,
    inactive: analytics?.raw?.inactiveDurationMs
      ? analytics.raw.inactiveDurationMs / (1000 * 3600)
      : 10.4,
  };

  // 8 Compact Stats Cards
  const statsCards = [
    {
      icon: FaPlay,
      label: "Moving",
      value: analyticsData.movingTime,
      color: "#4CAF50",
    },
    {
      icon: FaPause,
      label: "Idle",
      value: analyticsData.idleTime,
      color: "#FF9800",
    },
    {
      icon: FaStop,
      label: "Stopped",
      value: analyticsData.stoppedTime,
      color: "#F44336",
    },
    {
      icon: FaBan,
      label: "Inactive",
      value: analyticsData.inactiveTime,
      color: "#9C27B0",
    },
    {
      icon: FaRoad,
      label: "Distance",
      value: analyticsData.totalDistance,
      color: "#2196F3",
    },
    {
      icon: BiTrip,
      label: "Trips",
      value: analyticsData.totalTrips,
      color: "#00BCD4",
    },
    {
      icon: MdSpeed,
      label: "Avg Speed",
      value: `${analyticsData.avgSpeed}km/h`,
      color: "#FF5722",
    },
    {
      icon: FaTachometerAlt,
      label: "Max Speed",
      value: `${analyticsData.maxSpeed}km/h`,
      color: "#E91E63",
    },
  ];

  // Mock chart data - Speed over time
  const speedData = [0, 25, 45, 38, 52, 68, 55, 42, 58, 72, 48, 35, 20];
  const timeLabels = ['0m', '5m', '10m', '15m', '20m', '25m', '30m', '35m', '40m', '45m', '50m', '55m', '60m'];
  const fleetUsageData = [12, 25, 18, 32, 28, 15, 22, 35, 28, 20, 16, 24];

  const totalMs = (analytics?.raw?.movingDurationMs || 0) +
                  (analytics?.raw?.idleDurationMs || 0) +
                  (analytics?.raw?.stopDurationMs || 0) +
                  (analytics?.raw?.inactiveDurationMs || 0);

  const formatMs = (ms: number) => {
    if (ms <= 0) return "0h 0m";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || (hours === 0 && minutes === 0)) result += `${seconds}s`;
    return result.trim() || "0s";
  };

  const totalHoursSum = Object.values(activityData).reduce((a, b) => a + b, 0);
  const formattedTotalDuration = totalMs > 0 ? formatMs(totalMs) : (totalHoursSum > 0 ? `${totalHoursSum.toFixed(1)} hrs` : "0h 0m");
  const totalHours = totalHoursSum || 1;

  // Fuel data
  const fuelData = {
    totalCapacity: 60,
    remaining: 32,
    avgConsumption: 8.5,
    tripUsage: 12.5,
    estimatedRange: 180,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "auto",
        padding: "8px 0",
        gap: "12px",
      }}
    >
      {/* Compact Stats Cards - 8 cards in rows of 4 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              cursor: "pointer",
              borderTop: `3px solid ${stat.color}`,
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: `${stat.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <stat.icon size={14} color={stat.color} />
            </div>
            <div style={{ textAlign: "center", width: "100%" }}>
              <div
                style={{
                  fontSize: "8px",
                  color: "#999",
                  marginBottom: "1px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: stat.color,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section - 2 rows, 2 charts per row, plus fuel chart */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Row 1: Speed Overview & Fleet Usage */}
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Speed Overview Chart - Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              flex: "1 1 50%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaChartLine size={16} color="#6dbfb8" />
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#333" }}>
                  Speed vs Time - Trip Journey
                </h4>
              </div>
              <div style={{ fontSize: "9px", color: "#6dbfb8", fontWeight: "600" }}>
                Last 60 minutes
              </div>
            </div>

            <div style={{ position: "relative", height: "100px", paddingLeft: "25px", paddingBottom: "15px" }}>
              {/* Y-axis labels */}
              <div style={{ position: "absolute", left: 0, top: 0, height: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {[80, 60, 40, 20, 0].map((speed, i) => (
                  <div key={i} style={{ fontSize: "8px", color: "#999", textAlign: "right", width: "20px" }}>
                    {speed}
                  </div>
                ))}
              </div>

              <svg width="calc(100% - 25px)" height="100" style={{ overflow: "visible", marginLeft: "0px" }}>
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 25}
                    x2="100%"
                    y2={i * 25}
                    stroke="#f5f5f5"
                    strokeWidth="1"
                  />
                ))}

                {/* Area fill */}
                <motion.polygon
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 1.5 }}
                  fill="#6dbfb8"
                  points={`0,100 ${speedData
                    .map((speed, i) => {
                      const x = (i / (speedData.length - 1)) * 100;
                      const y = 100 - (speed / 80) * 80;
                      return `${x}%,${y}`;
                    })
                    .join(" ")} 100%,100`}
                />

                {/* Line chart */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  fill="none"
                  stroke="#6dbfb8"
                  strokeWidth="2.5"
                  points={speedData
                    .map((speed, i) => {
                      const x = (i / (speedData.length - 1)) * 100;
                      const y = 100 - (speed / 80) * 80;
                      return `${x}%,${y}`;
                    })
                    .join(" ")}
                />

                {/* Data points */}
                {speedData.map((speed, i) => {
                  const x = (i / (speedData.length - 1)) * 100;
                  const y = 100 - (speed / 80) * 80;
                  return (
                    <motion.circle
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.08 * i, duration: 0.3 }}
                      cx={`${x}%`}
                      cy={y}
                      r="3"
                      fill="white"
                      stroke="#6dbfb8"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* X-axis labels (time) */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", paddingLeft: "0px" }}>
                {timeLabels.filter((_, i) => i % 3 === 0).map((label, i) => (
                  <div key={i} style={{ fontSize: "8px", color: "#999", textAlign: "center" }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "9px", color: "#999", marginTop: "5px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
              <div style={{ width: "10px", height: "2px", backgroundColor: "#6dbfb8" }}></div>
              <span>Speed (km/h) over Time</span>
            </div>
          </motion.div>

          {/* Fleet Usage Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              flex: "1 1 50%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <FaMapMarkerAlt size={16} color="#2196F3" />
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#333" }}>
                  Fleet Usage Analytics
                </h4>
              </div>
              <div style={{ fontSize: "9px", color: "#666", marginBottom: "6px" }}>Yesterday's Performance</div>
              <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "8px", color: "#999" }}>Total Usage</div>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#2196F3" }}>
                    {analyticsData.totalDistance}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "8px", color: "#999" }}>Avg/Object</div>
                  <div style={{ fontSize: "13px", fontWeight: "bold", color: "#2196F3" }}>
                    {analyticsData.avgDistance}
                  </div>
                </div>
              </div>
            </div>
            {/* Bar chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "70px" }}>
              {fleetUsageData.map((value, i) => {
                const height = (value / Math.max(...fleetUsageData)) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.04 * i, duration: 0.5 }}
                    style={{
                      flex: 1,
                      background: `linear-gradient(to top, #2196F3, #64B5F6)`,
                      borderRadius: "3px 3px 0 0",
                      minWidth: "6px",
                      position: "relative",
                    }}
                  />
                );
              })}
            </div>
            <div style={{ fontSize: "9px", color: "#999", marginTop: "6px", textAlign: "center" }}>
              12-hour duration breakdown
            </div>
          </motion.div>
        </div>

        {/* Row 2: Total Activity & Trip Performance */}
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Total Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              flex: "1 1 50%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <FaClock size={16} color="#FF9800" />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#333" }}>
                Activity Distribution
              </h4>
            </div>

            {/* Horizontal stacked bar */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  height: "24px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {Object.entries(activityData).map(([key, value], i) => {
                  const colors: any = {
                    moving: "#4CAF50",
                    idle: "#FF9800",
                    stopped: "#F44336",
                    inactive: "#9C27B0",
                  };
                  const percentage = (value / totalHours) * 100;
                  return (
                    <motion.div
                      key={key}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.1 * i, duration: 0.7 }}
                      style={{
                        backgroundColor: colors[key],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "8px",
                        color: "white",
                        fontWeight: "700",
                      }}
                    >
                      {percentage > 8 && `${percentage.toFixed(0)}%`}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {Object.entries(activityData).map(([key, value]) => {
                const colors: any = {
                  moving: "#4CAF50",
                  idle: "#FF9800",
                  stopped: "#F44336",
                  inactive: "#9C27B0",
                };
                const icons: any = {
                  moving: FaPlay,
                  idle: FaPause,
                  stopped: FaStop,
                  inactive: FaBan,
                };
                const Icon = icons[key];
                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "5px 6px",
                      backgroundColor: `${colors[key]}10`,
                      borderRadius: "6px",
                    }}
                  >
                    <Icon size={11} color={colors[key]} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "8px", color: "#666", textTransform: "capitalize" }}>
                        {key}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: "bold", color: colors[key] }}>
                        {analyticsData[`${key}Time` as keyof typeof analyticsData]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "10px",
                padding: "6px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "8px", color: "#999" }}>Total Duration</div>
              <div style={{ fontSize: "15px", fontWeight: "bold", color: "#333" }}>
                {formattedTotalDuration}
              </div>
            </div>
          </motion.div>

          {/* Trip Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              flex: "1 1 50%",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <MdSpeed size={16} color="#E91E63" />
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#333" }}>
                Trip Performance
              </h4>
            </div>

            {/* Key metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Average Speed", value: `${analyticsData.avgSpeed}km/h`, color: "#2196F3", icon: MdSpeed },
                { label: "Max Speed", value: `${analyticsData.maxSpeed}km/h`, color: "#F44336", icon: FaTachometerAlt },
                { label: "Total Trips", value: analyticsData.totalTrips, color: "#4CAF50", icon: BiTrip },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: `${metric.color}08`,
                    borderRadius: "6px",
                    borderLeft: `3px solid ${metric.color}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        backgroundColor: metric.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <metric.icon size={14} color="white" />
                    </div>
                    <div style={{ fontSize: "10px", color: "#666", fontWeight: "500" }}>
                      {metric.label}
                    </div>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "bold", color: metric.color }}>
                    {metric.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Efficiency Score */}
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "6px",
                textAlign: "center",
                color: "white",
              }}
            >
              <div style={{ fontSize: "9px", opacity: 0.9, marginBottom: "3px" }}>
                Efficiency Score
              </div>
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>85%</div>
              <div style={{ fontSize: "8px", opacity: 0.8, marginTop: "2px" }}>
                Speed • Distance • Activity
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Fuel Usage Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <FaGasPump size={16} color="#FF6F00" />
            <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#333" }}>
              Fuel Usage & Analytics
            </h4>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            {/* Fuel Tank Visualization */}
            <div style={{ flex: "0 0 200px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Digital Fuel Tank */}
              <div
                style={{
                  position: "relative",
                  height: "120px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "2px solid #e0e0e0",
                }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(fuelData.remaining / fuelData.totalCapacity) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, #FF6F00, #FFA726)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                    {fuelData.remaining}L
                  </div>
                </motion.div>
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    color: "#999",
                    fontWeight: "600",
                  }}
                >
                  {((fuelData.remaining / fuelData.totalCapacity) * 100).toFixed(0)}%
                </div>
              </div>
              <div style={{ textAlign: "center", fontSize: "9px", color: "#999" }}>
                Capacity: {fuelData.totalCapacity}L
              </div>
            </div>

            {/* Fuel Stats Grid */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {[
                {
                  label: "Remaining Fuel",
                  value: `${fuelData.remaining}L`,
                  subValue: `${((fuelData.remaining / fuelData.totalCapacity) * 100).toFixed(0)}%`,
                  color: "#4CAF50",
                  icon: FaGasPump,
                },
                {
                  label: "Avg Consumption",
                  value: `${fuelData.avgConsumption}L`,
                  subValue: "per 100km",
                  color: "#2196F3",
                  icon: MdLocalGasStation,
                },
                {
                  label: "Trip Usage",
                  value: `${fuelData.tripUsage}L`,
                  subValue: "current trip",
                  color: "#FF9800",
                  icon: BiTrip,
                },
                {
                  label: "Est. Range",
                  value: `${fuelData.estimatedRange}km`,
                  subValue: "approx.",
                  color: "#9C27B0",
                  icon: FaRoute,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  style={{
                    backgroundColor: `${item.color}08`,
                    borderRadius: "8px",
                    padding: "10px",
                    borderTop: `3px solid ${item.color}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      backgroundColor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <item.icon size={16} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: "8px", color: "#999", marginBottom: "2px" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: item.color }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: "8px", color: "#666", fontStyle: "italic" }}>
                      {item.subValue}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fuel Efficiency Indicator */}
          <div
            style={{
              marginTop: "12px",
              padding: "8px 12px",
              background: "linear-gradient(90deg, #FF6F00 0%, #FFA726 100%)",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "600" }}>
              ⚡ Fuel Efficiency: Excellent
            </div>
            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
              {((fuelData.totalCapacity - fuelData.remaining) / (parseFloat(analyticsData.totalDistance) / 100)).toFixed(1)}L/100km
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
