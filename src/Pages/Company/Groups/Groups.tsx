import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import GroupsListNav from "./GroupsListNav";
import GroupsList from "./GroupsList";
import { setGroup ,setIsConnected } from "../../../ReaduxToolkit/Reducer/GroupSlice";



const Groups = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { group, filterGroups, isConnected } = useSelector(
    (state: any) => state.group
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterGroupss = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterGroups.filter((group: any, index: any) => {
      return group.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setGroup(filtered));

    // console.log(filtered);
  };

  // Update original countries whenever Redux countries change

  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs
            mainTitle="Groups List"
            parent={setup}
            title="Groups List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <GroupsListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterGroupss(e);
                      }}
                      // style={{
                      //   backgroundColor: "#f1f1f1",
                      //   borderRadius: "5px",
                      //   padding: "12px",
                      //   margin: "15px",
                      //   height:"40px",
                      //   width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                      //   border: "none",
                      //   outline: "none", // Removing default border outline
                      // }}
                    />
                  </Col>
                </Card>
              </Col>
              <Col sm={12}>
                <GroupsList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Groups;
