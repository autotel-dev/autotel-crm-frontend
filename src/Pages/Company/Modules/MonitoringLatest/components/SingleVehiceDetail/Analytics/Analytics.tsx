import React from "react";
import "./Analytics.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaRoad, FaClock, FaGasPump, FaTachometerAlt } from "react-icons/fa";
import { IoSpeedometerOutline } from "react-icons/io5";
import { MdSpeed } from "react-icons/md";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.5, type: "spring", stiffness: 100 },
  },
};

const chartVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Analytics = () => {
  const { selectedSingleDevice } = useSelector(
    (state: any) => state.monitoring
  );

  // Mock analytics data - replace with actual data from your API
  const analyticsData = {
    totalDistance: "1,245 km",
    totalTrips: 48,
    avgSpeed: selectedSingleDevice?.latestPosition?.speed
      ? Number(selectedSingleDevice.latestPosition.speed).toFixed(1)
      : "0",
    currentSpeed: selectedSingleDevice?.latestPosition?.speed
      ? Number(selectedSingleDevice.latestPosition.speed).toFixed(1)
      : "0",
    engineHours: "124.5 hrs",
    fuelEfficiency: "12.5 km/L",
    idleTime: "4.2 hrs",
    maxSpeed: "120 km/h",
  };

  const statsCards = [
    {
      icon: FaRoad,
      label: "Total Distance",
      value: analyticsData.totalDistance,
      color: "#6dbfb8",
      bgColor: "rgba(109, 191, 184, 0.1)",
    },
    {
      icon: FaTachometerAlt,
      label: "Total Trips",
      value: analyticsData.totalTrips,
      color: "#4CAF50",
      bgColor: "rgba(76, 175, 80, 0.1)",
    },
    {
      icon: MdSpeed,
      label: "Avg Speed",
      value: `${analyticsData.avgSpeed} km/h`,
      color: "#FF9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
    },
    {
      icon: FaClock,
      label: "Engine Hours",
      value: analyticsData.engineHours,
      color: "#9C27B0",
      bgColor: "rgba(156, 39, 176, 0.1)",
    },
  ];

  const secondaryStats = [
    {
      icon: IoSpeedometerOutline,
      label: "Current Speed",
      value: `${analyticsData.currentSpeed} km/h`,
      color: "#2196F3",
    },
    {
      icon: FaGasPump,
      label: "Fuel Efficiency",
      value: analyticsData.fuelEfficiency,
      color: "#E91E63",
    },
    {
      icon: FaClock,
      label: "Idle Time",
      value: analyticsData.idleTime,
      color: "#FF5722",
    },
    {
      icon: FaTachometerAlt,
      label: "Max Speed",
      value: analyticsData.maxSpeed,
      color: "#795548",
    },
  ];

  // Mock chart data for speed over time
  const speedData = [20, 45, 60, 35, 50, 75, 55, 40, 65, 80, 45, 30];
  const maxChartHeight = 80;

  return (
    <div className="analytics-container">
      {/* Primary Stats Cards */}
      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            variants={cardVariants}
            style={{
              backgroundColor: stat.bgColor,
              borderLeft: `4px solid ${stat.color}`,
            }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Speed Chart */}
      <motion.div
        className="chart-container"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="chart-header">
          <h3>Speed Overview (Last 12 Data Points)</h3>
        </div>
        <div className="chart-content">
          {speedData.map((speed, index) => {
            const barHeight = (speed / Math.max(...speedData)) * maxChartHeight;
            return (
              <motion.div
                key={index}
                className="chart-bar-wrapper"
                initial={{ height: 0 }}
                animate={{ height: `${maxChartHeight}px` }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <motion.div
                  className="chart-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}px` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  style={{
                    backgroundColor:
                      speed > 70
                        ? "#FF5722"
                        : speed > 40
                        ? "#6dbfb8"
                        : "#4CAF50",
                  }}
                >
                  <span className="bar-value">{speed}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        className="secondary-stats"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {secondaryStats.map((stat, index) => (
          <motion.div
            key={index}
            className="secondary-stat-item"
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div
              className="secondary-stat-icon"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon size={20} color={stat.color} />
            </div>
            <div className="secondary-stat-content">
              <div className="secondary-stat-label">{stat.label}</div>
              <div className="secondary-stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Analytics;
