export default function useIsLogin() {
  const isLogin = localStorage.getItem("sb-zxcmlsafspvebelqymhe-auth-token");
  return isLogin !== null;
}
