
import Store from "../../../ReaduxToolkit/Store";
import { formatUnderscoredString } from "../../../Api/globals";

// const state = Store.getState();

export const ticketData = [
  {
    id: 1,
    title: "Order",
    num: 2563,
    class: "primary",
  },
  {
    id: 2,
    title: "Pending",
    num: 8943,
    class: "secondary",
  },
  {
    id: 3,
    title: "Running",
    num: 2500,
    class: "warning",
  },
  {
    id: 4,
    title: "Smooth",
    num: 2060,
    class: "info",
  },
];

// export const supportData = [
//   {
//     id: "123456",
//     username: "john_doe",
//     email: "john@example.com",
//     ticket_name: "Sample Ticket",
//     description: "This is a sample description.",
//     isActive: "true",
//     status: "Open",
//     priority: "High",
//     date: "2024-02-19",
//   },
// ];

export interface SupportDataType {
  id: string;
  username: string;
  email: string;
  ticket_name: string;
  description: string;
  isActive: string;
  status: string;
  priorty: string;
  date: string;
}

export const supportColumns = [
  {
    name: "id",
    selector: (row: SupportDataType) => row["id"],
    sortable: true,
    center: false,
    width: "120px", // Set the width for this column
  },
  {
    name: "Username",
    selector: (row: SupportDataType) => row["username"],
    sortable: true,
    center: false,
    width: "150px", // Set the width for this column
  },
  {
    name: "Email",
    selector: (row: SupportDataType) => row["email"],
    sortable: true,
    center: true,
    width: "200px",
  },
  {
    name: "Ticket Name",
    selector: (row: SupportDataType) => row["ticket_name"],
    sortable: true,
    center: true,
    width: "200px", // Set the width for this column
  },
  {
    name: "Description",
    selector: (row: SupportDataType) => row["description"],
    sortable: true,
    center: true,
    width: "230px", // Set the width for this column
  },
  {
    name: "IsActive",
    selector: (row: SupportDataType) => row["isActive"],
    sortable: true,
    center: true,
    width: "100px", // Set the width for this column
  },
  {
    name: "Status",
    selector: (row: SupportDataType) => row["status"],
    sortable: true,
    center: true,
    width: "150px", // Set the width for this column
    cell: (row: SupportDataType) => (
      <div
        style={{
          width: "120px",
          textAlign: "center",
          padding: "5px",
          borderRadius: "5px",
          backgroundColor:
            row.status === "NEW"
              ? "rgba(0, 0, 255, 0.1)"
              : row.status === "IN_PROGRESS"
              ? "rgba(255, 165, 0, 0.1)"
              : row.status === "PENDING"
              ? "rgba(255, 0, 0, 0.1)"
              : "rgba(0, 255, 0, 0.1)",
          color:
            row.status === "NEW"
              ? "blue"
              : row.status === "IN_PROGRESS"
              ? "orange"
              : row.status === "PENDING"
              ? "red"
              : "green",
        }}
      >
        {formatUnderscoredString(row.status)}
      </div>
    ),
  },
  {
    name: "Priority",
    selector: (row: SupportDataType) => row["priorty"],
    sortable: true,
    center: true,
    width: "100px", // Set the width for this column
    cell: (row: SupportDataType) => (
      <div
        style={{
          width: "90px",
          textAlign: "center",
          padding: "5px",
          borderRadius: "5px",
          backgroundColor:
            row.priorty === "LOW"
              ? "rgba(0, 255, 0, 0.1)"
              : row.priorty === "HIGH"
              ? "rgba(255, 0, 0, 0.1)"
              : "rgba(255, 200, 0, 0.1)",
          color:
            row.priorty === "LOW"
              ? "green"
              : row.priorty === "HIGH"
              ? "red"
              : "orange",
        }}
      >
        {formatUnderscoredString(row.priorty)}
      </div>
    ),
  },
  {
    name: "Date",
    selector: (row: SupportDataType) => row["date"],
    sortable: true,
    center: true,
    width: "200px", // Set the width for this column
  },
];

// // Function to transform supportData into allBugReports format
// export const supportData = (data: any) => {
//   return data.map((item: any) => ({
//     id: item._id,
//     username: item.user.fullName,
//     email: item.user.emailAddress,
//     ticket_name: item.name,
//     description: item.description,
//     isActive: item.isActive ? "true" : "false",
//     status: item.status,
//     priorty: item.priorty === null ? "N/A" : item.priorty,
//     date: "2024-02-19",
//   }));
// };

// // Function to log updated state
// const logUpdatedState = () => {
//   const state = Store.getState();
//   console.log("Updated state:", state);

//   // Mapping supportData to allBugReports format using updated state
//   const allBugReports = supportData(state.support.bugReports);
//   console.log("All bug reports:", allBugReports);
//   return allBugReports;
// };

// // Subscribe to store updates
// const unsubscribe = Store.subscribe(logUpdatedState);

// // Initial logging of the state
// export const allBugReports = logUpdatedState();
