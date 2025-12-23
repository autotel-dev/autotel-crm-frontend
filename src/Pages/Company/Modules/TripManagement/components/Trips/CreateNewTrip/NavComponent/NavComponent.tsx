import { Nav, NavItem, NavLink } from "reactstrap";
import { NavData } from "./NavData";
import { useSelector } from "react-redux";
import { BusinessFormCommonProps } from "../../../../../../../../Types/Forms/FormLayout/FormWizardTypes";
import { H4 } from "../../../../../../../../AbstractElements";

const NavComponent = ({
  callbackActive,
  activeTab,
}: BusinessFormCommonProps) => {
  const { userPersonalizationData } = useSelector(
    (state: any) => state.personalization
  );
  const handleTab = (id: number | undefined) => {
    if (id !== undefined) {
      callbackActive(id);
    }
  };
  return (
    <Nav
      className="nav-pills horizontal-options shipping-options"
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: "50px",
      }}
    >
      {NavData.map(
        (data, index) =>
          // activeTab !== undefined && activeTab >= data.activeTab && <NavItem key={index}>
          activeTab !== undefined && (
            <NavItem key={index}>
              <NavLink
                className={`b-r-0 ${activeTab === index + 1 ? "active" : ""}`}
                onClick={() => handleTab(data.activeTab)}
                style={{
                  backgroundColor: `${
                    activeTab === index + 1 && userPersonalizationData !== null
                      ? userPersonalizationData?.buttonsAndBarsColor
                      : ""
                  }`,
                }}
              >
                <div
                  className="horizontal-wizard"
                  style={{
                    color: `${
                      userPersonalizationData !== null &&
                      activeTab === index + 1
                        ? "white"
                        : "black"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    cursor: "pointer",
                  }}
                >
                  <div className="stroke-icon-wizard">
                    <i
                      className={`fa ${data.iconName}`}
                      style={{
                        color: `${
                          userPersonalizationData !== null &&
                          activeTab === index + 1
                            ? "white"
                            : "black"
                        }`,
                        fontSize: "17px",
                      }}
                    />
                  </div>
                  <div className="horizontal-wizard-content">
                    <H4>{data.tittle}</H4>
                  </div>
                </div>
              </NavLink>
            </NavItem>
          )
      )}
    </Nav>
  );
};

export default NavComponent;
