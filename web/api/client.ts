import { getAccessToken } from "@/utils/storage";

const apiURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
console.log("DEBUG: apiURL is", apiURL);

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;

  const url = `${apiURL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  if (requireAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: "include", // Include cookies for refresh token
    });

    const rawBody = await response.text();
    let data: unknown = undefined;
    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = undefined;
      }
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Không có quyền hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        );
      }
      if (isRecord(data)) {
        const message = typeof data.message === "string" ? data.message : undefined;
        const errorText = typeof data.error === "string" ? data.error : undefined;
        throw new Error(message || errorText || "Request failed");
      }
      throw new Error("Request failed");
    }

    // Return data directly from response.data if exists, otherwise return data
    if (isRecord(data) && "data" in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối.",
      );
    }
    throw error;
  }
}

/**
 * API client with common methods
 */
export const api = {
  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return fetchApi<T>(endpoint, { ...options, method: "DELETE" });
  },
};

export default api;
