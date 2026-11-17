import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import { toApiError } from "../api/client";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { useAuthStore } from "../stores/authStore";
import { AuthLayout } from "./AuthLayout";

export function Login() {
  const login = useAuthStore((s) => s.login);
  const expired = useAuthStore((s) => s.expired);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(toApiError(err).message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to search your Bangla documents."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {expired && !error && <Alert kind="info">Your session expired. Please log in again.</Alert>}
        {error && <Alert>{error}</Alert>}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
