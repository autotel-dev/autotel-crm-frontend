// import { Button } from "reactstrap";
// import { Delete, Edit } from "../../../utils/Constant";
import { CountriesDataTableType } from "../BankTypes/BankTypes";
const style2 = { width: 60, fontSize: 14, padding: 3 };

//

// export const citiesTableData = [
//   {
//     id: "1",
//     name: "Karachi",
//     isActive: "active",
//     action: (
//       <div>
//         <Button style={style2} color="danger me-2" size="xs">
//           {Delete}
//         </Button>
//         <Button style={style2} color="success" size="xs">
//           {Edit}
//         </Button>
//       </div>
//     ),
//   },
//   {
//     id: "2",
//     name: "Lahore",
//     isActive: "active",
//     action: (
//       <div>
//         <Button style={style2} color="danger me-2" size="xs">
//           {Delete}
//         </Button>
//         <Button style={style2} color="success" size="xs">
//           {Edit}
//         </Button>
//       </div>
//     ),
//   },
//   {
//     id: "3",
//     name: "Peshawar",
//     isActive: "active",
//     action: (
//       <div>
//         <Button style={style2} color="danger me-2" size="xs">
//           {Delete}
//         </Button>
//         <Button style={style2} color="success" size="xs">
//           {Edit}
//         </Button>
//       </div>
//     ),
//   },
//   {
//     id: "4",
//     name: "Islamabad",
//     isActive: "active",
//     action: (
//       <div>
//         <Button style={style2} color="danger me-2" size="xs">
//           {Delete}
//         </Button>
//         <Button style={style2} color="success" size="xs">
//           {Edit}
//         </Button>
//       </div>
//     ),
//   },
// ];

export const citiesTableColumns = [
  {
    name: "Id",
    selector: (Row: CountriesDataTableType) => Row["id"],
    center: true,
    sortable: false,
  },
  {
    name: "Name",
    selector: (Row: CountriesDataTableType) => Row["name"],
    sortable: true,
    center: true,
  },
  {
    name: "Status",
    selector: (Row: CountriesDataTableType) => Row["isActive"],
    sortable: true,
    center: true,
  },
  {
    name: "Action",
    selector: (Row: CountriesDataTableType) => Row["action"],
    sortable: true,
    center: true,
  },
];

// const updateCities = ({ selectedCity }) => {
//   // const { allTasks } = useAppSelector((state) => state.tasks);
//   // const dispatch = useAppDispatch();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<CitiesType>();
//   const [addModal, setAddModal] = useState(false);
//   const addToggle = () => {
//     setAddModal(!addModal);
//     reset({
//       name: "",
//     });
//   };

//   const updatecity: SubmitHandler<CitiesType> = async (data) => {
//     if (data.name !== "") {
//       const updatedcity = {
//         name: data.name,
//       };
//       console.log(updatedcity);
//       try {
//         await updatecity(updatedcity);
//         // Handle successful post creation (e.g., show a success message, redirect, etc.)
//       } catch (error) {
//         // Handle error (e.g., show an error message)
//         console.error("Error creating post:", error);
//       }
//       // dispatch(setAllTasks([...allTasks, taskTemp]));
//       setAddModal(false);
//       reset({
//         name: "",
//       });
//     }
//   };
//   return (
//     <Modal isOpen={addModal} toggle={addToggle} size="lg">
//       <div className="modal-header">
//         <H3 className="modal-title">Update City</H3>
//         <Button
//           color="transprant"
//           className="btn-close"
//           onClick={addToggle}
//         ></Button>
//       </div>
//       <ModalBody>
//         <form
//           className="form-bookmark needs-validation"
//           onSubmit={handleSubmit(updatecity)}
//         >
//           <Row>
//             <FormGroup className="col-md-12 create-group">
//               <Label>City Name</Label>
//               <input
//                 className="form-control"
//                 type="text"
//                 {...register("name", { required: true })}
//               />
//               <span style={{ color: "red" }}>
//                 {errors.name && "City name is required"}
//               </span>
//             </FormGroup>
//           </Row>
//           <Button color="secondary" className="me-1">
//             Update
//           </Button>
//           &nbsp;&nbsp;
//           <Button color="primary" onClick={addToggle}>
//             {Cancel}
//           </Button>
//         </form>
//       </ModalBody>
//     </Modal>
//   );
// };
