import { api } from "./axios";

export interface HomeTryOnAppointment {
  _id: string;
  preferredDate: string;
  preferredTime: string;
  preferredFrameType?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  address: string;
  city: string;
  state: string;
  notes?: string;
  createdAt: string;
  cancellationReason?: string;
}

export const getMyHomeTryOnAppointments = async (userId: string): Promise<HomeTryOnAppointment[]> => {
  try {
    const res = await api.get(`/home-try-on/my-appointments/${userId}`);
    const appointmentsData = res?.data?.data?.appointments;
    return Array.isArray(appointmentsData) ? appointmentsData : [];
  } catch (error) {
    console.error("getMyHomeTryOnAppointments error:", error);
    throw error;
  }
};
