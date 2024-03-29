import { Card, CardBody, Col } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import Dropzone from "react-dropzone-uploader";
import { SingleFileUploads } from "../../../utils/Constant";
import { useDispatch } from "react-redux";
import {
  setCNICFront,
  setCNICBack,
  setNTNFile,
  setPTACertificate,
  setOther,
  setImageBackground,
  setComapnyLogo,
} from "../../../ReaduxToolkit/Reducer/CompanySlice";
import { H5 } from "../../../AbstractElements";

interface propTypes {
  heading: any;
  category: any;
}

const FileAttachementComponent: React.FC<propTypes> = ({
  heading,
  category,
}) => {
  const dispatch = useDispatch();
  const subTitle = [
    {
      text: "",
      code: "",
    },
  ];

  interface type {
    file: any;
    meta: any;
    remove: any;
  }
  const handleAdd = ({ file, meta, remove }: type, status: any) => {
    if (category === "imageBackground") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setImageBackground(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);

        dispatch(setImageBackground(null));
      }
    } else if (category === "companyLogo") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setComapnyLogo(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);
        dispatch(setComapnyLogo(null));
      }
    } else if (category === "cnicBack") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setCNICBack(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);
        dispatch(setCNICBack(null));
      }
    } else if (category === "cnicFront") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setCNICFront(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);
        dispatch(setCNICFront(null));
      }
    } else if (category === "ptaCertificate") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setPTACertificate(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);
        dispatch(setPTACertificate(null));
      }
    } else if (category === "ntnFile") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setNTNFile(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);
        dispatch(setNTNFile(null));
      }
    } else if (category === "other") {
      if (status === "done") {
        // console.log("File uploaded successfully:", file);
        dispatch(setOther(file));
      } else if (status === "removed") {
        // console.log("File removed:", file);
        dispatch(setOther(null));
      }
    }
  };
  return (
    <Col lg={4}>
      <Card>
        {/* <CommonHeader title={heading} subTitle={subTitle} headClass="pb-0" /> */}
        <H5>{heading}</H5>
        <CardBody>
          <Dropzone
            onChangeStatus={handleAdd}
            // accept="image/*"
            accept="image/*,application/pdf"
            maxFiles={1}
            inputContent="Drop files here or click to upload."
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default FileAttachementComponent;
