import { useDispatch } from "react-redux";
import { H3, LI, UL } from "../../AbstractElements";
import deleteAlert from "../Alerts/DeleteAlert";
import { CardType } from "./DataType/CompaniesDataType";

const CompaniesCardsFooter = ({ item }: CardType) => {
  const dispatch = useDispatch();
  return (
    <>
      <UL
        className="social-follow simple-list flex-row"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <LI>
          <H3 className="mb-0">{item.operator}</H3>
          <span className="f-light">Operators</span>
        </LI>
        <LI>
          <H3 className="mb-0">{item.complains}</H3>
          <span className="f-light">Complains</span>
        </LI>
        <LI>
          <H3 className="mb-0">{item.expiry}</H3>
          <span className="f-light">Expiry</span>
        </LI>
      </UL>
      <div className="d-flex flex-row">
        <button
          style={{
            width: "100%",
            padding: "10px",
            color: "white",
            fontSize: "14px",
            background: "#35bfbf",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            margin: "5px",
          }}
        >
          Extend
        </button>
        <button
          style={{
            width: "100%",
            padding: "10px",
            color: "white",
            fontSize: "14px",
            background: "red",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            margin: "5px",
          }}
          onClick={() => {
            var alertData = {
              title: "Are you sure?",
              text: "Once deleted, you will not be able to recover this ",
            };
            const type = "companyType";
            deleteAlert(alertData, item._id, type, dispatch);
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

export default CompaniesCardsFooter;
