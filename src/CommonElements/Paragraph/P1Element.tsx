import { Fragment } from "react";

interface propsTypes {
    children?: React.ReactNode;
    className?: string;
    innerHtml?: any;
    dangerouslySetInnerHTML?: any;
    id?: string;
    style?: any;
}

const P1 = (props: propsTypes) => {
    return (
        <p {...props}>
            {props.children}
        </p>

    );
};

export default P1;
