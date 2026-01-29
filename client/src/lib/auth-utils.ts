import { api as apiSchemas } from "@shared/routes";
import { api } from "./api";
import { InsertUser } from "@shared/schema";

const TOKEN_KEY = 'authToken';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getAuthToken() !== null;
}

export async function login(credentials: { email: string; password: string }): Promise<void> {
  const { token } = await api.post(apiSchemas.auth.login.path, credentials);
  if (typeof token !== 'string') {
    throw new Error('Invalid token received');
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export async function register(userData: Omit<InsertUser, 'id' | 'createdAt' | 'passwordHash'> & { password: string }): Promise<void> {
    await api.post(apiSchemas.auth.register.path, userData);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.location.reload();
}
