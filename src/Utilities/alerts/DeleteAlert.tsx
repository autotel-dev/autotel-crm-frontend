import { Button, Card, CardBody, Col } from "reactstrap";
import Swal from "sweetalert2";
import alertTypes from "./AlertType";
import { deleteMultiple, deleteSingle, getAll } from "../api";
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
import {
  DELETE_BANK,
  DELETE_BANK_ACCOUNT,
  DELETE_BRANCH,
  DELETE_CITY,
  DELETE_COMPANY,
  DELETE_COUNTRY,
  DELETE_CRM_MODULE,
  DELETE_CURRENCY,
  DELETE_EXPENSE_ACCOUNT,
  DELETE_GROUP,
  DELETE_INSURANCE,
  DELETE_LANGUAGE,
  DELETE_NETWORK_PROVIDER,
  DELETE_OPERATOR,
  DELETE_PACKAGE,
  DELETE_PRODUCT,
  DELETE_PROVINCE,
  DELETE_SALE_GROUP,
  DELETE_SERVER,
  DELETE_SUBGROUP,
  DELETE_TYPE,
  DELETE_VEHICLE_MAKE,
  DELETE_VEHICLE_MODEL,
  DELETE_VENDOR,
  DELETE_WAREHOUSE,
  GET_ALL_BANK_ACCOUNTS,
  GET_ALL_BANKS,
  GET_ALL_BRANCHES,
  GET_ALL_CITIES,
  GET_ALL_COMPANIES,
  GET_ALL_COUNTRIES,
  GET_ALL_CRM_MODULES,
  GET_ALL_CURRENCIES,
  GET_ALL_EXPENSE_ACCOUNTS,
  GET_ALL_GEOFENCES,
  GET_ALL_GROUPS,
  GET_ALL_INSURANCES,
  GET_ALL_LANGUAGES,
  GET_ALL_NETWORK_PROVIDERS,
  GET_ALL_OPERATORS,
  GET_ALL_PACKAGES,
  GET_ALL_PRODUCTS,
  GET_ALL_PROVINCES,
  GET_ALL_SALE_GROUPS,
  GET_ALL_SERVERS,
  GET_ALL_TYPES,
  GET_ALL_VEHICLES_MAKE,
  GET_ALL_VEHICLES_MODEL,
  GET_ALL_VENDORS,
  GET_ALL_WAREHOUSES,
} from "../api/apiEndpoints";
import {
  setGeofences,
  setGeofencesGroup,
} from "../../ReaduxToolkit/Reducer/GeofenceSlice";
import {
  setBanks,
  setFilterBanks,
} from "../../ReaduxToolkit/Reducer/BankSlice";
import {
  setFilterInsurances,
  setInsurance,
} from "../../ReaduxToolkit/Reducer/InsuranceSlice";
import {
  setFilterNetworkProvider,
  setNetworkProvider,
} from "../../ReaduxToolkit/Reducer/NetworkProviderSlice";
import {
  setFilterWarehouses,
  setWarehouse,
} from "../../ReaduxToolkit/Reducer/WarehouseSlice";
import {
  setFilterGroups,
  setGroup,
} from "../../ReaduxToolkit/Reducer/GroupSlice";
import {
  setBranch,
  setFilterBranches,
} from "../../ReaduxToolkit/Reducer/BranchSlice";
import {
  setFilterVehiclesMake,
  setVehicleMake,
} from "../../ReaduxToolkit/Reducer/VehicleMakeSlice";
import {
  setFilterVehiclesModel,
  setVehicleModel,
} from "../../ReaduxToolkit/Reducer/VehicleModelSlice";
import {
  setCurrencies,
  setFilterCurrencies,
} from "../../ReaduxToolkit/Reducer/CurrencySlice";
import {
  setFilterLanguages,
  setLanguages,
} from "../../ReaduxToolkit/Reducer/LanguageSlice";
import {
  setFilterVendor,
  setVendor,
} from "../../ReaduxToolkit/Reducer/VendorSlice";
import {
  setFilterProduct,
  setProduct,
} from "../../ReaduxToolkit/Reducer/InventoryProductSlice";
import { setBankAccounts } from "../../ReaduxToolkit/Reducer/BankAccountSlice";
import { setExpenseAccounts } from "../../ReaduxToolkit/Reducer/ExpenseAccountsSlice";

