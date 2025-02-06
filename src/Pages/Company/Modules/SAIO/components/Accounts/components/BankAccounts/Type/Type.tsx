import { formatUnderscoredString } from "../../../../../../../../../Utilities/globals/globals";

export interface BankAccountsDataType {
  id: string;
  name: string;
  isActive: string;
  user: string;
  iban: string;
  accountType: string;
  date: string;
}

export const bankAccountsColumns = [
  {
    name: "ID",
    selector: (row: BankAccountsDataType) => row["id"],
    sortable: true,
    center: true,
    width: "300px", // Set the width for this column
  },
  {
    name: "Name",
    selector: (row: BankAccountsDataType) => row["name"],
    sortable: true,
    center: true,
    width: "250px", // Set the width for this column
  },
  {
    name: "User",
    selector: (row: BankAccountsDataType) => row["user"],
    sortable: true,
    center: true,
    width: "250px", // Set the width for this column
  },
  // {
  //     name: "IBAN Number",
  //     selector: (row: BankAccountsDataType) => row["iban"],
  //     sortable: true,
  //     center: true,
  //     width: "200px", // Set the width for this column
  // },
  // {
  //     name: "Account Type",
  //     selector: (row: BankAccountsDataType) => row["accountType"],
  //     sortable: true,
  //     center: true,
  //     width: "150px", // Set the width for this column
  // },

  {
    name: "IsActive",
    selector: (row: BankAccountsDataType) => row["isActive"],
    sortable: true,
    center: true,
    width: "160px", // Set the width for this column
  },
  {
    name: "Date",
    selector: (row: BankAccountsDataType) => row["date"],
    sortable: true,
    center: true,
    width: "200px", // Set the width for this column
  },
];
