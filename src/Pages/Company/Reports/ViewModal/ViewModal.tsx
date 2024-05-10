import { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  ModalBody,
  Table,
  Row,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { H3, H4 } from "../../../../AbstractElements";

interface PropsTypes {
  isVisible: boolean; // Change 'boolean' to the actual type of isVisible
  setIsVisible: any;
  dataList: any[];
  tableHeader: any[];
  title: any;
}

const ViewModal: React.FC<PropsTypes> = ({
  isVisible,
  setIsVisible = () => {},
  dataList,
  tableHeader,
  title,
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
        <H3 className="modal-title">All Alert Events - {title}</H3>
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
                  <th style={{ width: "7%" }}>Event ID</th>
                  <th style={{ width: "7%" }}>Device ID</th>
                  <th style={{ width: "7%" }}>Device Name</th>
                  <th style={{ width: "6%" }}>Latitude</th>
                  <th style={{ width: "6%" }}>Longitude</th>
                  <th style={{ width: "7%" }}>Type</th>
                  <th style={{ width: "7%" }}>Speed</th>
                  <th style={{ width: "7%" }}>Message</th>
                  <th style={{ width: "7%" }}>User Role</th>
                  <th style={{ width: "7%" }}>Address</th>
                  <th style={{ width: "7%" }}>Completion Response</th>
                  <th style={{ width: "10%" }}>Alert Event Close Date</th>
                  <th style={{ width: "10%" }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {dataList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ fontSize: "25px" }}>
                      No Previous Alerts Found
                    </td>
                  </tr>
                ) : (
                  dataList.map((row: any, index: any) => (
                    <tr style={{ cursor: "pointer" }} key={index}>
                      <td style={{ width: "7%" }}>{row.eventId}</td>
                      <td style={{ width: "7%" }}>{row.deviceId}</td>
                      <td style={{ width: "7%" }}>{row.deviceName}</td>
                      <td style={{ width: "6%" }}>
                        {row.latitude.slice(0, 11)}
                      </td>
                      <td style={{ width: "6%" }}>
                        {row.longitude.slice(0, 11)}
                      </td>
                      <td style={{ width: "7%" }}>{row.type}</td>
                      <td style={{ width: "7%" }}>{row.speed}</td>
                      <td style={{ width: "7%" }}>{row.message}</td>
                      <td style={{ width: "7%" }}>{row.userRole}</td>
                      <td id="Popover">
                        {row.address == null
                          ? "N/A"
                          : row.address.length > 10
                          ? row.address.substring(0, 10) + "..."
                          : row.address}
                      </td>
                      {row.address != null && (
                        <UncontrolledPopover
                          placement="top"
                          trigger="hover"
                          target="Popover"
                        >
                          <PopoverHeader>Address</PopoverHeader>
                          <PopoverBody>{row.address}</PopoverBody>
                        </UncontrolledPopover>
                      )}
                      <td style={{ width: "7%" }}>{row.completionResponse}</td>
                      {row.alertEventCloseDate == "Not Completed" ? (
                        <td style={{ width: "10%" }}>
                          <div className="d-flex">
                            <div className="flex-grow-1 ms-2">
                              <div style={{ fontSize: "10px" }}>
                                {row.createdAt.slice(0, 10)}
                              </div>
                              <div style={{ fontSize: "10px" }}>
                                {row.createdAt.slice(11, 19)}
                              </div>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <td style={{ width: "10%" }}>
                          <div className="d-flex">
                            <div className="flex-grow-1 ms-2">
                              <div style={{ fontSize: "10px" }}>
                                {row.alertEventCloseDate.slice(0, 10)}
                              </div>
                              <div style={{ fontSize: "10px" }}>
                                {row.alertEventCloseDate.slice(11, 19)}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td style={{ width: "10%" }}>
                        <div className="d-flex">
                          <div className="flex-grow-1 ms-2">
                            <div style={{ fontSize: "10px" }}>
                              {row.createdAt.slice(0, 10)}
                            </div>
                            <div style={{ fontSize: "10px" }}>
                              {row.createdAt.slice(11, 19)}
                            </div>
                          </div>
                        </div>
                      </td>
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
