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
