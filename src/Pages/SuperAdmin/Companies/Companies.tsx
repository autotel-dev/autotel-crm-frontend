import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonElements/Breadcrumbs/Breadcrumbs";
import { Href, UserCards, Users } from "../../../utils/Constant";
import { H1, H5, Image } from "../../../AbstractElements";
import { dynamicImage } from "../../../Service/index";
import SVG from "../../../utils/CommonSvgIcon/SVG";
import { Link } from "react-router-dom";
import CompaniesCardsFooter from "./CompaniesCardsFooter";
import SocialMediaIcons from "./SocialMediaIcons";
import { compainesCardData } from "./Data/CompaniesCardData";
import CompaniesListNav from "./CompaniesListNav";
import "../../../CssConstaints/Style.css";
import { useEffect, useState } from "react";
import Skeleton from "../../Utilities/Skeleton/Skeleton";
import { getAll } from "../../../Utilities/api";
import {
  setServers,
  setTimeZones,
  setCRMModules,
  setCities,
  setPackages,
  setCompaniesStart,
  setCompaniesEnd,
  setCompanies,
  setFilterCompanies,
  setPermissions,
  setIsConnected,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { setNoDataFound } from "../../../ReaduxToolkit/Reducer/NoDataFoundSlice";
import CompanyProfile from "../../../assets/companyProfile.png";
import Swal from "sweetalert2";
import NoInternetConnection from "../../Utilities/NoInternetConnection/NoInternetConnection";
import Loader from "../../Utilities/Loader/Loader";
import { GET_ALL_ACTIVE_CITIES, GET_ALL_ACTIVE_CRM_MODULES, GET_ALL_ACTIVE_PACKAGES, GET_ALL_ACTIVE_SERVERS, GET_ALL_COMPANIES, GET_ALL_PERMISSIONS, GET_ALL_TIMEZONES } from "../../../Utilities/api/apiEndpoints";
import { ERROR_MESSAGE } from "../../../Utilities/constants/constants";

const Companies = () => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { companies, filterCompanies, isConnected } = useSelector(
    (state: any) => state.companies
  );
  const [loading, setLoading] = useState(true);
  // const [filteredCountries, setFilteredCountries]: any = useState([]);

  const filterCompaniess = (e: any) => {
    const searchKey = e.target.value;
    setSearchValue(searchKey);
    const filtered = filterCompanies.filter((company: any, index: any) => {
      return company.fullName.toLowerCase().includes(searchKey.toLowerCase());
      // ^ Add 'return' statement here
    });

    dispatch(setCompanies(filtered));

    // console.log(filtered);
  };

  useEffect(() => {
    dispatch(setIsConnected(false));
  }, []);

  useEffect(() => {
    dispatch(setCompaniesStart());
    getAll({ url: GET_ALL_COMPANIES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data == undefined) {
        Swal.fire({
          text: "Companies not Found",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });

        dispatch(setCompanies([]));
        dispatch(setFilterCompanies([]));
        setLoading(false);
        dispatch(setCompaniesEnd());
        return;
      }

      if (data !== undefined) {
        dispatch(setNoDataFound(data.message));
        if (!data.success && data.message === ERROR_MESSAGE) {
          dispatch(setIsConnected(true));
          setLoading(false);
        }
        if (!data.success) {
          Swal.fire({
            text: `${data.message}`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setLoading(false);
        }
        if (data.success) {
          // console.log("hhg");
          dispatch(setCompanies(data.data));
          dispatch(setFilterCompanies(data.data));
          setLoading(false);
        }
      }
      dispatch(setCompaniesEnd());
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_TIMEZONES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setTimeZones(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setTimeZones([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_PERMISSIONS }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setPermissions(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setPermissions([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_SERVERS }).then(
      (data: any) => {
        // console.log("api call --- >", data);
        if (data !== undefined) {
          if (data.success) {
            // console.log("hhg");
            dispatch(setServers(data.data.activeServers));
          }
          if (!data.success) {
            // console.log("hhg");
            dispatch(setServers([]));
          }
        }
      }
    );
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_CRM_MODULES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setCRMModules(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setCRMModules([]));
        }
      }
    });
  }, []);

  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_CITIES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setCities(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setCities([]));
        }
      }
    });
  }, []);
  useEffect(() => {
    getAll({ url: GET_ALL_ACTIVE_PACKAGES }).then((data: any) => {
      // console.log("api call --- >", data);
      if (data !== undefined) {
        if (data.success) {
          // console.log("hhg");
          dispatch(setPackages(data.data));
        }
        if (!data.success) {
          // console.log("hhg");
          dispatch(setPackages([]));
        }
      }
    });
  }, []);
  return (
    <>
      {isConnected ? (
        <NoInternetConnection />
      ) : (
        <div>
          <Breadcrumbs title="" mainTitle="Companies" parent="Companies" />
          <Container fluid>
            <Col md={12} className="project-list">
              <Card>
                <CompaniesListNav />
                <Col md={12}>
                  <input
                    className="global-search-field"
                    type="text"
                    placeholder="Type to Search.."
                    value={searchValue}
                    onChange={(e) => {
                      filterCompaniess(e);
                    }}
                  // style={{
                  //   backgroundColor: "#f1f1f1",
                  //   borderRadius: "5px",
                  //   height:"40px",
                  //   padding: "12px",
                  //   margin: "15px",
                  //   width: "calc(100% - 30px)", // Adjusting width to accommodate padding and margin
                  //   border: "none",
                  //   outline: "none", // Removing default border outline
                  // }}
                  />
                </Col>
              </Card>
            </Col>
            {loading ? (
              // <div
              //   style={{
              //     display: "flex",
              //     justifyContent: "center",
              //     height: "80vh",
              //     backgroundColor: "white",
              //     alignItems: "center",
              //   }}
              // >
                <div style={{ textAlign: "center" }}>
                <>
                     <div style={{display:"flex", marginTop:"50px" , justifyContent:"space-between"}}>
                      <Skeleton height="330px" width="32%"  marginBottom="10" borderRadius="10px" />
                      <Skeleton height="330px" width="32%"  marginBottom="10" borderRadius="10px" />
                      <Skeleton height="330px" width="32%"  marginBottom="10" borderRadius="10px" />
                      </div>
                    </>

                </div>
              
            ) : companies.length > 0 ? (
              <Row className="user-cards-items user-card-wrapper">
                {companies.map((item: any, index: any) => (
                  <Col
                    xl={3}
                    sm={6}
                    xxl={3}
                    className="col-ed-4 box-col-4"
                    key={item.id}
                  >
                    <Card
                      className="social-profile"
                      style={{
                        // backgroundColor: `${
                        //   userPersonalizationData &&
                        //   userPersonalizationData.primaryColor
                        //     ? `rgba(${parseInt(
                        //         userPersonalizationData.primaryColor.slice(
                        //           1,
                        //           3
                        //         ),
                        //         16
                        //       )}, ${parseInt(
                        //         userPersonalizationData.primaryColor.slice(
                        //           3,
                        //           5
                        //         ),
                        //         16
                        //       )}, ${parseInt(
                        //         userPersonalizationData.primaryColor.slice(5),
                        //         16
                        //       )}, 0.2)`
                        //     : "rgba(53, 191, 191, 0.2)"


                        // }`,
                        backgroundColor: "rgba(53, 191, 191,0.2)"
                      }}
                    >
                      <CardBody>
                        <div className="social-img-wrap">
                          <div className="social-img">
                            <img src="" alt="" />
                            <Image
                              width={68}
                              height={68}
                              src={CompanyProfile}
                              className="img-fluid"
                              alt="user"
                            />
                          </div>
                          {/* <div className="edit-icon">
                    <SVG iconId="profile-check" />
                  </div> */}
                        </div>
                        <div className="social-details">
                          <H5 className="mb-1">
                            <Link to="#">{item.fullName}</Link>
                          </H5>
                          <span className="f-light">{item.emailAddress}</span>
                          <SocialMediaIcons item={item} />
                          <CompaniesCardsFooter item={item} />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row>
                <Card style={{ textAlign: "center" }}>
                  <CardBody>
                    <H1>No Companies Found</H1>
                  </CardBody>
                </Card>
              </Row>
            )}
          </Container>
        </div>
      )}
    </>
  );
};

export default Companies;
