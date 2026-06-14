export type subdomainData = {
  host: string;
  ips: string[];
};

export type RecentTarget = {
  id: number;
  user_id: string;
  domain: string;
  created_at: string;
};

export type SupabaseSubdomain = {
  name: string;
  ips: string[];
  target_domain: string;
  status_code?: number;
  url?: string;
};

export type supabasePort = {
  id?: number;
  created_at?: string;
  port: number;
  service: string;
  state: string;
  protocol: string;
  service_version: string;
  sub_domain_name: string;
};

export type supabaseEndpoint = {
  id?: number;
  created_at?: string;
  request: string;
  response: string;
  path: string;
  method: string;
  status_code: number;
  source: string;
  sub_domain_name: string;
};

// AI Vulnerability Scanner — persisted scan history (Supabase `scans` table).
export type ScanSummary = {
  total_endpoints: number;
  total_payloads_tested: number;
  total_vulnerabilities: number;
  sqli_vulnerabilities: number;
  xss_vulnerabilities: number;
};

// List-row shape (no heavy `vulnerabilities` payload) for the history panel.
export type ScanRecordMeta = {
  id: string;
  domain: string | null;
  target_url: string | null;
  scan_id: string | null;
  summary: ScanSummary | null;
  created_at: string;
};

// Full record including the findings, fetched when a past scan is opened.
export type ScanRecordFull = ScanRecordMeta & {
  vulnerabilities: import("@/features/AI-Scanner/types").vulnerabilities;
};
