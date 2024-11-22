import { Fragment } from "react";

interface propsTypes {
  children?: React.ReactNode;
  className?: string;
  innerHtml?: any;
  dangerouslySetInnerHTML?: any;
  id?: string;
  style?: any;
}

const P2 = (props: propsTypes) => {
  return (
    <Fragment>
      <p {...props} style={{ fontSize: "14px", marginBottom: "0px" }}>
        {props.children}
      </p>
    </Fragment>
  );
};

export default P2;
