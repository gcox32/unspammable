import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

export function useAuthRedirect(redirectTo: string = "/") {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace(redirectTo);
    }
  }, [authStatus, router, redirectTo]);

  return authStatus;
} 