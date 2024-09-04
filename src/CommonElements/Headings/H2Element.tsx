import { ReactNode } from "react";

interface propsTypes {
    children?: ReactNode;
    className?: string;
  }
  
  const H2 = (props: propsTypes) => {
    const { children = "" } = props;
    return <h2 {...props} style={{ fontSize: "22px" }}>{children}</h2>;
  };
  
  export default H2;
  