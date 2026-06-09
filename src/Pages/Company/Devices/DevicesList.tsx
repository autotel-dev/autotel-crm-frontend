import { Card, CardBody, Col, Container } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import { useEffect, useState } from "react";
import { getAll } from "../../../Utilities/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../CssConstaints/Style.css";
import { setDevices, setSelectedSingleDevice } from "../../../ReaduxToolkit/Reducer/MonitoringSlice";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { GET_PARSER_DEVICES } from "../../../Utilities/api/apiEndpoints";
import H7 from "../../../CommonElements/Headings/H7Element";
import { MapPin } from "react-feather";

const DevicesList = () => {
  const { devices } = useSelector((state: any) => state.monitoring);
  const { userPersonalizationData } = useSelector((state: any) => state.personalization);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [idd, setIdd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = devices?.filter((device: any) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    const regNo = device.vehicle?.registrationNo?.toLowerCase() || "";
    const customer = device.vehicle?.customer?.fullName?.toLowerCase() || "";
    const imei = device.vehicle?.imei?.toLowerCase() || "";
    return regNo.includes(lowerSearch) || customer.includes(lowerSearch) || imei.includes(lowerSearch);
  });

  function hexToRgb(hex: any) {
    if (!hex) return { r: 255, g: 255, b: 255 };
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }
  const rgbColor = hexToRgb(userPersonalizationData?.buttonsAndBarsColor);

  useEffect(() => {
    setLoading(true);
    getAll({ url: GET_PARSER_DEVICES })
      .then((data: any) => {
        setLoading(false);
        if (data && data.success && data.data) {
          const updatedDevices = data.data.map((device: any) => ({
            ...device,
            checked: true,
          }));
          dispatch(setDevices(updatedDevices));
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching devices:", err);
      });
  }, [dispatch]);

  const handleViewOnMap = (row: any) => {
    dispatch(setSelectedSingleDevice(row));
    navigate(`${process.env.PUBLIC_URL}/company/modules/monitoring`);
  };

  const getStatusText = (status: string) => {
    if (!status) return <span style={{ color: "red", fontWeight: "bold" }}>Stopped</span>;
    const lower = status.toLowerCase();
    if (lower === "moving") return <span style={{ color: "green", fontWeight: "bold" }}>Moving</span>;
    if (lower === "stopped" || lower === "stop") return <span style={{ color: "red", fontWeight: "bold" }}>Stopped</span>;
    if (lower === "idle") return <span style={{ color: "orange", fontWeight: "bold" }}>Idle</span>;
    return <span style={{ color: "purple", fontWeight: "bold" }}>{status == "unknown" || status == "inactive" ? "Inactive" : status}</span>;
  };

  const renderTableRows = () => {
    return filteredDevices?.map((row: any) => (
      <tr
        key={row._id || row.id}
        onMouseEnter={() => {
          setIsHovered(true);
          setIdd(row._id || row.id);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor:
            isHovered && idd === (row._id || row.id)
              ? userPersonalizationData == null
                ? "#D6EEEE"
                : `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.2)`
              : "transparent",
          transition: "background-color 0.3s",
        }}
      >
        <td>{row.vehicle?.registrationNo || "-"}</td>
        <td>
          {row.vehicle?.make?.name || "-"} / {row.vehicle?.model?.name || "-"}
        </td>
        <td>{row.vehicle?.customer?.fullName || "-"}</td>
        <td>{row.vehicle?.imei || "-"}</td>
        <td>{getStatusText(row.mainVehicleStatus)}</td>
        <td>
          <button
            className="btn btn-primary btn-sm"
            style={{
              backgroundColor: userPersonalizationData?.buttonsAndBarsColor || undefined,
              borderColor: userPersonalizationData?.buttonsAndBarsColor || undefined,
              whiteSpace: "nowrap",
            }}
            onClick={() => handleViewOnMap(row)}
          >
            View on Map
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <Card>
      <CommonHeader title="All Devices" />
      <CardBody>
        <div style={{ marginBottom: "15px" }}>
          <input
            className="global-search-field"
            type="text"
            placeholder="Search by Reg No, Customer Name, or IMEI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-responsive product-table">
          {loading ? (
            <>
              <Skeleton height="100px" width="100%" borderRadius="10px" />
              <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
              <Skeleton height="40px" width="100%" marginTop="10px" marginBottom="10" borderRadius="10px" />
            </>
          ) : filteredDevices?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Make / Model</th>
                  <th>Customer</th>
                  <th>IMEI</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          ) : (
             <H7>No Devices Found</H7>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default DevicesList;
