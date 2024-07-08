import { Col, Container, Row, Input, Form, Card } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { setup } from "../../../utils/Constant";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../CssConstaints/Style.css";
import {
  setBanks,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/BankSlice";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import BanksList from "./BanksList";
import BanksListNav from "./BanksListNav";


const Banks = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { banks, filterBanks, isConnected } = useSelector(
    (state: any) => state.banks
  );
  // const [filteredCountries, setFilteredCountries]: any = useState([]);
  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);
  const filterBankss = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterBanks.filter((bank: any, index: any) => {
      return bank.name.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setBanks(filtered));

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
            mainTitle="Banks List"
            parent={setup}
            title="Banks List"
          />
          <Container fluid>
            <Row className="project-card">
              <Col md={12} className="project-list">
                <Card>
                  <BanksListNav />
                  <Col md={12}>
                    <input
                    className="global-search-field"
                      type="text"
                      placeholder="Type to Search.."
                      value={searchValue}
                      onChange={(e) => {
                        filterBankss(e);
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
                <BanksList />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Banks;
