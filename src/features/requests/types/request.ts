import type { RequestStatusType } from "../../../constants/requestStatus";

export type Request = {
  id: string;
  title: string;
  department: string;
  sponsorshipType?: string;
  sponsorshipTypeId?: string;
  eventName: string;
  eventDate: string;
  requestedAmount: number;
  purpose: string;
  expectedBusinessBenefit?: string;
  remarks?: string;
  status: RequestStatusType;
  createdAt: string;
  requestorId?: string;
};

export type CreateRequestPayload = {
  title: string;
  department: string;
  sponsorshipTypeId?: string;
  eventName: string;
  eventDate: string;
  requestedAmount: number;
  purpose: string;
  expectedBusinessBenefit?: string;
  remarks?: string;
  status?: RequestStatusType;
};
