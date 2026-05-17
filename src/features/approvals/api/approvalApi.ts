import { api, getData } from "../../../api/client";
import type { ApprovalActionDto } from "../types/approval";
import type { Request } from "../../requests/types/request";

export const approvalApi = {
  // Manager approve
  managerApprove: async (requestId: string, remarks?: string): Promise<void> => {
    const res = await api.post(`/requests/${requestId}/manager-approve`, { remarks } as ApprovalActionDto);
    return getData(res);
  },

  // Manager reject
  managerReject: async (requestId: string, remarks: string): Promise<void> => {
    const res = await api.post(`/requests/${requestId}/manager-reject`, { remarks } as ApprovalActionDto);
    return getData(res);
  },

  // Finance approve
  financeApprove: async (requestId: string, remarks?: string): Promise<void> => {
    const res = await api.post(`/requests/${requestId}/finance-approve`, { remarks } as ApprovalActionDto);
    return getData(res);
  },

  // Finance reject
  financeReject: async (requestId: string, remarks: string): Promise<void> => {
    const res = await api.post(`/requests/${requestId}/finance-reject`, { remarks } as ApprovalActionDto);
    return getData(res);
  },

  // Get all requests (filtered by role on backend)
  getAll: async (): Promise<Request[]> => {
    const res = await api.get("/requests");
    return getData(res) as Request[];
  },

  // Submit request
  submitRequest: async (requestId: string): Promise<void> => {
    const res = await api.post(`/requests/${requestId}/submit`);
    return getData(res);
  },

  // Cancel request
  cancelRequest: async (requestId: string): Promise<void> => {
    const res = await api.post(`/requests/${requestId}/cancel`);
    return getData(res);
  },

  // Get workflow history
  getWorkflowHistory: async (requestId: string): Promise<any[]> => {
    const res = await api.get(`/requests/${requestId}/history`);
    return getData(res) as any[];
  },
};