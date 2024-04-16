import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { BalanceOverviews, Href } from "../../../utils/Constant";
import ReactApexChart from "react-apexcharts";
import { H3, H5, Image, UL } from "../../../AbstractElements";
import { ApexOptions } from "apexcharts";
import CommonHeader from "../../../Common/CommonHeader";
import { Link } from "react-router-dom";
import { dynamicImage } from "../../../Service";

const KilledVehicles = () => {
  const killVehicles = [
    {
      img: "10",
      deviceName: "KOB-9162",
      lastPacket: "02:08:45",
      duration: "Clossing Date",
      date: "14 Jan 2023",
      amount: "$46.564",
      btn: "Contract Sent",
    },
    {
      img: "11",
      deviceName: "KOB-9162",
      lastPacket: "02:08:45",
      duration: "Clossing Date",
      date: "20 May 2023",
      amount: "$20.690",
      btn: "Contract Sent",
    },
    {
      img: "12",
      deviceName: "KOB-9162",
      lastPacket: "02:08:45",
      duration: "Clossing Date",
      date: "12 Aug 2023",
      amount: "$34.954",
      btn: "Contract Sent",
    },
    {
      img: "13",
      deviceName: "KOB-9162",
      lastPacket: "02:08:45",
      duration: "Clossing Date",
      date: "16 Aug 2023",
      amount: "$12.954",
      btn: "Contract Sent",
    },
  ];
  return (
    <Col xl="6">
      <Row>
        <Col xl="12" lg="12">
          <Card className="deal-open">
            <CardHeader className="pb-0">
              <div className="header-top">
                <H3 className="m-0">Killed Vehicles</H3>
              </div>
            </CardHeader>
            <CardBody>
              <UL className="theme-scrollbar">
                {killVehicles.map((data, index) => (
                  <li
                    className="d-flex align-items-center"
                    key={index}
                    style={{
                      padding: "13px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Image
                        src={dynamicImage(`dashboard-2/user/${data.img}.jpg`)}
                        alt=""
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Link className="ms-2" to={Href}>
                          <H5>{data.deviceName}</H5>
                          <span>{data.lastPacket}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <H5>Autotel</H5>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        width: "30%",
                        alignItems: "center",
                      }}
                    >
                      <H5>02:08:45</H5>
                    </div>
                  </li>
                ))}
              </UL>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default KilledVehicles;
