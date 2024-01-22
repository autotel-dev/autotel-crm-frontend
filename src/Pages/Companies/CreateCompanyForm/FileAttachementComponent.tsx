import { Card, CardBody, Col } from "reactstrap";
import CommonHeader from "../../../Common/CommonHeader";
import Dropzone from "react-dropzone-uploader";
import { SingleFileUploads } from "../../../utils/Constant";

interface propTypes {
  heading: any;
}

const FileAttachementComponent: React.FC<propTypes> = ({ heading }) => {
  const getUploadParams = () => {
    return { url: "https://httpbin.org/post" };
  };
  const subTitle = [
    {
      text: "",
      code: "",
    },
  ];

  const handleAdd = (file: any) => {
    console.log("File added:", file.file);
    // Do something with the file or its meta data
    
  };
  return (
    <Col lg={4}>
      <Card>
        <CommonHeader title={heading} subTitle={subTitle} headClass="pb-0" />
        <CardBody>
          <Dropzone
            onChangeStatus={handleAdd}
            accept="image/*"
            getUploadParams={getUploadParams}
            maxFiles={1}
            inputContent="Drop files here or click to upload."
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default FileAttachementComponent;
