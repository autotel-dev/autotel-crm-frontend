import deleteAlert from "../Alerts/DeleteAlert";
import { getAll } from "../../Api";
import { setCities } from "../../ReaduxToolkit/Reducer/CitiesSlice";
const GetCitiesData = (
  cities: any,
  dispatch: any,
  citiesList: any,
  setCitiesList: any,
  setIsUpdateModalOpen: any,
  isUpdateModalOpen: any
) => {
  {
    var updateModalOpen: any = false;
    console.log("isUpdateModalOpen: ", isUpdateModalOpen);
    citiesList = [];
    dispatch(setCities([]));

    getAll({ url: "city/get-all-cities" }).then((data: any) => {
      if (data.statusCode == 200) {
        console.log(data);
        data.data.map((item: any) => {
          const ele = {
            id: `${item._id}`,
            name: `${item.name}`,
            isActive: `${item.isActive ? "active" : "inActive"}`,
            action: (
              <div>
                <button
                  style={{
                    width: 60,
                    fontSize: 14,
                    padding: 3,
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: "5px",
                    marginRight: "5px",
                    border: "none",
                  }}
                  onClick={() => {
                    console.log("345678");
                    var alertData = {
                      title: "Are you sure?",
                      text: "Once deleted, you will not be able to recover this ",
                    };
                    // setIsDeleteModalOpen(true);
                    const type = "cityType";
                    deleteAlert(
                      alertData,
                      cities,
                      dispatch,
                      citiesList,
                      setCitiesList,
                      setIsUpdateModalOpen,
                      item._id,
                      isUpdateModalOpen,
                      type
                    );
                  }}
                >
                  Delete
                </button>
                <button
                  style={{
                    width: 60,
                    fontSize: 14,
                    padding: 3,
                    color: "white",
                    backgroundColor: "green",
                    borderRadius: "5px",
                    border: "none",
                  }}
                  onClick={() => {
                    console.log("345678");
                    setIsUpdateModalOpen(true);
                    console.log("1111");
                    console.log("isUpdateModalOpen: ", isUpdateModalOpen);
                  }}
                >
                  Edit
                </button>
              </div>
            ),
          };
          citiesList.push(ele);
          setCitiesList(citiesList);
        });
        dispatch(setCities(citiesList));
      }
    });
  }
};

export default GetCitiesData;
