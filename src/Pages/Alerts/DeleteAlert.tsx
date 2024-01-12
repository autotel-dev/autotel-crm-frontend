import { Button, Card, CardBody, Col } from "reactstrap";
import Swal from "sweetalert2";
import alertTypes from "./AlertType";
import { deleteSingle } from "../../Api";
import GetCitiesData from "../Cities/GetList";
import GetProvineData from "../Province/GetList";

const deleteAlert = (
  alertData: alertTypes,
  array: any,
  dispatch: any,
  list: any,
  setList: any,
  setIsUpdateModalOpen: any,
  id: any,
  isUpdateModalOpen: any,
  type: any
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
      }
      try {
        await deleteSingle({ url: `${uri}/${id}` }).then((data: any) => {
          if (data.success) {
            console.log(data);
            Swal.fire({
              text: "Poof! Your city has been deleted!",
              icon: "success",
            });
            if (type == "cityType") {
              GetCitiesData(
                array,
                dispatch,
                list,
                setList,
                setIsUpdateModalOpen,
                isUpdateModalOpen
              );
            } else if (type == "provinceType") {
              GetProvineData(
                array,
                dispatch,
                list,
                setList,
                setIsUpdateModalOpen,
                isUpdateModalOpen
              );
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
