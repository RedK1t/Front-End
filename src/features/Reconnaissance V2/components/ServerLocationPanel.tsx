import LocationMap from "./map/LocationMap";
import Flag from "./map/Flag";
import Panel from "./Panel";
import DataRow from "./DataRow";
import useGetLocation from "../hooks/useGetLocation";
export default function ServerLocationPanel() {
  const { data: location, isFetching, error, refetch } = useGetLocation();
  if (!location) return null;

  const {
    city,
    region,
    country,
    postCode,
    countryCode,
    coords,
    isp,
    timezone,
    languages,
    currency,
    currencyCode,
  } = location;

  return (
    <Panel
      title="Server Location"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      <DataRow label="City" value={`${postCode}, ${city}, ${region}`} />
      <div className="rounded-6px flex items-center justify-between gap-2 gap-y-1 bg-black/40 px-2 py-3">
        <b className="normal-text text-light-red">Country</b>
        <div className="flex gap-3">
          {country}
          {countryCode && <Flag countryCode={countryCode} width={28} />}
        </div>
      </div>
      <DataRow label="Timezone" value={timezone} />
      <DataRow label="Languages" value={languages} />
      <DataRow label="Currency" value={`${currency} (${currencyCode})`} />
      <div className="flex flex-col pt-4">
        <LocationMap
          lat={coords?.latitude}
          lon={coords?.longitude}
          label={`Server (${isp})`}
        />
        <p className="small-text">
          Latitude: {coords?.latitude}, Longitude: {coords?.longitude}{" "}
        </p>
      </div>
    </Panel>
  );
}
