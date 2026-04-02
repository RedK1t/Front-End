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
