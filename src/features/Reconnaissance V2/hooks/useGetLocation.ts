import { useQuery } from "@tanstack/react-query";
import useGetIp from "./useGetIp";

function getLocation(response: {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  asn: string;
  org: string;
}) {
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
