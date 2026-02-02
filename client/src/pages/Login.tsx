import { useLocation } from "wouter";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";

export function LoginPage() {
  const { mutate } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // This component will trigger the login flow on the server.
    // We fetch the /api/login endpoint, which will set the session cookie.
    fetch("/api/login").then(() => {
      // After the cookie is set, we can refetch the user data
      // and redirect to the homepage.
      mutate().then(() => {
        setLocation("/");
      });
    });
  }, [mutate, setLocation]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Please wait while we log you in...</p>
    </div>
  );
}
