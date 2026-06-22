import { api } from "@/shared/lib/axios";
import type { HomeTryOnAppointment } from "@/features/homeTryOn/types";

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
