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
