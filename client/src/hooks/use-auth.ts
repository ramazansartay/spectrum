import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = loginSchema.extend({
  name: z.string(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type SignupCredentials = z.infer<typeof signupSchema>;

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/users/me");

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
    throw new Error(errorData.message || `${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function signup(credentials: SignupCredentials): Promise<User> {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
    throw new Error(errorData.message || `${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  const response = await fetch("/api/logout", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, LoginCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, SignupCredentials>({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
