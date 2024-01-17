import { Button, Card, CardBody, Col } from "reactstrap";
import Swal from "sweetalert2";
import alertTypes from "./AlertType";
import { deleteSingle, getAll } from "../../Api";
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
        uri = `province/delete-province`;
      } else if (type === "cityType") {
        uri = `city/delete-city`;
      } else if (type === "packageType") {
        uri = `package/delete-package`;
      } else if (type === "countryType") {
        uri = `country/delete-country`;
      } else if (type === "crmModuleType") {
        uri = `crm-module/delete-module`;
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
            console.log(data);

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
            if (type == "cityType") {
              getAll({ url: "city/get-all-cities" }).then((data: any) => {
                console.log("api call --- >", data);
                if (data !== undefined) {
                  if (data.success) {
                    console.log("hhg");
                    dispatch(setCities(data.data));
                    dispatch(setFilterCities(data.data));
                  } else {
                    dispatch(setCities([]));
                  }
                } else {
                  console.log("ier67i");
                }
              });
            } else if (type == "provinceType") {
              getAll({ url: "province/get-all-provinces" }).then(
                (data: any) => {
                  console.log("api call --- >", data);
                  if (data !== undefined) {
                    if (data.success) {
                      console.log("hhg");
                      dispatch(setProvinces(data.data));
                      dispatch(setFilterProvinces(data.data));

                      getAll({ url: "city/get-all-cities" }).then(
                        (data: any) => {
                          console.log("api call --- >", data);
                          if (data !== undefined) {
                            if (data.success) {
                              console.log("hhg");
                              dispatch(setCities(data.data));
                              dispatch(setFilterCities(data.data));
                            } else {
                              dispatch(setCities([]));
                            }
                          } else {
                            console.log("ier67i");
                          }
                        }
                      );
                    } else {
                      dispatch(setProvinces([]));
                      getAll({ url: "city/get-all-cities" }).then(
                        (data: any) => {
                          console.log("api call --- >", data);
                          if (data !== undefined) {
                            if (data.success) {
                              console.log("hhg");
                              dispatch(setCities(data.data));
                              dispatch(setFilterCities(data.data));
                            } else {
                              dispatch(setCities([]));
                            }
                          } else {
                            console.log("ier67i");
                          }
                        }
                      );
                    }
                  }
                }
              );
            } else if (type == "packageType") {
              getAll({ url: "package/get-all-packages" }).then((data: any) => {
                console.log("api call --- >", data);
                dispatch(setPackagesEnd());
                if (data !== undefined) {
                  if (data.success) {
                    console.log("hhg");
                    dispatch(setPackages(data.data));
                    dispatch(setFilterPackages(data.data));
                  } else {
                    dispatch(setPackages([]));
                  }
                }
              });
            } else if (type == "crmModuleType") {
              getAll({ url: "crm-module/get-all-modules" }).then(
                (data: any) => {
                  console.log("api call --- >", data);
                  dispatch(setCRMModulesEnd());
                  if (data !== undefined) {
                    if (data.success) {
                      console.log("hhg");
                      dispatch(setCRMModules(data.data));
                      dispatch(setFilterCRMModules(data.data));
                    } else {
                      dispatch(setCRMModules([]));
                    }
                  }
                }
              );
            } else if (type == "countryType") {
              getAll({ url: "country/get-all-countries" }).then((data: any) => {
                console.log("api call --- >", data);
                if (data !== undefined) {
                  if (data.success) {
                    console.log("hhg");
                    dispatch(setCountries(data.data));
                    dispatch(setFilterCountries(data.data));
                    getAll({ url: "province/get-all-provinces" }).then(
                      (data: any) => {
                        console.log("api call --- >", data);
                        if (data !== undefined) {
                          if (data.success) {
                            console.log("hhg");
                            dispatch(setProvinces(data.data));
                            dispatch(setFilterProvinces(data.data));
                          } else {
                            dispatch(setProvinces([]));
                          }
                        }
                      }
                    );
                    getAll({ url: "city/get-all-cities" }).then((data: any) => {
                      console.log("api call --- >", data);
                      if (data !== undefined) {
                        if (data.success) {
                          console.log("hhg");
                          dispatch(setCities(data.data));
                          dispatch(setFilterCities(data.data));
                        } else {
                          dispatch(setCities([]));
                        }
                      } else {
                        console.log("ier67i");
                      }
                    });
                  } else {
                    dispatch(setCountries([]));
                    getAll({ url: "province/get-all-provinces" }).then(
                      (data: any) => {
                        console.log("api call --- >", data);
                        if (data !== undefined) {
                          if (data.success) {
                            console.log("hhg");
                            dispatch(setProvinces(data.data));
                            dispatch(setFilterProvinces(data.data));
                          } else {
                            dispatch(setProvinces([]));
                          }
                        }
                      }
                    );
                    getAll({ url: "city/get-all-cities" }).then((data: any) => {
                      console.log("api call --- >", data);
                      if (data !== undefined) {
                        if (data.success) {
                          console.log("hhg");
                          dispatch(setCities(data.data));
                          dispatch(setFilterCities(data.data));
                        } else {
                          dispatch(setCities([]));
                        }
                      } else {
                        console.log("ier67i");
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
        console.error("Error creating post:", error);
        // loading false
      }
    }
  });
};

export default deleteAlert;
