import { useEffect, useRef } from "react";
import { useDomain } from "@/context/DomainContext";
import useProxyTraffic from "./useProxyTraffic";
import useProxyActions from "./useProxyActions";

// Automatically add the domain the user is currently working on to the Target Scope
// as an Include rule (once, no duplicates). The scope toggle is left as-is.
export default function useAutoAddScope() {
  const { domain } = useDomain();
  const { scope } = useProxyTraffic();
  const { addScopeRule, getScope } = useProxyActions();
  const addedRef = useRef<Set<string>>(new Set());

  // Make sure we know the current scope before deciding to add.
  useEffect(() => {
    getScope();
  }, [getScope]);

  useEffect(() => {
    if (!domain) return;
    // Wait until scope has loaded so we can dedupe against existing includes.
    if (!scope) return;
    if (addedRef.current.has(domain)) return;

    const alreadyIncluded = (scope.include || []).some(
      (rule) => rule.pattern === domain,
    );
    if (!alreadyIncluded) {
      addScopeRule("include", domain);
    }
    // Mark handled either way so we don't re-send on every scope update.
    addedRef.current.add(domain);
  }, [domain, scope, addScopeRule]);
}
