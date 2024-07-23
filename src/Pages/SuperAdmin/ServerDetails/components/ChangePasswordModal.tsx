import OTPForm from "./OTPForm";
type propsType = {
  toggle: () => void;
};

const ChangePasswordModal = ({ toggle }: propsType) => {
  return (
    <div className="modal-toggle-wrapper" style={{ padding: "20px 10px" }}>
      <OTPForm toggle={toggle} />
    </div>
  );
};

export default ChangePasswordModal;
