import { Button } from "reactstrap";
import { Delete, Edit } from "../../../utils/Constant";
import { PackageDataTableType } from "../PackageType/PackageType";

const style2 = { width: 60, fontSize: 14, padding: 3 };

//

export const packageTableData = [
  {
    id: "1",
    title: "Package 1",
    price: 300000,
    duration: "MONTHLY",
    isActive: "active",
    action: (
      <div>
        <Button style={style2} color="danger me-2" size="xs">
          {Delete}
        </Button>
        <Button style={style2} color="success" size="xs">
          {Edit}
        </Button>
      </div>
    ),
  },
  {
    id: "2",
    title: "Package 2",
    price: 300000,
    duration: "MONTHLY",
    isActive: "active",
    action: (
      <div>
        <Button style={style2} color="danger me-2" size="xs">
          {Delete}
        </Button>
        <Button style={style2} color="success" size="xs">
          {Edit}
        </Button>
      </div>
    ),
  },
  {
    id: "3",
    title: "Package 3",
    price: 300000,
    duration: "MONTHLY",
    isActive: "active",
    action: (
      <div>
        <Button style={style2} color="danger me-2" size="xs">
          {Delete}
        </Button>
        <Button style={style2} color="success" size="xs">
          {Edit}
        </Button>
      </div>
    ),
  },
  {
    id: "4",
    title: "Package 4",
    price: 300000,
    duration: "MONTHLY",
    isActive: "active",
    action: (
      <div>
        <Button style={style2} color="danger me-2" size="xs">
          {Delete}
        </Button>
        <Button style={style2} color="success" size="xs">
          {Edit}
        </Button>
      </div>
    ),
  },
];

export const packageTableColumns = [
  {
    name: "Id",
    selector: (Row: PackageDataTableType) => Row["id"],
    center: true,
    sortable: false,
  },
  {
    name: "Title",
    selector: (Row: PackageDataTableType) => Row["title"],
    sortable: true,
    center: true,
  },
  {
    name: "Price",
    selector: (Row: PackageDataTableType) => Row["price"],
    sortable: true,
    center: true,
  },
  {
    name: "Duration",
    selector: (Row: PackageDataTableType) => Row["duration"],
    sortable: true,
    center: true,
  },
  {
    name: "Status",
    selector: (Row: PackageDataTableType) => Row["isActive"],
    sortable: true,
    center: true,
  },
  {
    name: "Action",
    selector: (Row: PackageDataTableType) => Row["action"],
    sortable: true,
    center: true,
  },
];
