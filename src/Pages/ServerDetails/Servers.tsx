import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { provinceList, setup } from "../../utils/Constant";
import ServersListNav from "./ServersListNav";
import ServersList from "./ServersList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsConnected,
  setServers,
} from "../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import NoInternetConnection from "../NoInternetConnection/NoInternetConnection";

const Servers = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { filterServers, isConnected } = useSelector(
    (state: any) => state.serverDetails
  );
  useEffect(() => {
    dispatch(setIsConnected(false));
  },[]);
  const filterServerss = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterServers.filter((server: any, index: any) => {
      return server.companyName.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setServers(filtered));

    console.log(filtered);
  };
  
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Servers List"
            parent={setup}
            title="Servers List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <ServersListNav />
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterServerss(e);
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
                <ServersList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Servers;
