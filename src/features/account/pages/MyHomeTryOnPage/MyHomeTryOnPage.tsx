import { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "@/components";
import { EmptyState } from "@/shared/components";
const HEADER_SPACER_HEIGHT = 110;
import { api } from "@/shared/lib/axios";

interface Appointment {
  _id: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  address: string;
  city: string;
  state: string;
  createdAt: string;
  cancellationReason?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export const MyHomeTryOnPage = memo(function MyHomeTryOnPage(): JSX.Element {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/home-try-on");
        const appointmentsData = res?.data?.data?.appointments;
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleBookAppointment = useCallback(() => {
    navigate("/home-try-on/book");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={{ height: `${HEADER_SPACER_HEIGHT}px` }} />

      <main className="flex-1">
        <Container>
          <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Home Try-On Appointments</h1>
              <button
                type="button"
                onClick={handleBookAppointment}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Book Appointment
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-32" />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No Home Try-On appointments yet"
                description="Schedule a home try-on appointment for a convenient eyewear experience at your doorstep."
                action={
                  <button
                    type="button"
                    onClick={handleBookAppointment}
                    className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Book Appointment
                  </button>
                }
              />
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt._id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[apt.status] || "bg-gray-100 text-gray-800"}`}>
                          {apt.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(apt.createdAt)}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Preferred Date</span>
                        <p className="font-medium text-gray-900">{apt.preferredDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Preferred Time</span>
                        <p className="font-medium text-gray-900">{apt.preferredTime}</p>
                      </div>
                    </div>

                    {apt.status === "cancelled" && apt.cancellationReason && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-red-600">Cancellation Reason:</span> {apt.cancellationReason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

MyHomeTryOnPage.displayName = "MyHomeTryOnPage";
