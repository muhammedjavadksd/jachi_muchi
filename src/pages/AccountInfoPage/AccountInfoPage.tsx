import { memo, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/** Gender options */
const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

/** Sidebar menu items */
const SIDEBAR_MENU = [
  { id: "orders", label: "MY ORDERS", icon: null, link: "/account" },
  { id: "3d-model", label: "MY 3D MODEL", icon: "3d", link: "/account/3d-model" },
  { id: "account-info", label: "ACCOUNT INFORMATION", icon: null, link: "/account/info" },
  { id: "notifications", label: "MANAGE NOTIFICATIONS", icon: null, link: "/account/notifications" },
  { id: "address", label: "ADDRESS BOOK", icon: null, link: "/account/address" },
  { id: "prescriptions", label: "MY PRESCRIPTIONS", icon: null, link: "/account/prescriptions" },
];

/** Account info interface */
interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
}

export const AccountInfoPage = memo(function AccountInfoPage(): JSX.Element {
  const [activeMenu] = useState("account-info");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Account info state
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    firstName: "Muhammed",
    lastName: "Javad",
    email: "muhammedjavad119144@gmail.com",
    gender: "",
  });

  const [editForm, setEditForm] = useState<AccountInfo>(accountInfo);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const spacerStyle = useMemo(() => ({ height: `${PROMOTION_HEADER_HEIGHT}px` }), []);

  const handleEditClick = useCallback(() => {
    setEditForm(accountInfo);
    setIsEditing(true);
  }, [accountInfo]);

  const handleCancelEdit = useCallback(() => {
    setEditForm(accountInfo);
    setIsEditing(false);
  }, [accountInfo]);

  const handleSave = useCallback(() => {
    setAccountInfo(editForm);
    setIsEditing(false);
  }, [editForm]);

  const handleFormChange = useCallback((field: keyof AccountInfo, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordChange = useCallback((field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

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

  // Mobile Account Menu (First element on mobile)
  const mobileAccountMenu = useMemo(() => (
    <div className="md:hidden mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Account Menu Header */}
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

        {/* Menu Items - Shown when expanded */}
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

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-6 md:py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Information</h1>
              <p className="text-gray-500 mt-1">Manage your personal information</p>
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

              {/* Mobile: Account Menu FIRST */}
              {mobileAccountMenu}

              {/* Main Content */}
              <div className="flex-1">
                {/* Edit Information Button - Now comes AFTER Account Menu on mobile */}
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="w-full md:w-auto mb-6 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Information
                  </button>
                )}

                {/* Personal Details Card */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Personal Details</h2>
                  </div>

                  <div className="p-5 md:p-6 space-y-5">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900">
                        {accountInfo.firstName}
                      </div>
                    </div>

                    {/* Last Name with WhatsApp Icon */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 flex items-center justify-between">
                        {accountInfo.lastName}
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">💬</span> {/* WhatsApp style icon */}
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Email Address</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 break-all">
                        {accountInfo.email}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900">
                        {GENDER_OPTIONS.find(g => g.value === accountInfo.gender)?.label || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Security</h2>
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500 mt-1">Change your password to keep your account secure</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-2xl hover:bg-gray-200 transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Password Modal */}
      {showPasswordModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setShowPasswordModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-[101]">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <button onClick={() => setShowPasswordModal(false)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input type="password" value={passwordForm.currentPassword} onChange={(e) => handlePasswordChange("currentPassword", e.target.value)} className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input type="password" value={passwordForm.newPassword} onChange={(e) => handlePasswordChange("newPassword", e.target.value)} className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input type="password" value={passwordForm.confirmPassword} onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)} className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-medium">Cancel</button>
                <button onClick={handlePasswordSubmit} className="flex-1 py-3.5 bg-teal-600 text-white rounded-2xl font-medium">Update Password</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AccountInfoPage.displayName = "AccountInfoPage";