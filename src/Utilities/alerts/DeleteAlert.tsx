import { Button, Card, CardBody, Col } from "reactstrap";
import Swal from "sweetalert2";
import alertTypes from "./AlertType";
import { deleteSingle, getAll } from "../api";
import {
  setCities,
  setFilterCities,
} from "../../ReaduxToolkit/Reducer/CitiesSlice";
import {
  setProvinces,
  setFilterProvinces,
} from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import {
  setFilterPackages,
  setPackages,
  setPackagesEnd,
} from "../../ReaduxToolkit/Reducer/PackageSlice";
import {
  setCountries,
  setFilterCountries,
} from "../../ReaduxToolkit/Reducer/CountrySlice";
import {
  setCRMModules,
  setCRMModulesEnd,
  setFilterCRMModules,
} from "../../ReaduxToolkit/Reducer/CRMModuleSlice";

import {
  setFilterServers,
  setNoDataFound,
  setServers,
} from "../../ReaduxToolkit/Reducer/ServerDetailsSlice";
import {
  setCompanies,
  setFilterCompanies,
  setNoCompanyFound,
} from "../../ReaduxToolkit/Reducer/CompanySlice";
import {
  setFilterOperators,
  setOperators,
} from "../../ReaduxToolkit/Reducer/OperatorSlice";
import {
  setComplainsTypes,
  setFilterComplainsTypes,
} from "../../ReaduxToolkit/Reducer/ComplainsTypeSlice";
import { DELETE_CITY, DELETE_COMPANY, DELETE_COUNTRY, DELETE_CRM_MODULE, DELETE_OPERATOR, DELETE_PACKAGE, DELETE_PROVINCE, DELETE_SERVER, DELETE_TYPE, GET_ALL_CITIES, GET_ALL_COMPANIES, GET_ALL_COUNTRIES, GET_ALL_CRM_MODULES, GET_ALL_OPERATORS, GET_ALL_PACKAGES, GET_ALL_PROVINCES, GET_ALL_SERVERS, GET_ALL_TYPES } from "../api/apiEndpoints";

