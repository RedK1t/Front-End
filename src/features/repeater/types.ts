export type RepeaterTab = {
  id: string;
  name: string;
  request: string;
  response: string;
  loading: boolean;
  error: string | null;
  statusCode?: number;
  reason?: string;
  elapsedTime?: number;
  size?: number;
};

export type RepeaterResponse = {
  type: "repeater_response";
  req_id?: string;
  success: boolean;
  data?: {
    status_code: number;
    reason: string;
    url: string;
    raw_response: string;
    headers: Record<string, string>;
    body: string;
    elapsed_time: number;
    size: number;
  };
  error?: string;
};
