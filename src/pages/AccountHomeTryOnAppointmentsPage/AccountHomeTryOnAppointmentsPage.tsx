import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { api } from "../../api/axios";

const PROMOTION_HEADER_HEIGHT = 140;

const SIDEBAR_MENU = [
  { id: "orders", label: "MY ORDERS", icon: null, link: "/account" },
  { id: "3d-model", label: "MY 3D MODEL", icon: "3d", link: "/account/3d-model" },
  { id: "account-info", label: "ACCOUNT INFORMATION", icon: null, link: "/account/info" },
  { id: "notifications", label: "MANAGE NOTIFICATIONS", icon: null, link: "/account/notifications" },
  { id: "address", label: "ADDRESS BOOK", icon: null, link: "/account/address" },
  { id: "prescriptions", label: "MY PRESCRIPTIONS", icon: null, link: "/account/prescriptions" },
  { id: "home-try-on", label: "MY HOME TRY-ON APPOINTMENTS", icon: null, link: "/account/home-try-on-appointments" },
];

interface Appointment {
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu] = useState("home-try-on");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/home-try-on/my-appointments");
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
    navigate("/home-try-on");
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const spacerStyle = useMemo(() => ({ height: `${PROMOTION_HEADER_HEIGHT}px` }), []);

  const desktopSidebar = useMemo(() => (
    SIDEBAR_MENU.map((item) => (
      <Link
        key={item.id}
        to={item.link}
        className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between border-b border-gray-200 last:border-b-0 ${
          activeMenu === item.id ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span>{item.label}</span>
        {item.icon === "3d" && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        )}
      </Link>
    ))
  ), [activeMenu]);

  const mobileAccountMenu = useMemo(() => (
    <div className="md:hidden mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={toggleMobileMenu}
          className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors border-b border-gray-200"
        >
          <span className="font-medium text-gray-900">Account Menu</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isMobileMenuOpen && (
          <div className="divide-y divide-gray-100">
            {SIDEBAR_MENU.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`block px-5 py-4 text-sm font-medium transition-colors ${
                  activeMenu === item.id ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.icon === "3d" && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  ), [activeMenu, isMobileMenuOpen, toggleMobileMenu]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
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

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="hidden md:block w-64 shrink-0">
                <div
                  className="sticky bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden"
                  style={{ top: `${PROMOTION_HEADER_HEIGHT + 32}px` }}
                >
                  <nav>{desktopSidebar}</nav>
                </div>
              </div>

              {mobileAccountMenu}

              <div className="flex-1">
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
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

AccountHomeTryOnAppointmentsPage.displayName = "AccountHomeTryOnAppointmentsPage";
