import { useDispatch } from "react-redux";
import { H3, LI, UL } from "../../AbstractElements";
import deleteAlert from "../Alerts/DeleteAlert";
import { CardType } from "./DataType/CompaniesDataType";
import ChangePasswordModal from "./components/ChangePasswordModal";
import { useState } from "react";
import CommonModal from "../../CommonElements/Ui-kits/CommonModal";
import ExtendPackage from "./ExtendPackage";
import { setCompany } from "../../ReaduxToolkit/Reducer/CompanySlice";
import { useNavigate } from "react-router-dom";

const CompaniesCardsFooter = ({ item }: CardType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [packageId, setPackageId] = useState("");
  const [id, setId] = useState("");
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const remainingDaysCalculation = (date: string) => {
    const targetDate = new Date(date);
    const currentDate = new Date();

    // Calculate the difference in milliseconds between the target date and the current date
    const differenceInMillis = targetDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const daysRemaining = Math.ceil(differenceInMillis / (1000 * 60 * 60 * 24));
    return daysRemaining;
    // console.log("Days remaining:", daysRemaining);
  };
  return (
    <>
      <UL
        className="social-follow simple-list flex-row"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <LI>
          <H3 className="mb-0">{item.totalOperators}</H3>
          <span className="f-light">Operators</span>
        </LI>
        <LI>
          <H3 className="mb-0">{item.totalBugReports}</H3>
          <span className="f-light">Complains</span>
        </LI>
        <LI>
          <H3 className="mb-0">
            {remainingDaysCalculation(item.packageExpirationDate)}
          </H3>
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
          onClick={() => {
            setIsUpdateModalOpen(true);
            // console.log("isUpdateModalOpen: ", isUpdateModalOpen);
            setId(item._id);
            setPackageId(item.package);
          }}
        >
          Extend
        </button>
        {/* <button
          style={{
            width: "100%",
            padding: "10px",
            color: "white",
            fontSize: "14px",
            background: "green",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            margin: "5px",
          }}
          onClick={() => {
            dispatch(setCompany(item));
            navigate(
              `${process.env.PUBLIC_URL}/super-admin/setup/company/update-company`
            );
          }}
        >
          Edit
        </button> */}
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
            toggle();
            var alertData = {
              title: "Are you sure?",
              text: "Once deleted, you will not be able to recover this ",
            };
            const type = "companyType";
            deleteAlert(alertData, item._id, type, dispatch);
            // -------------------------
          }}
        >
          Delete
        </button>
      </div>
      <ExtendPackage
        isVisible={isUpdateModalOpen}
        setIsVisible={setIsUpdateModalOpen}
        companyId={id}
        packageId={packageId}
      />
      {/* <CommonModal modalData={ModalData}>
        <ChangePasswordModal toggle={toggle} />
      </CommonModal> */}
    </>
  );
};

export default CompaniesCardsFooter;
