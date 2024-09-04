import { ReactNode } from "react";

export interface propsTypes {
  children?: ReactNode;
  className?: string;
}

const H7 = (props: propsTypes) => {
  return (
    <h6
      {...props}
      style={{
        textAlign: "center",
        fontSize: "11px",
        fontWeight: "700",
      }}
    >
      {props.children}
    </h6>
  );
};

export default H7;
