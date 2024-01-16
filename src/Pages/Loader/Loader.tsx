import { useEffect, useState } from "react";

const Loader = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);
  return (
    <>
      {show && (
        <div className="loader-wrapper-edited">
          <div className="loader-edited"></div>
        </div>
      )}
    </>
  );
};

export default Loader;
