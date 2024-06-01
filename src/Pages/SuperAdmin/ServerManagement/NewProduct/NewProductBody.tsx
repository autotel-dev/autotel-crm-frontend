import { Table } from "reactstrap";
import { tableHeader } from "../../../../Data/Dashboard/ShoppingPlace/NewProductTable";
import NewProductTableBody from "./NewProductTableBody";

const NewProductBody = () => {
  return (
    <div className="table-responsive theme-scrollbar recent-wrapper">
      <Table className="display order-wrapper" id="recent-order">
        <thead>
          <tr>
            {tableHeader.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <NewProductTableBody />
        </tbody>
      </Table>
    </div>
  );
};

export default NewProductBody;
