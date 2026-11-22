import { H5, H6, Image, LI, UL } from "../../../../AbstractElements";
import { dynamicImage } from "../../../../Service";
import { topCountriesData } from "../../../../Data/Dashboard/ShoppingPlace/TopCountries";
import { Col } from "reactstrap";
// Use the app's one Maps loader (google-maps-react + GOOGLE_MAPS_OPTIONS).
// A second loader here (@react-google-maps/api) put two copies of Google Maps
// on the page once another map was opened, e.g. dashboard -> Geofence.
import { GoogleApiWrapper, Map } from "google-maps-react";
import { GOOGLE_MAPS_OPTIONS } from "../../../../utils/googleMapsOptions";
const containerStyle = {
  height: "200px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};
const TopCountriesBody = ({ google }: any) => {
  return (
    <>
      <UL className="d-flex simple-list flex-row">
        {topCountriesData.map((data, index) => (
          <LI
            className={`light-card balance-card bg-light-${data.color}`}
            key={index}
          >
            <Image src={dynamicImage(`dashboard/${data.img}.jpg`)} alt="" />
            <div className="Countries">
              <span
                className={`rounded-pill badge-${data.countrybadge}`}
              ></span>
              <H5>{data.country}</H5>
              <H6 className="mt-1 mb-0">{data.percentage}</H6>
            </div>
          </LI>
        ))}
      </UL>
      <Col xl="12" className="mt-4">
        <div className="map-js-height">
          <div id="gmap-simple" className="map-block" style={{ ...containerStyle, position: "relative" }}>
            <Map
              google={google}
              initialCenter={center}
              zoom={10}
              containerStyle={{ position: "absolute", width: "100%", ...containerStyle }}
            />
          </div>
        </div>
      </Col>
    </>
  );
};

export default GoogleApiWrapper(GOOGLE_MAPS_OPTIONS)(TopCountriesBody) as any;


//  {/* Marker with rotation of 60 degrees */}
{/* <Marker position={center} />
</GoogleMap> */}
