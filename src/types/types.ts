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
