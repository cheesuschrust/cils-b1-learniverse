
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { Helmet } from "react-helmet-async";
import { Spinner } from "@/components/ui/spinner";

const AuthCallbackPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The code param is required for OAuth sign-ins
        const code = searchParams.get("code");
        
        if (!code) {
          throw new Error("No code parameter found in callback URL");
        }
        
        // Process the callback (Supabase will handle this automatically if using their auth helper)
        // We're just making sure to handle any errors here
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          throw error;
        }
        
        // Successfully authenticated
        navigate("/dashboard", { replace: true });
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed");
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Helmet>
        <title>Completing Authentication - CILS Italian Citizenship</title>
      </Helmet>
      
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Spinner size="xl" className="mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {error ? "Authentication Error" : "Completing Sign In..."}
          </h1>
          <p className="text-muted-foreground">
            {error 
              ? `${error}. Redirecting to login...` 
              : "Please wait while we complete your authentication."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
