import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Modal,
  ModalBody,
  Row,
  Table,
} from "reactstrap";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { H3, P } from "../../../../../../AbstractElements";
import { getAll } from "../../../../../../Utilities/api";
import { Select } from "antd";
import { GET_COMMANDS_BY_VEHICLE_ID, GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT } from "../../../../../../Utilities/api/apiEndpoints";

interface PropsTypes {
  isVisible: boolean;
  setIsVisible: any;
}

const VehicleCommandHistory: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
}) => {
  const { devices } = useSelector((state: any) => state.monitoring);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [commandsList, setCommandsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const tableHeader = [
    "IMEI",
    "Command Type",
    "Custom Data",
    "Description",
    "Status",
    "Result",
    "Date",
  ];

  useEffect(() => {
    if (isVisible) {
      getAll({ url: GET_ALL_VEHICLES_DROPDOWN_FOR_ALERT }).then((data: any) => {
        if (data?.success) {
          setVehiclesList(
            data.data.map((item: any) => ({
              ...item,
              value: item._id,
              label: item.registrationNo,
            })),
          );
        }
      });
    }
  }, [isVisible]);

  const fetchCommands = (vehicleId: string) => {
    setLoading(true);
    getAll({
      url: `${GET_COMMANDS_BY_VEHICLE_ID}?vehicleId=${vehicleId}&status=EXECUTED&page=1&limit=20`,
    }).then((data: any) => {
      if (data?.success) {
        setCommandsList(data.data.commands || []);
      }
      setLoading(false);
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => setIsVisible(!isVisible)}
      size="xl"
    >
      <div className="modal-header">
        <H3 className="modal-title">Vehicle Command History</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => setIsVisible(!isVisible)}
        ></Button>
      </div>
      <ModalBody>
        <Card>
          <CardBody>
            <Row>
              <FormGroup className="col-md-6">
                <P>Select Vehicle</P>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Vehicle"
                  optionFilterProp="children"
                  onChange={(val) => {
                    setSelectedVehicle(val);
                    fetchCommands(val);
                  }}
                  options={vehiclesList}
                  value={selectedVehicle}
                />
              </FormGroup>
            </Row>
            <div
              className="table-responsive theme-scrollbar"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              <Table className="display" id="command-history-table">
                <thead>
                  <tr>
                    {tableHeader.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={tableHeader.length} className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : commandsList.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeader.length} className="text-center">
                        No Commands Found
                      </td>
                    </tr>
                  ) : (
                    commandsList.map((cmd: any, index: number) => (
                      <tr key={index}>
                        <td>{cmd.imei || "N/A"}</td>
                        <td>{cmd.commandType}</td>
                        <td>{cmd.customData || "N/A"}</td>
                        <td>{cmd.description || "N/A"}</td>
                        <td>
                          <span className={`badge ${cmd.status === 'EXECUTED' ? 'bg-success' : 'bg-warning'}`}>
                            {cmd.status}
                          </span>
                        </td>
                        <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cmd.commandResult}>
                          {cmd.commandResult || "N/A"}
                        </td>
                        <td>{formatDateTime(cmd.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
};

export default VehicleCommandHistory;
