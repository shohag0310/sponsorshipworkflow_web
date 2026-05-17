import { api, getData } from "../../../api/client";
import type { Request, CreateRequestPayload } from "../types/request";

export interface DashboardStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Map backend response to frontend type
function mapRequest(req: any): Request {
  // Convert numeric status to string
  const statusMap: Record<number, string> = {
    1: "Draft",
    2: "PendingManagerApproval",
    3: "PendingFinanceReview",
    4: "Approved",
    5: "Rejected",
    6: "Cancelled",
  };

  return {
    ...req,
    requestedAmount: req.requestedAmount ?? 0,
    // Convert sponsorshipType object to string name
    sponsorshipType: req.sponsorshipType?.name ?? req.sponsorshipType ?? "",
    // Convert numeric status to string enum
    status: statusMap[req.status] ?? req.status,
  };
}

export const requestApi = {
  getAll: async (): Promise<Request[]> => {
    const res = await api.get("/requests");
    const data = getData(res) as any[];
    return data.map(mapRequest);
  },

  getById: async (id: string): Promise<Request> => {
    const res = await api.get(`/requests/${id}`);
    return mapRequest(getData(res));
  },

  create: async (data: CreateRequestPayload): Promise<Request> => {
    const res = await api.post("/requests", data);
    return getData(res) as Request;
  },

  update: async (id: string, data: Partial<Request>): Promise<Request> => {
    const res = await api.put(`/requests/${id}`, data);
    return getData(res) as Request;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/requests/${id}`);
  },

  submit: async (id: string): Promise<void> => {
    const res = await api.post(`/requests/${id}/submit`);
    return getData(res);
  },

  cancel: async (id: string): Promise<void> => {
    const res = await api.post(`/requests/${id}/cancel`);
    return getData(res);
  },

  getHistory: async (id: string): Promise<any[]> => {
    const res = await api.get(`/requests/${id}/history`);
    return getData(res) as any[];
  },

  getAllHistory: async (): Promise<any[]> => {
    const res = await api.get("/requests/all-history");
    return getData(res) as any[];
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get("/requests/dashboard-stats");
    return getData(res) as DashboardStats;
  },
};
