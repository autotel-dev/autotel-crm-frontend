import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersListNav from "./UsersListNav";
import UsersList from "./UsersList";

const Countries = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Breadcrumbs mainTitle="Users List" parent={setup} title="Users" />
      <Container fluid>
        <Row className="project-card">
          <Col md={12} className="project-list">
            <Card>
              <UsersListNav />
              <Col md={12}>
                <input
                  type="text"
                  placeholder="Type to Search.."
                  // value={searchValue}
                  onChange={(e) => {
                    // filterCountriess(e);
                  }}
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderRadius: "5px",
                    padding: "15px",
                    margin: "15px",
                    width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                    border: "none",
                    outline: "none", // Removing default border outline
                  }}
                />
              </Col>
            </Card>
          </Col>
          <Col sm={12}>
            <UsersList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Countries;
