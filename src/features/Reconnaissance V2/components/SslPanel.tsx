import useGetSslCert from "../hooks/useGetSllCert";
import DataRow from "./DataRow";
import Panel from "./Panel";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
};

function getExtendedKeyUsage(oids: string[]) {
  const oidMap: { [key: string]: string } = {
    "1.3.6.1.5.5.7.3.1": "TLS Web Server Authentication",
    "1.3.6.1.5.5.7.3.2": "TLS Web Client Authentication",
    "1.3.6.1.5.5.7.3.3": "Code Signing",
    "1.3.6.1.5.5.7.3.4": "Email Protection (SMIME)",
    "1.3.6.1.5.5.7.3.8": "Time Stamping",
    "1.3.6.1.5.5.7.3.9": "OCSP Signing",
    "1.3.6.1.5.5.7.3.5": "IPSec End System",
    "1.3.6.1.5.5.7.3.6": "IPSec Tunnel",
    "1.3.6.1.5.5.7.3.7": "IPSec User",
    "1.3.6.1.5.5.8.2.2": "IKE Intermediate",
    "2.16.840.1.113730.4.1": "Netscape Server Gated Crypto",
    "1.3.6.1.4.1.311.10.3.3": "Microsoft Server Gated Crypto",
    "1.3.6.1.4.1.311.10.3.4": "Microsoft Encrypted File System",
    "1.3.6.1.4.1.311.20.2.2": "Microsoft Smartcard Logon",
    "1.3.6.1.4.1.311.10.3.12": "Microsoft Document Signing",
    "0.9.2342.19200300.100.1.3": "Email Address (in Subject Alternative Name)",
  };
  const results = oids.map((oid) => oidMap[oid] || oid);
  return results.filter((item, index) => results.indexOf(item) === index);
}

export default function SslPanel() {
  const { data: sslCert, isLoading, error } = useGetSslCert();
  const {
    subject,
    issuer,
    fingerprint,
    serialNumber,
    asn1Curve,
    nistCurve,
    valid_to,
    valid_from,
    ext_key_usage,
  } = sslCert || {};
  return (
    <Panel title="SSL Certificate" isLoading={isLoading} error={error}>
      {subject && <DataRow label="Subject" value={subject?.CN} />}
      {issuer?.O && <DataRow label="Issuer" value={issuer.O} />}
      {asn1Curve && <DataRow label="ASN1 Curve" value={asn1Curve} />}
      {nistCurve && <DataRow label="NIST Curve" value={nistCurve} />}
      {valid_to && <DataRow label="Expires" value={formatDate(valid_to)} />}
      {valid_from && <DataRow label="Renewed" value={formatDate(valid_from)} />}
      {serialNumber && <DataRow label="Serial Num" value={serialNumber} />}
      {fingerprint && <DataRow label="Fingerprint" value={fingerprint} />}
      {ext_key_usage && (
        <DataRow label="Extended Key Usage" value="">
          {getExtendedKeyUsage(ext_key_usage).map((item, index) => (
            <p
              key={index}
              className="normal-text text-dark-yellowish-white bg-dark-yellowish-white/10 rounded-6px flex items-center justify-between px-2 py-1"
            >
              {item}
            </p>
          ))}
        </DataRow>
      )}
    </Panel>
  );
}