const deleteAlert = (
  alertData: alertTypes,
  id: any,
  type: any,
  dispatch: any
) => {
  return Swal.fire({
    title: alertData.title,
    text: alertData.text,
    icon: "warning",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      // loading true
      var uri;
      if (type === "provinceType") {
        uri = `${DELETE_PROVINCE}`;
      } else if (type === "cityType") {
        uri = `${DELETE_CITY}`;
      } else if (type === "packageType") {
        uri = `${DELETE_PACKAGE}`;
      } else if (type === "countryType") {
        uri = `${DELETE_COUNTRY}`;
      } else if (type === "crmModuleType") {
        uri = `${DELETE_CRM_MODULE}`;
      } else if (type === "serverType") {
        uri = `${DELETE_SERVER}`;
      } else if (type === "companyType") {
        uri = `${DELETE_COMPANY}`;
      } else if (type === "usersType") {
        uri = `${DELETE_OPERATOR}`;
      } else if (type === "complainType") {
        uri = `${DELETE_TYPE}`;
      }

      try {
        Swal.fire({
          text: "Loading...",
          icon: "info",
          // timer: 2000,
          showCancelButton: false,
          showConfirmButton: false,
        });

        await deleteSingle({ url: `${uri}/${id}` }).then((data: any) => {
          if (data.success) {
            // console.log(data);

            setTimeout(() => {
              Swal.fire({
                text: `${data.message}`,
                icon: "success",
                timer: 2000,
              });
            }, 2000);
            // Swal.fire({
            //   text: "Poof! Your city has been deleted!",
            //   icon: "success",
            // });
            if (type === "complainType") {
              getAll({
                url: GET_ALL_TYPES,
              }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setComplainsTypes([]));
                  dispatch(setFilterComplainsTypes([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setComplainsTypes(data.data));
                    dispatch(setFilterComplainsTypes(data.data));
                  }
                  if (!data.success) {
                    dispatch(setComplainsTypes([]));
                    dispatch(setFilterComplainsTypes([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }
            if (type === "usersType") {
              getAll({ url: GET_ALL_OPERATORS }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  if (data == undefined) {
                    dispatch(setOperators([]));
                    dispatch(setFilterOperators([]));
                  }

                  if (data !== undefined) {
                    dispatch(setNoDataFound(data.message));
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setOperators(data.data));
                      dispatch(setFilterOperators(data.data));
                    }
                    if (!data.success) {
                      dispatch(setOperators([]));
                      dispatch(setFilterOperators([]));
                    }
                  } else {
                    // console.log("ier67i");
                  }
                }
              );
            }
            if (type === "serverType") {
              getAll({ url: GET_ALL_SERVERS }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  if (data == undefined) {
                    dispatch(setServers([]));
                    dispatch(setFilterServers([]));
                  }
                  if (data !== undefined) {
                    dispatch(setNoDataFound(data.message));
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setServers(data.data.allServers));
                      dispatch(setFilterServers(data.data.allServers));
                    }
                    if (!data.success) {
                      dispatch(setServers([]));
                      dispatch(setFilterServers([]));
                    }
                  } else {
                    // console.log("ier67i");
                  }
                }
              );
            }
            if (type === "companyType") {
              getAll({ url: GET_ALL_COMPANIES }).then(
                (data: any) => {
                  // console.log("api call for companies --- >", data);
                  if (data == undefined) {
                    dispatch(setCompanies([]));
                    dispatch(setFilterCompanies([]));
                  }

                  if (data !== undefined) {
                    dispatch(setNoCompanyFound(data.message));
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setCompanies(data.data));
                      dispatch(setFilterCompanies(data.data));
                    }
                    if (!data.success) {
                      dispatch(setCompanies([]));
                      dispatch(setFilterCompanies([]));
                    }
                  }
                }
              );
            }
            if (type === "cityType") {
              getAll({ url: GET_ALL_CITIES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setCities([]));
                  dispatch(setFilterCities([]));
                }
                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setCities(data.data));
                    dispatch(setFilterCities(data.data));
                  }
                  if (!data.success) {
                    dispatch(setCities([]));
                    dispatch(setFilterCities([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            } else if (type === "provinceType") {
              getAll({ url: GET_ALL_PROVINCES }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  if (data == undefined) {
                    dispatch(setProvinces([]));
                    dispatch(setFilterProvinces([]));
                  }
                  if (data !== undefined) {
                    dispatch(setNoDataFound(data.message));
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setProvinces(data.data));
                      dispatch(setFilterProvinces(data.data));

                      getAll({ url: GET_ALL_CITIES }).then(
                        (data: any) => {
                          // console.log("api call --- >", data);
                          if (data !== undefined) {
                            if (data.success) {
                              dispatch(setNoDataFound(data.message));
                              // console.log("hhg");
                              dispatch(setCities(data.data));
                              dispatch(setFilterCities(data.data));
                            } else {
                              dispatch(setCities([]));
                            }
                          } else {
                            // console.log("ier67i");
                          }
                        }
                      );
                    }
                    if (!data.success) {
                      dispatch(setProvinces([]));
                      dispatch(setFilterProvinces([]));
                      getAll({ url: GET_ALL_CITIES }).then(
                        (data: any) => {
                          // console.log("api call --- >", data);
                          if (data !== undefined) {
                            dispatch(setNoDataFound(data.message));
                            if (data.success) {
                              // console.log("hhg");
                              dispatch(setCities(data.data));
                              dispatch(setFilterCities(data.data));
                            }
                            if (!data.success) {
                              dispatch(setCities([]));
                              dispatch(setFilterCities([]));
                            }
                          }
                        }
                      );
                    }
                  }
                }
              );
            } else if (type === "packageType") {
              getAll({ url: GET_ALL_PACKAGES }).then((data: any) => {
                // console.log("api call --- >", data);
                dispatch(setPackagesEnd());
                if (data == undefined) {
                  dispatch(setPackages([]));
                  dispatch(setFilterPackages([]));
                }
                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setPackages(data.data));
                    dispatch(setFilterPackages(data.data));
                  }
                  if (!data.success) {
                    dispatch(setPackages([]));
                    dispatch(setFilterPackages([]));
                  }
                }
              });
            } else if (type === "crmModuleType") {
              getAll({ url: GET_ALL_CRM_MODULES }).then(
                (data: any) => {
                  // console.log("api call --- >", data);
                  dispatch(setCRMModulesEnd());
                  if (data == undefined) {
                    dispatch(setCRMModules([]));
                    dispatch(setFilterCRMModules([]));
                  }
                  if (data !== undefined) {
                    dispatch(setNoDataFound(data.message));
                    if (data.success) {
                      // console.log("hhg");
                      dispatch(setCRMModules(data.data));
                      dispatch(setFilterCRMModules(data.data));
                    }
                    if (!data.success) {
                      dispatch(setCRMModules([]));
                      dispatch(setFilterCRMModules([]));
                    }
                  }
                }
              );
            } else if (type === "countryType") {
              getAll({ url: GET_ALL_COUNTRIES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setCountries([]));
                  dispatch(setFilterCountries([]));
                }
                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));

                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setCountries(data.data));
                    dispatch(setFilterCountries(data.data));
                    getAll({ url: GET_ALL_PROVINCES }).then(
                      (data: any) => {
                        // console.log("api call --- >", data);
                        if (data !== undefined) {
                          if (data.success) {
                            // console.log("hhg");
                            dispatch(setProvinces(data.data));
                            dispatch(setFilterProvinces(data.data));
                          }
                          if (!data.success) {
                            dispatch(setProvinces([]));
                            dispatch(setFilterProvinces([]));
                          }
                        }
                      }
                    );
                    getAll({ url: GET_ALL_CITIES }).then((data: any) => {
                      // console.log("api call --- >", data);
                      if (data !== undefined) {
                        dispatch(setNoDataFound(data.message));
                        if (data.success) {
                          // console.log("hhg");
                          dispatch(setCities(data.data));
                          dispatch(setFilterCities(data.data));
                        }
                        if (!data.success) {
                          dispatch(setCities([]));
                          dispatch(setFilterCities([]));
                        }
                      } else {
                        // console.log("ier67i");
                      }
                    });
                  } else {
                    dispatch(setCountries([]));
                    getAll({ url: GET_ALL_PROVINCES }).then(
                      (data: any) => {
                        // console.log("api call --- >", data);
                        if (data !== undefined) {
                          dispatch(setNoDataFound(data.message));
                          if (data.success) {
                            // console.log("hhg");
                            dispatch(setProvinces(data.data));
                            dispatch(setFilterProvinces(data.data));
                          }
                          if (!data.success) {
                            dispatch(setProvinces([]));
                            dispatch(setFilterProvinces([]));
                          }
                        }
                      }
                    );
                    getAll({ url: GET_ALL_CITIES }).then((data: any) => {
                      // console.log("api call --- >", data);
                      if (data !== undefined) {
                        dispatch(setNoDataFound(data.message));
                        if (data.success) {
                          // console.log("hhg");
                          dispatch(setCities(data.data));
                          dispatch(setFilterCities(data.data));
                        }
                        if (!data.success) {
                          dispatch(setCities([]));
                          dispatch(setFilterCities([]));
                        }
                      } else {
                        // console.log("ier67i");
                      }
                    });
                  }
                }
              });
            }

            // loading false
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        // loading false
      }
    }
  });
};

export default deleteAlert;
