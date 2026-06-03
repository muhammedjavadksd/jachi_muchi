import { memo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyHomeTryOnAppointments } from "../../api/homeTryOn";
import { useAuth } from "../../context/AuthContext";
import type { HomeTryOnAppointment } from "../../api/homeTryOn";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_MESSAGES: Record<string, string> = {
  confirmed: "Our team will contact you shortly regarding your appointment.",
  completed: "Appointment completed successfully.",
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

export const AccountHomeTryOnAppointmentsPage = memo(function AccountHomeTryOnAppointmentsPage(): JSX.Element {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<HomeTryOnAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    const fetchAppointments = async () => {
      try {
        const data = await getMyHomeTryOnAppointments(user.id);
        setAppointments(data);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.id]);

  const handleBookAppointment = useCallback(() => {
    navigate("/home-try-on");
  }, [navigate]);

  return (
    <>
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Home Try-On Appointments</h1>
          <p className="text-gray-500 mt-1">Track your home try-on appointment status</p>
        </div>
        <button
          type="button"
          onClick={handleBookAppointment}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Book Home Try-On
        </button>
      </div>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-36" />
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Home Try-On appointments found.</h2>
                    <p className="text-gray-500 mb-6">Schedule a home try-on appointment for a convenient eyewear experience at your doorstep.</p>
                    <button
                      type="button"
                      onClick={handleBookAppointment}
                      className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      Book Home Try-On
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[apt.status] || "bg-gray-100 text-gray-800"}`}>
                            {apt.status}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(apt.createdAt)}</span>
                        </div>
                        <div className="p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            {apt.preferredFrameType && (
                              <div>
                                <span className="text-gray-500">Frame Type</span>
                                <p className="font-medium text-gray-900">{apt.preferredFrameType}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Preferred Date</span>
                              <p className="font-medium text-gray-900">{apt.preferredDate}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Preferred Time</span>
                              <p className="font-medium text-gray-900">{apt.preferredTime}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-gray-500">Address</span>
                              <p className="font-medium text-gray-900">{apt.address}, {apt.city}, {apt.state}</p>
                            </div>
                            {apt.notes && (
                              <div className="sm:col-span-2">
                                <span className="text-gray-500">Notes</span>
                                <p className="text-gray-700">{apt.notes}</p>
                              </div>
                            )}
                          </div>

                          {apt.status === "cancelled" && apt.cancellationReason && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-red-600">Cancellation Reason:</span> {apt.cancellationReason}
                              </p>
                            </div>
                          )}

                          {STATUS_MESSAGES[apt.status] && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-500">{STATUS_MESSAGES[apt.status]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
    </>
  );
});

AccountHomeTryOnAppointmentsPage.displayName = "AccountHomeTryOnAppointmentsPage";
