import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import { toApiError } from "../api/client";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { byteLength } from "../lib/format";
import { useAuthStore } from "../stores/authStore";
import { AuthLayout } from "./AuthLayout";

type Errors = Partial<Record<"name" | "email" | "password", string>>;

const validate = (name: string, email: string, password: string): Errors => {
  const e: Errors = {};
  if (!name.trim()) e.name = "Name is required";
  else if (name.trim().length > 100) e.name = "Name cannot exceed 100 characters";
  if (!email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Email is invalid";
  if (password.length < 8) e.password = "Password must be at least 8 characters";
  else if (byteLength(password) > 72) e.password = "Password must be at most 72 bytes";
  return e;
};

export function Register() {
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(name, email, password);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      const apiErr = toApiError(err);
      setErrors({
        name: apiErr.fieldError("name"),
        email: apiErr.fieldError("email"),
        password: apiErr.fieldError("password"),
      });
      setFormError(apiErr.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Upload scanned Bangla documents and ask questions about them."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        {formError && <Alert>{formError}</Alert>}
        <Input
          label="Name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          maxLength={100}
          autoFocus
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint="At least 8 characters."
        />
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
