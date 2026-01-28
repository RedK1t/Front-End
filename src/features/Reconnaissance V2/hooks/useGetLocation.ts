import { useQuery } from "@tanstack/react-query";
import useGetIp from "./useGetIp";

function getLocation(response) {
  return {
    city: response.city,
    region: response.region,
    country: response.country_name,
    postCode: response.postal,
    regionCode: response.region_code,
    countryCode: response.country_code,
    coords: {
      latitude: response.latitude,
      longitude: response.longitude,
    },
    isp: response.org,
    timezone: response.timezone,
    languages: response.languages,
    currencyCode: response.currency,
    currency: response.currency_name,
    countryDomain: response.country_tld,
    countryAreaSize: response.country_area,
    countryPopulation: response.country_population,
  };
}

function useGetLocation() {
  const { data: ipData } = useGetIp();
  const ipAddress = ipData?.ip;
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["location", ipAddress],
    queryFn: async () => {
      const res = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const json = await res.json();
      const location = getLocation(json);
      return location;
    },
    enabled: !!ipAddress,
  });
  return { data, isFetching, error, refetch };
}

export default useGetLocation;
