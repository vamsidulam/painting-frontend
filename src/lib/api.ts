const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:3000";

const TOKEN_KEY = "brushly.admin.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function api<T = unknown>(
  path: string,
  { body, auth = true, headers, ...rest }: ApiOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (body !== undefined && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error?: unknown }).error)
        : undefined) ||
      (data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message)
        : undefined) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
