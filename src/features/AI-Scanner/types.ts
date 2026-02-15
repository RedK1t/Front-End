export type message =
  | progressMessage
  | vulnerabilityMessage
  | endpointTransitionMessage;

type progressMessage = {
  type: "progress";
  url: string;
  current: number;
  total: number;
  timestamp: string;
};

type vulnerabilityMessage = {
  type: "vulnerability_found";
  vulnerability: {
    parameter: string;
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

export type vulnerabilities = {
  id: string;
  parameter: string;
  payload: string;
  url: string;
  method: string;
  confidence: number;
  explanation: string;
  raw_request: string;
  raw_response: string;
  timestamp: string;
}[];
