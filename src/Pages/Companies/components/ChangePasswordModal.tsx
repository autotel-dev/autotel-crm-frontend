import { CionLogin } from "../../../utils/Constant";
import { H3, P } from "../../../AbstractElements";
import ChangePasswordForm from "./ChangePasswordForm";
type propsType = {
  toggle: () => void;
};

const PasswordModal = ({ toggle }: propsType) => {
  return (
    <div className="modal-toggle-wrapper">
      <H3>{CionLogin}</H3>
      <P>{"Fill in your information below to continue."}</P>
      <ChangePasswordForm toggle={toggle} />
    </div>
  );
};

export default PasswordModal;
