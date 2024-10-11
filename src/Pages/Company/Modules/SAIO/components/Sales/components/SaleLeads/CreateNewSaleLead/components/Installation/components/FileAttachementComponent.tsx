import { Card, CardBody, Col } from "reactstrap";
import Dropzone, { IFileWithMeta, StatusValue } from "react-dropzone-uploader";
import { useDispatch } from "react-redux";
import { H5 } from "../../../../../../../../../../../../AbstractElements";

interface propTypes {
  heading: any;
  category: any;
  handleChange: any;
  installationStatus: any;
}

const FileAttachementComponent: React.FC<propTypes> = ({
  heading,
  category,
  handleChange,
  installationStatus,
}) => {
  const dispatch = useDispatch();
  const subTitle = [
    {
      text: "",
      code: "",
    },
  ];
  interface type {
    file: File;
    meta: any;
    remove: any;
  }
  const handleAdd = ({ file, meta, remove }: type, status: any) => {
    if (category === "vehicleFront") {
      if (status === "done") {
        // // console.log("File uploaded successfully:", file);
        handleChange(category, file);
      } else if (status === "removed") {
        // // console.log("File removed:", file);

        handleChange(category, null);
      }
    } else if (category === "vehicleBack") {
      if (status === "done") {
        handleChange(category, file);
      } else if (status === "removed") {
        handleChange(category, null);
      }
    } else if (category === "trackerLocation") {
      if (status === "done") {
        handleChange(category, file);
      } else if (status === "removed") {
        handleChange(category, null);
      }
    } else if (category === "otherEvidence") {
      if (status === "done") {
        handleChange(category, file);
      } else if (status === "removed") {
        handleChange(category, null);
      }
    }
  };

  // Render a custom preview if the initialValue is a URL
  const renderPreview = (fileWithMeta: IFileWithMeta) => {
    const { meta, remove } = fileWithMeta;
    return (
      <div className="preview-container">
        {meta.previewUrl && (
          <img src={meta.previewUrl} alt="preview" className="preview-image" />
        )}
        <button onClick={remove}>Remove</button>
      </div>
    );
  };

  return (
    <Col xl={3} md={6}>
      {/* <CommonHeader title={heading} subTitle={subTitle} headClass="pb-0" /> */}
      <H5>{heading}</H5>
      <Dropzone
        disabled={installationStatus}
        onChangeStatus={handleAdd}
        accept="image/*"
        maxFiles={1}
        inputContent={
          installationStatus
            ? "Installed"
            : "Drop files here or click to upload."
        }
      />
    </Col>
  );
};

export default FileAttachementComponent;
