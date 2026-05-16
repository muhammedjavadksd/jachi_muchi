import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Sidebar menu items */
const SIDEBAR_MENU = [
  { id: "orders", label: "MY ORDERS", icon: null, link: "/account" },
  { id: "3d-model", label: "MY 3D MODEL", icon: "3d", link: "/account/3d-model" },
  { id: "account-info", label: "ACCOUNT INFORMATION", icon: null, link: "/account/info" },
  { id: "notifications", label: "MANAGE NOTIFICATIONS", icon: null, link: "/account/notifications" },
  { id: "address", label: "ADDRESS BOOK", icon: null, link: "/account/address" },
  { id: "prescriptions", label: "MY PRESCRIPTIONS", icon: null, link: "/account/prescriptions" },
  { id: "home-try-on", label: "MY HOME TRY-ON APPOINTMENTS", icon: null, link: "/account/home-try-on-appointments" },
];

/** Notification type interface */
interface NotificationType {
  id: string;
  label: string;
  description: string;
  icon: JSX.Element;
}

/** Notification types */
const NOTIFICATION_TYPES: NotificationType[] = [
  {
    id: "whatsapp",
    label: "WhatsApp Notification",
    description: "Receive order updates and offers on WhatsApp",
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: "sms",
    label: "SMS Notification",
    description: "Receive order updates and alerts via SMS",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: "push",
    label: "Push Notification",
    description: "Receive instant notifications on your device",
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email Notification",
    description: "Receive order confirmations and newsletters via email",
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export const ManageNotificationsPage = memo(function ManageNotificationsPage(): JSX.Element {
  const [activeMenu] = useState("notifications");
  
  // Notification states
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    whatsapp: true,
    sms: false,
    push: true,
    email: true,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  const toggleNotification = useCallback((id: string) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Desktop Sidebar
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

  // Mobile Account Menu (First on mobile)
  const mobileAccountMenu = useMemo(() => (
    <div className="md:hidden mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
  ), [activeMenu, isMobileMenuOpen]);

  // Notification Cards
  const notificationCards = useMemo(() => (
    NOTIFICATION_TYPES.map((notification) => (
      <div 
        key={notification.id}
        className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
            {notification.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{notification.label}</h3>
            <p className="text-sm text-gray-500 mt-1 pr-8">{notification.description}</p>
          </div>
        </div>

        <button
          onClick={() => toggleNotification(notification.id)}
          className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
            notifications[notification.id] ? "bg-teal-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              notifications[notification.id] ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    ))
  ), [notifications, toggleNotification]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Notifications</h1>
              <p className="text-gray-500 mt-1">Control how you receive updates and alerts</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Desktop Sidebar */}
              <div className="hidden md:block w-64 shrink-0">
                <div
                  className="sticky bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden"
                  style={{ top: `${PROMOTION_HEADER_HEIGHT + 32}px` }}
                >
                  <nav>{desktopSidebar}</nav>
                </div>
              </div>

              {/* Mobile Account Menu - FIRST */}
              {mobileAccountMenu}

              {/* Main Content */}
              <div className="flex-1">
                {/* Info Banner */}
                <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex gap-4">
                    <svg className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-700">
                      Stay updated with your orders, exclusive offers, and important account information by enabling your preferred notification channels.
                    </p>
                  </div>
                </div>

                {/* Notification Options */}
                <div className="space-y-4">
                  {notificationCards}
                </div>

                {/* Auto-save Note */}
                <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-600 flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Your preferences are automatically saved when you toggle any option.
                  </p>
                </div>
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

ManageNotificationsPage.displayName = "ManageNotificationsPage";