import { Button, Card, CardBody, Col } from "reactstrap";
import Swal from "sweetalert2";
import alertTypes from "./AlertType";
import { deleteSingle, getAll } from "../../Api";
import { setCities } from "../../ReaduxToolkit/Reducer/CitiesSlice";
import { setProvinces } from "../../ReaduxToolkit/Reducer/ProvinceSlice";
import { setPackages } from "../../ReaduxToolkit/Reducer/PackageSlice";
import { setCountries } from "../../ReaduxToolkit/Reducer/CountrySlice";

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
                console.log(data);
                dispatch(setCities(data.data));
              });
            } else if (type == "provinceType") {
              getAll({ url: "province/get-all-provinces" }).then(
                (data: any) => {
                  console.log(data);
                  dispatch(setProvinces(data.data));
                }
              );
            } else if (type == "packageType") {
              getAll({ url: "package/get-all-packages" }).then((data: any) => {
                console.log(data);
                dispatch(setPackages(data.data));
              });
            } else if (type == "countryType") {
              getAll({ url: "country/get-all-countries" }).then((data: any) => {
                console.log(data);
                dispatch(setCountries(data.data));
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
