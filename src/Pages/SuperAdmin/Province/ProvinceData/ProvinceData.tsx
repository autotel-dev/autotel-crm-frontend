import { Button } from "reactstrap";
import { Delete, Edit } from "../../../../utils/Constant";
import { ProvinceDataTableType } from "../ProvinceTypes/ProvinceTypes";

const style2 = { width: 60, fontSize: 14, padding: 3 };

//

export const provinceTableData = [
  {
    id: "1",
    name: "Sindh",
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
    name: "Punjab",
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
    name: "Balochistan",
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
    name: "KPK",
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

export const provinceTableColumns = [
  {
    name: "Id",
    selector: (Row: ProvinceDataTableType) => Row["id"],
    center: true,
    sortable: false,
  },
  {
    name: "Name",
    selector: (Row: ProvinceDataTableType) => Row["name"],
    sortable: true,
    center: true,
  },
  {
    name: "Status",
    selector: (Row: ProvinceDataTableType) => Row["isActive"],
    sortable: true,
    center: true,
  },
  {
    name: "Action",
    selector: (Row: ProvinceDataTableType) => Row["action"],
    sortable: true,
    center: true,
  },
];
