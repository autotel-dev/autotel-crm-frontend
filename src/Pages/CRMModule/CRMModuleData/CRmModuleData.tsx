import { Button } from "reactstrap";
import { Delete, Edit } from "../../../utils/Constant";
import { CRMModuleDataTableType } from "../CRMModuleTypes/CRMModuleTypes";
const style2 = { width: 60, fontSize: 14, padding: 3 };

//

export const crmModuleTableData = [
  {
    id: "1",
    name: "Inventory",
    icon: "icons 1",
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
    name: "Sales",
    icon: "icons 1",
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
    name: "Finance",
    icon: "icons 1",
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
    name: "Sales",
    icon: "icons 1",
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

export const crmModuleTableColumns = [
  {
    name: "Id",
    selector: (Row: CRMModuleDataTableType) => Row["id"],
    center: true,
    sortable: false,
  },
  {
    name: "Name",
    selector: (Row: CRMModuleDataTableType) => Row["name"],
    sortable: true,
    center: true,
  },
  {
    name: "Icon",
    selector: (Row: CRMModuleDataTableType) => Row["icon"],
    sortable: true,
    center: true,
  },
  {
    name: "Status",
    selector: (Row: CRMModuleDataTableType) => Row["isActive"],
    sortable: true,
    center: true,
  },
  {
    name: "Action",
    selector: (Row: CRMModuleDataTableType) => Row["action"],
    sortable: true,
    center: true,
  },
];
