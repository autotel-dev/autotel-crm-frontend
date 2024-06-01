import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";


import ComplainTypeListNav from "./ComplainTypeListNav";
import ComplainTypeList from "./ComplainTypeList";
import { setComplainTypePriorities, setComplainsTypes, setIsConnected } from "../../../ReaduxToolkit/Reducer/ComplainsTypeSlice";
import { getAll } from "../../../Utilities/api";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";

const ComplainType = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { complainTypes, filterComplainTypes, isConnected } = useSelector(
    (state: any) => state.complainTypes
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterCountriess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterComplainTypes.filter((complainType: any, index: any) => {
      return complainType.title.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setComplainsTypes(filtered));

    // console.log(filtered);
  };

  useEffect(() => {
    getAll({ url: "complaint-center/get-priorty-status-types" }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setComplainTypePriorities(data.data.internalComplaintPriortyStatusTypes));
        }
      }
    });
  }, [])


  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Complain Type List"
            parent={setup}
            title="Complain Type List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <ComplainTypeListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterCountriess(e);
                      }}
                      // style={{
                      //   backgroundColor: "#f1f1f1",
                      //   borderRadius: "5px",
                      //   padding: "12px",
                      //   height:"40px",
                      //   margin: "15px",
                      //   width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                      //   border: "none",
                      //   outline: "none", // Removing default border outline
                      // }}
                    />
                  </Col>
                </Card>
              </Col>
              <Col sm={12}>
                <ComplainTypeList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default ComplainType;
