import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "../../../Utilities/api";
import {
  GET_ALL_ACTIVE_CITIES,
  GET_ALL_ACTIVE_CRM_MODULES,
  GET_ALL_ACTIVE_PACKAGES,
  GET_ALL_ACTIVE_SERVERS,
  GET_ALL_PERMISSIONS,
  GET_ALL_TIMEZONES,
} from "../../../Utilities/api/apiEndpoints";
import {
  setCities,
  setCRMModules,
  setPackages,
  setPermissions,
  setServers,
  setTimeZones,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";

/**
 * The company forms need the lists of servers, time zones, modules,
 * permissions, cities and packages. The Companies page loads them, but a form
 * opened directly (bookmark or refresh) would otherwise start with empty
 * lists: empty dropdowns, and on the update form the company's permissions
 * would be matched against nothing. This loads whatever is missing and
 * returns true once every list is in the store.
 */
const LISTS = [
  { key: "servers", url: GET_ALL_ACTIVE_SERVERS, set: setServers, pick: (d: any) => d?.activeServers },
  { key: "timezones", url: GET_ALL_TIMEZONES, set: setTimeZones },
  { key: "crmModules", url: GET_ALL_ACTIVE_CRM_MODULES, set: setCRMModules },
  { key: "permissions", url: GET_ALL_PERMISSIONS, set: setPermissions },
  { key: "cities", url: GET_ALL_ACTIVE_CITIES, set: setCities },
  { key: "packages", url: GET_ALL_ACTIVE_PACKAGES, set: setPackages },
];

export const useCompanyFormLists = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state: any) => state.companies);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const missing = LISTS.filter((list) => !companies[list.key]?.length);
    Promise.all(
      missing.map((list) =>
        getAll({ url: list.url })
          .then((data: any) => {
            if (data?.success) {
              dispatch(list.set(list.pick ? list.pick(data.data) || [] : data.data));
            }
          })
          .catch(() => {})
      )
    ).finally(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
};
