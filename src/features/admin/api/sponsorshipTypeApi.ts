import { api, getData } from "../../../api/client";

export interface SponsorshipType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export const sponsorshipTypeApi = {
  getAll: async (): Promise<SponsorshipType[]> => {
    const res = await api.get("/sponsorshipTypes");
    return getData(res) as SponsorshipType[];
  },

  getById: async (id: string): Promise<SponsorshipType> => {
    const res = await api.get(`/sponsorshipTypes/${id}`);
    return getData(res) as SponsorshipType;
  },

  create: async (name: string): Promise<SponsorshipType> => {
    const res = await api.post("/sponsorshipTypes", { name });
    return getData(res) as SponsorshipType;
  },

  update: async (id: string, name: string): Promise<SponsorshipType> => {
    const res = await api.put(`/sponsorshipTypes/${id}`, { name });
    return getData(res) as SponsorshipType;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sponsorshipTypes/${id}`);
  },
};