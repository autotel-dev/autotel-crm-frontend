import { useState, useEffect, useRef } from "react";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  Table,
  Row,
} from "reactstrap";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4 } from "../../../../AbstractElements";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  dataList: any[];
  tableHeader: any[];
}

const ViewModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  dataList,
  tableHeader,
}) => {
  const containerRef = useRef(null);

  return (
    <Modal
      centered
      isOpen={isVisible}
      toggle={() => {
        setIsVisible(!isVisible);
      }}
      size="xl"
      onClosed={() => {
        // setValue("")
        setIsVisible(false);
      }}
    >
      <div className="modal-header">
        <H3 className="modal-title">View Report</H3>
        <Button
          color="transprant"
          className="btn-close"
          onClick={() => {
            // setValue("")
            setIsVisible(!isVisible);
          }}
        ></Button>
      </div>
      <ModalBody>
        <div
          //   ref={containerRef}
          className="table-responsive theme-scrollbar recent-wrapper"
          style={{
            overflowY: "scroll",
            maxHeight: "calc(66vh - 20px)", // Subtract scrollbar width from max height
            WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
            scrollbarWidth: "thin", // Specify scrollbar width
            WebkitBorderRadius: "5px", // For WebKit browsers (Chrome, Safari)
            MozBorderRadius: "5px", // For Mozilla Firefox
            borderRadius: "5px", // For other browsers
            scrollbarColor: "lightgray transparent", // Specify scrollbar color
          }}
          //   onScroll={handleScroll}
        >
          <div className="table-responsive theme-scrollbar recent-wrapper">
            <Table className="display order-wrapper" id="recent-order">
              <thead>
                <tr>
                  {tableHeader.map((data: any, index: any) => (
                    <th key={index} style={{ width: "7%" }}>
                      {data}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList.length == 0 ? (
                  <tr>
                    <td colSpan={7} style={{ fontSize: "25px" }}>
                      No Previous Alerts Found
                    </td>
                  </tr>
                ) : (
                  dataList.map((row: any, index: any) => (
                    <tr style={{ cursor: "pointer" }} key={index}>
                      <td style={{ width: "7%" }}>{row._id}</td>
                      <td style={{ width: "7%" }}>{row.eventId}</td>
                      <td style={{ width: "7%" }}>{row.deviceId}</td>
                      <td style={{ width: "7%" }}>{row.deviceName}</td>
                      <td style={{ width: "7%" }}>{row.latitude}</td>
                      <td style={{ width: "7%" }}>{row.longitude}</td>
                      <td style={{ width: "7%" }}>{row.speed}</td>
                      <td style={{ width: "7%" }}>{row.message}</td>
                      <td style={{ width: "7%" }}>{row.userRole}</td>
                      <td style={{ width: "7%" }}>{row.completionResponse}</td>
                      <td style={{ width: "7%" }}>{row.alertEventCloseDate}</td>
                      <td style={{ width: "7%" }}>{row.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>

        <Row
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            disabled={false}
            color="secondary"
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            style={{ flexWrap: "wrap", width: "20%", margin: "30px" }}
          >
            Cancel
          </Button>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ViewModal;
