import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";

import MapFeatures from "./map-features.json";

interface Props {
  lat: number;
  lon: number;
  label?: string;
}

const MapChart = (location: Props) => {
  const { lat, lon, label } = location;

  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [-lon, -lat, 0],
        center: [0, 0],
        scale: 200,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Geographies
        geography={MapFeatures}
        fill="#0B0B0B"
        stroke="#CE3232"
        strokeWidth={1}
      >
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      <Annotation
        subject={[lon, lat]}
        dx={-80}
        dy={-80}
        connectorProps={{
          stroke: "#D7CCBC",
          strokeWidth: 3,
          strokeLinecap: "round",
        }}
      >
        <text x="-8" textAnchor="end" fill="#D7CCBC" fontSize={30}>
          {label || "Server"}
        </text>
      </Annotation>
    </ComposableMap>
  );
};

export default MapChart;
