// TypeScript interfaces for Supabase auth data
interface UserIdentity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
}

interface UserMetadata {
  email: string;
  email_verified: boolean;
  name: string;
  phone_verified: boolean;
  sub: string;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: UserIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

export default function useGetUserLocally(): AuthToken | null {
  try {
    const token = localStorage.getItem("sb-zxcmlsafspvebelqymhe-auth-token");
    if (!token) return null;

    const parsedData = JSON.parse(token);
    return parsedData as AuthToken;
  } catch (error) {
    console.error("Error parsing auth token from localStorage:", error);
    return null;
  }
}