const deleteAlert = (
  alertData: alertTypes,
  id: any,
  type: any,
  dispatch: any
) => {
  var check = false;
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
      } else if (type === "subGroupType") {
        uri = `${DELETE_SUBGROUP}`;
      } else if (type === "groupType") {
        uri = `${DELETE_GROUP}`;
      } else if (type === "bankType") {
        uri = `${DELETE_BANK}`;
      } else if (type === "insuranceType") {
        uri = `${DELETE_INSURANCE}`;
      } else if (type === "networkProviderType") {
        uri = `${DELETE_NETWORK_PROVIDER}`;
      } else if (type === "warehouseType") {
        uri = `${DELETE_WAREHOUSE}`;
      } else if (type === "saleGroupType") {
        uri = `${DELETE_SALE_GROUP}`;
      } else if (type === "branchType") {
        uri = `${DELETE_BRANCH}`;
      } else if (type === "vehicleMakeType") {
        uri = `${DELETE_VEHICLE_MAKE}`;
      } else if (type === "vehicleModelType") {
        uri = `${DELETE_VEHICLE_MODEL}`;
      } else if (type === "currencyType") {
        uri = `${DELETE_CURRENCY}`;
      } else if (type === "languageType") {
        uri = `${DELETE_LANGUAGE}`;
      } else if (type === "expenseAccountsType") {
        uri = `${DELETE_EXPENSE_ACCOUNT}`;
      } else if (type === "bankAccountsType") {
        uri = `${DELETE_BANK_ACCOUNT}`;
      } else if (type === "vendorType") {
        uri = `${DELETE_VENDOR}`;
      } else if (type === "productType") {
        uri = `${DELETE_PRODUCT}`;
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
            }, 1000);

            // ------------

            if (type === "bankType") {
              getAll({ url: GET_ALL_BANKS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setBanks([]));
                  dispatch(setFilterBanks([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setBanks(data.data));
                    dispatch(setFilterBanks(data.data));
                  }
                  if (!data.success) {
                    dispatch(setBanks([]));
                    dispatch(setFilterBanks([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            if (type === "bankAccountsType") {
              getAll({ url: GET_ALL_BANK_ACCOUNTS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setBankAccounts([]));
                }
                if (data !== undefined) {
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setBankAccounts(data.data.bankAccounts));

                  }
                  if (!data.success) {
                    dispatch(setBankAccounts([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }


            // -----------
            // -----------


            if (type === "expenseAccountsType") {
              getAll({ url: GET_ALL_EXPENSE_ACCOUNTS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setExpenseAccounts([]));
                }
                if (data !== undefined) {
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setExpenseAccounts(data.data));
                  }
                  if (!data.success) {
                    dispatch(setExpenseAccounts([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }


            // ------------
            // ------------

            if (type === "currencyType") {
              getAll({ url: GET_ALL_CURRENCIES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setCurrencies([]));
                  dispatch(setFilterCurrencies([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setCurrencies(data.data));
                    dispatch(setFilterCurrencies(data.data));
                  }
                  if (!data.success) {
                    dispatch(setCurrencies([]));
                    dispatch(setFilterCurrencies([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------
            // ------------

            if (type === "languageType") {
              getAll({ url: GET_ALL_LANGUAGES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setLanguages([]));
                  dispatch(setFilterLanguages([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setLanguages(data.data));
                    dispatch(setFilterLanguages(data.data));
                  }
                  if (!data.success) {
                    dispatch(setLanguages([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------
            // ------------

            if (type === "insuranceType") {
              getAll({ url: GET_ALL_INSURANCES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setInsurance([]));
                  dispatch(setFilterInsurances([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setInsurance(data.data));
                    dispatch(setFilterInsurances(data.data));
                  }
                  if (!data.success) {
                    dispatch(setInsurance([]));
                    dispatch(setFilterInsurances([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------
            // ------------

            if (type === "vehicleMakeType") {
              getAll({ url: GET_ALL_VEHICLES_MAKE }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setVehicleMake([]));
                  dispatch(setFilterVehiclesMake([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setVehicleMake(data.data));
                    dispatch(setFilterVehiclesMake(data.data));
                  }
                  if (!data.success) {
                    dispatch(setVehicleMake([]));
                    dispatch(setFilterVehiclesMake([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            if (type === "vehicleModelType") {
              getAll({ url: GET_ALL_VEHICLES_MODEL }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setVehicleModel([]));
                  dispatch(setFilterVehiclesModel([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setVehicleModel(data.data));
                    dispatch(setFilterVehiclesModel(data.data));
                  }
                  if (!data.success) {
                    dispatch(setVehicleModel([]));
                    dispatch(setFilterVehiclesModel([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------
            // ------------

            if (type === "networkProviderType") {
              getAll({ url: GET_ALL_NETWORK_PROVIDERS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setNetworkProvider([]));
                  dispatch(setFilterNetworkProvider([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setNetworkProvider(data.data));
                    dispatch(setFilterNetworkProvider(data.data));
                  }
                  if (!data.success) {
                    dispatch(setNetworkProvider([]));
                    dispatch(setFilterNetworkProvider([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------

            // ------------

            if (type === "warehouseType") {
              getAll({ url: GET_ALL_WAREHOUSES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setWarehouse([]));
                  dispatch(setFilterWarehouses([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setWarehouse(data.data));
                    dispatch(setFilterWarehouses(data.data));
                  }
                  if (!data.success) {
                    dispatch(setWarehouse([]));
                    dispatch(setFilterWarehouses([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------
            // ------------

            if (type === "branchType") {
              getAll({ url: GET_ALL_BRANCHES }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setBranch([]));
                  dispatch(setFilterBranches([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setBranch(data.data));
                    dispatch(setFilterBranches(data.data));
                  }
                  if (!data.success) {
                    dispatch(setBranch([]));
                    dispatch(setFilterBranches([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }
            // ------------
            // ------------

            if (type === "vendorType") {
              getAll({ url: GET_ALL_VENDORS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setVendor([]));
                  dispatch(setFilterVendor([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setVendor(data.data));
                    dispatch(setFilterVendor(data.data));
                  }
                  if (!data.success) {
                    dispatch(setVendor([]));
                    dispatch(setFilterVendor([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }
            // ------------
            // ------------

            if (type === "productType") {
              getAll({ url: GET_ALL_PRODUCTS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setProduct([]));
                  dispatch(setFilterProduct([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setProduct(data.data.products));
                  }
                  if (!data.success) {
                    dispatch(setProduct([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }
            // ------------

            if (type === "saleGroupType") {
              getAll({ url: GET_ALL_SALE_GROUPS }).then((data: any) => {
                // console.log("api call --- >", data);
                if (data == undefined) {
                  dispatch(setGroup([]));
                  dispatch(setFilterGroups([]));
                }

                if (data !== undefined) {
                  dispatch(setNoDataFound(data.message));
                  if (data.success) {
                    // console.log("hhg");
                    dispatch(setGroup(data.data));
                    dispatch(setFilterGroups(data.data));
                  }
                  if (!data.success) {
                    dispatch(setGroup([]));
                    dispatch(setFilterGroups([]));
                  }
                } else {
                  // console.log("ier67i");
                }
              });
            }

            // ------------

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
              getAll({ url: GET_ALL_OPERATORS }).then((data: any) => {
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
              });
            }
            if (type === "serverType") {
              getAll({ url: GET_ALL_SERVERS }).then((data: any) => {
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
              });
            }
            if (type === "companyType") {
              getAll({ url: GET_ALL_COMPANIES }).then((data: any) => {
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
              });
            }

            if (type === "groupType") {
              getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
                if (data !== undefined) {
                  if (data.success) {
                    getAll({ url: GET_ALL_GROUPS }).then((data: any) => {
                      if (data.success) {
                        dispatch(setGeofencesGroup(data.data));
                      }
                    });

                    const groups: any[] = [];
                    const groupGeofencesObj: any = {};

                    let subGroups: any = [];
                    let subGroupsGeofencesObj: any = {};
                    let initialSubGroupsGeofences: any = [];

                    data.data.forEach((item: any) => {
                      const group = item.geofenceGroup
                        ? item.geofenceGroup.title
                        : "Ungrouped";
                      if (!groups.includes(group)) {
                        groups.push(group);
                      }
                      if (!groupGeofencesObj[group]) {
                        groupGeofencesObj[group] = [];
                      }
                      groupGeofencesObj[group].push({
                        ...item,
                        checked: false,
                      });
                    });

                    const initialGroupGeofences = Object.keys(
                      groupGeofencesObj
                    ).map((group) => ({
                      group,
                      checked: false,
                      items: groupGeofencesObj[group],
                      subgroups: [],
                    }));

                    for (let i = 0; i < initialGroupGeofences.length; i++) {
                      // console.log("item.group -- >", initialGroupGeofences[i].group);
                      for (
                        let j = 0;
                        j < initialGroupGeofences[i].items.length;
                        j++
                      ) {
                        var element = "";
                        if (
                          initialGroupGeofences[i].items[j].geofenceSubGroup !==
                          null
                        ) {
                          element =
                            initialGroupGeofences[i].items[j].geofenceSubGroup
                              .title;
                        }
                        // const element = data.data[i].geofenceGroup.title;
                        if (!subGroups.includes(element)) {
                          if (element !== "") {
                            subGroups.push(element);
                          }
                        }
                      }
                      console.log("subGroups", subGroups);

                      subGroups.forEach((geofenceSubGroup: any) => {
                        subGroupsGeofencesObj[geofenceSubGroup] =
                          initialGroupGeofences[i].items
                            .filter((obj: any) => {
                              if (
                                !obj.geofenceSubGroup ||
                                !obj.geofenceSubGroup.title
                              ) {
                                return;
                              } else {
                                return (
                                  obj.geofenceSubGroup.title ===
                                  geofenceSubGroup
                                );
                              }
                            })
                            .map((item: any) => ({
                              ...item,
                              checked: false,
                              edited: false,
                            }));
                      });

                      // console.log(groups);
                      console.log(
                        "subGroupsGeofencesObj",
                        subGroupsGeofencesObj
                      );

                      // Convert groupDevicesObj to initialGroupDevices array format
                      Object.keys(subGroupsGeofencesObj).forEach(
                        (group: any) => {
                          initialSubGroupsGeofences.push({
                            subgroup: group,
                            checked: false,
                            items: subGroupsGeofencesObj[group],
                          });
                        }
                      );

                      initialGroupGeofences[i] = {
                        ...initialGroupGeofences[i],
                        subgroups: initialSubGroupsGeofences,
                      };

                      subGroups = [];
                      subGroupsGeofencesObj = {};
                      initialSubGroupsGeofences = [];
                    }
                    dispatch(setGeofences(initialGroupGeofences));
                  }
                }
              });
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
              getAll({ url: GET_ALL_PROVINCES }).then((data: any) => {
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

                    getAll({ url: GET_ALL_CITIES }).then((data: any) => {
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
                    });
                  }
                  if (!data.success) {
                    dispatch(setProvinces([]));
                    dispatch(setFilterProvinces([]));
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
                      }
                    });
                  }
                }
              });
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
              getAll({ url: GET_ALL_CRM_MODULES }).then((data: any) => {
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
              });
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
                    getAll({ url: GET_ALL_PROVINCES }).then((data: any) => {
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
                    });
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
                    getAll({ url: GET_ALL_PROVINCES }).then((data: any) => {
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
                    });
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
          } else {
            Swal.fire({
              text: `${data.message}`,
              icon: "error",
              timer: 2000,
            });
          }
        });
        // Handle successful post creation (e.g., show a success message, redirect, etc.)
      } catch (error) {
        // Handle error (e.g., show an error message)
        // console.error("Error creating post:", error);
        // loading false

      }
    }
    if (result.isDismissed && (type == "expenseAccountsType" || type == "bankAccountsType"))
      return !check;
  });
};

export const deleteAlertForManyData = (
  alertData: alertTypes,
  url: any,
  dispatch: any,
  body?: any
) => {
  return Swal.fire({
    title: alertData.title,
    text: alertData.text,
    icon: "warning",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        Swal.fire({
          text: "Loading...",
          icon: "info",
          // timer: 2000,
          showCancelButton: false,
          showConfirmButton: false,
        });
        console.log("caled");

        await deleteMultiple({ url: url }, body).then((data: any) => {
          console.log("called");
          if (data.success) {
            // console.log(data);

            Swal.fire({
              text: `${data.message}`,
              icon: "success",
              timer: 2500,
            });

            getAll({ url: GET_ALL_GEOFENCES }).then((data: any) => {
              if (data !== undefined) {
                if (data.success) {
                  getAll({ url: GET_ALL_GROUPS }).then((data: any) => {
                    if (data.success) {
                      dispatch(setGeofencesGroup(data.data));
                    }
                  });

                  const groups: any[] = [];
                  const groupGeofencesObj: any = {};

                  let subGroups: any = [];
                  let subGroupsGeofencesObj: any = {};
                  let initialSubGroupsGeofences: any = [];

                  data.data.forEach((item: any) => {
                    const group = item.geofenceGroup
                      ? item.geofenceGroup.title
                      : "Ungrouped";
                    if (!groups.includes(group)) {
                      groups.push(group);
                    }
                    if (!groupGeofencesObj[group]) {
                      groupGeofencesObj[group] = [];
                    }
                    groupGeofencesObj[group].push({
                      ...item,
                      checked: false,
                    });
                  });

                  const initialGroupGeofences = Object.keys(
                    groupGeofencesObj
                  ).map((group) => ({
                    group,
                    checked: false,
                    items: groupGeofencesObj[group],
                    subgroups: [],
                  }));

                  for (let i = 0; i < initialGroupGeofences.length; i++) {
                    // console.log("item.group -- >", initialGroupGeofences[i].group);
                    for (
                      let j = 0;
                      j < initialGroupGeofences[i].items.length;
                      j++
                    ) {
                      var element = "";
                      if (
                        initialGroupGeofences[i].items[j].geofenceSubGroup !==
                        null
                      ) {
                        element =
                          initialGroupGeofences[i].items[j].geofenceSubGroup
                            .title;
                      }
                      // const element = data.data[i].geofenceGroup.title;
                      if (!subGroups.includes(element)) {
                        if (element !== "") {
                          subGroups.push(element);
                        }
                      }
                    }
                    console.log("subGroups", subGroups);

                    subGroups.forEach((geofenceSubGroup: any) => {
                      subGroupsGeofencesObj[geofenceSubGroup] =
                        initialGroupGeofences[i].items
                          .filter((obj: any) => {
                            if (
                              !obj.geofenceSubGroup ||
                              !obj.geofenceSubGroup.title
                            ) {
                              return;
                            } else {
                              return (
                                obj.geofenceSubGroup.title === geofenceSubGroup
                              );
                            }
                          })
                          .map((item: any) => ({
                            ...item,
                            checked: false,
                            edited: false,
                          }));
                    });

                    // console.log(groups);
                    console.log("subGroupsGeofencesObj", subGroupsGeofencesObj);

                    // Convert groupDevicesObj to initialGroupDevices array format
                    Object.keys(subGroupsGeofencesObj).forEach((group: any) => {
                      initialSubGroupsGeofences.push({
                        subgroup: group,
                        checked: false,
                        items: subGroupsGeofencesObj[group],
                      });
                    });

                    initialGroupGeofences[i] = {
                      ...initialGroupGeofences[i],
                      subgroups: initialSubGroupsGeofences,
                    };

                    subGroups = [];
                    subGroupsGeofencesObj = {};
                    initialSubGroupsGeofences = [];
                  }
                  dispatch(setGeofences(initialGroupGeofences));
                }
              }
            });

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
