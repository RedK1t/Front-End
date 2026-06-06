export type message =
  | scanStartMessage
  | progressMessage
  | vulnerabilityMessage
  | endpointTransitionMessage
  | scanCompleteMessage;

export type vulnType = "sql_injection" | "reflected_xss";

type scanStartMessage = {
  type: "scan_start";
  scan_id: string;
  target_url: string;
  timestamp: string;
};

type progressMessage = {
  type: "progress";
  url: string;
  current: number;
  total: number;
  tested?: number;
  timestamp: string;
};

type vulnerabilityMessage = {
  type: "vulnerability_found";
  vulnerability: {
    vuln_type: vulnType;
    severity: string | null;
    parameter: string | string[];
    payload: string;
    url: string;
    method: string;
    confidence: number;
    explanation: string;
    raw_request: string;
    raw_response: string;
    timestamp: string;
  };
};

type endpointTransitionMessage = {
  type: "endpoint_transition";
  completed_url: string;
  next_url: string;
  timestamp: string;
};

type scanCompleteMessage = {
  type: "scan_complete";
  scan_id: string;
  result: {
    success: boolean;
    total_endpoints: number;
    total_payloads_tested: number;
    total_vulnerabilities: number;
    sqli_vulnerabilities: number;
    xss_vulnerabilities: number;
  };
  total_vulnerabilities: number;
  timestamp: string;
};

export type vulnerabilities = {
  id: string;
  vuln_type: vulnType;
  severity: string | null;
  parameter: string | string[];
  payload: string;
  url: string;
  method: string;
  confidence: number;
  explanation: string;
  raw_request: string;
  raw_response: string;
  timestamp: string;
}[];
