import type { DataProvider, AuthProvider, RaRecord } from "react-admin";
import { supabase } from "@/lib/supabase";

// ============================================================================
// Data provider — talks to our own /api/* Vercel serverless functions
// instead of calling Supabase directly from the browser. The functions hold
// the service_role key server-side and check the caller's session on every
// write; the browser only ever carries the public anon key (used for login)
// and the user's own access token (sent as a Bearer header below).
//
// Sign-in/out still goes straight to Supabase Auth via `authProvider` below
// — that's identity, not CMS data, and Supabase Auth is already the right
// place for it.
// ============================================================================

const API_BASE = "/api";

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
      ...(init.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : null) ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body as T;
}

function buildListQuery(
  sort: { field: string; order: string } | undefined,
  pagination: { page: number; perPage: number } | undefined,
  filter: Record<string, unknown> | undefined
) {
  const { page = 1, perPage = 100 } = pagination ?? {};
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;
  const params = new URLSearchParams({
    sort: sort?.field ?? "sort_order",
    order: sort?.order ?? "ASC",
    start: String(start),
    end: String(end),
    filter: JSON.stringify(filter ?? {}),
  });
  return params;
}

export const dataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const query = buildListQuery(params.sort, params.pagination, params.filter);
    const { data, total } = await apiRequest<{ data: RecordType[]; total: number }>(
      `/${resource}?${query.toString()}`
    );
    return { data, total };
  },

  getOne: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const { data } = await apiRequest<{ data: RecordType }>(`/${resource}/${params.id}`);
    return { data };
  },

  getMany: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const query = new URLSearchParams({ ids: params.ids.map(String).join(",") });
    const { data } = await apiRequest<{ data: RecordType[] }>(`/${resource}?${query.toString()}`);
    return { data };
  },

  getManyReference: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const filter = { ...(params.filter ?? {}), [params.target]: params.id };
    const query = buildListQuery(params.sort, params.pagination, filter);
    const { data, total } = await apiRequest<{ data: RecordType[]; total: number }>(
      `/${resource}?${query.toString()}`
    );
    return { data, total };
  },

  create: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const { data } = await apiRequest<{ data: RecordType }>(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    return { data };
  },

  update: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const { data } = await apiRequest<{ data: RecordType }>(`/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });
    return { data };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        apiRequest(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(params.data) })
      )
    );
    return { data: params.ids };
  },

  delete: async <RecordType extends RaRecord = RaRecord>(resource: string, params: any) => {
    const { data } = await apiRequest<{ data: RecordType | null }>(`/${resource}/${params.id}`, {
      method: "DELETE",
    });
    return { data: (data ?? { id: params.id }) as RecordType };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => apiRequest(`/${resource}/${id}`, { method: "DELETE" })));
    return { data: params.ids };
  },
};

// ============================================================================
// Auth provider — talks straight to Supabase Auth from the browser with the
// public anon key, exactly like before. This used to be ra-supabase's
// supabaseAuthProvider helper, but that package's latest release pulls in
// react-admin v5's internals (which this v4 app doesn't have a
// QueryClientProvider for), causing a "No QueryClient set" crash on the
// login page. It's a thin enough wrapper that it's simpler — and more
// stable — to own directly than to pin around the version mismatch.
// ============================================================================

export const authProvider: AuthProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  checkAuth: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Not authenticated");
  },

  checkError: async (error: { status?: number }) => {
    if (error?.status === 401 || error?.status === 403) {
      await supabase.auth.signOut();
      throw new Error("Session expired — please sign in again");
    }
  },

  getIdentity: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Not authenticated");
    return {
      id: data.user.id,
      fullName: data.user.email ?? "Admin",
    };
  },

  getPermissions: async () => {
    // There's no role system — every signed-in account (created by hand in
    // the Supabase dashboard) is treated as a full admin.
  },
};
