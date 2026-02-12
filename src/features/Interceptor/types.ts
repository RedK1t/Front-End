export type intercept_status = {
  type: "intercept_status";
  enabled: boolean;
};
export type mark_for_response_intercept = {
  type: "marked_for_response_intercept";
  id: string;
};
export type unmark_for_response_intercept = {
  type: "unmarked_for_response_intercept";
  id: string;
};
export type intercepted_request = {
  Time: string;
  type: "intercepted_request";
  id: string;
  method: string;
  url: string;
  host: string;
  headers: string;
  body: string;
  raw: string;
};
export type intercepted_response = {
  Time: string;
  type: "intercepted_response";
  id: string;
  parent_id: string;
  method: string;
  url: string;
  host: string;
  status_code: number;
  response_headers: string;
  response_body: string;
  raw_response: string;
  parent_request: {
    method: string;
    url: string;
    host: string;
    headers: string;
    body: string;
    raw: string;
  };
};
export type forwarded = {
  type: "forwarded";
  id: string;
};
export type dropped = {
  type: "dropped";
  id: string;
};
export type queue_cleared = {
  type: "queue_cleared";
};

export type message =
  | intercept_status
  | mark_for_response_intercept
  | unmark_for_response_intercept
  | intercepted_request
  | intercepted_response
  | forwarded
  | dropped
  | queue_cleared;
