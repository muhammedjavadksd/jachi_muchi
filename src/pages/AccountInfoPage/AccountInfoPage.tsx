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

/**
 * Account Information Page
 * Displays and allows editing of user account information
 */
export const AccountInfoPage = memo(function AccountInfoPage(): JSX.Element {
  const [activeMenu] = useState("account-info");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Account info state
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    firstName: "Muhammed",
    lastName: "Javad",
    email: "muhammedjavad119144@gmail.com",
    gender: "",
  });

  // Edit form state
  const [editForm, setEditForm] = useState<AccountInfo>(accountInfo);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  /** Handle edit toggle */
  const handleEditClick = useCallback(() => {
    setEditForm(accountInfo);
    setIsEditing(true);
  }, [accountInfo]);

  /** Handle cancel edit */
  const handleCancelEdit = useCallback(() => {
    setEditForm(accountInfo);
    setIsEditing(false);
  }, [accountInfo]);

  /** Handle save */
  const handleSave = useCallback(() => {
    setAccountInfo(editForm);
    setIsEditing(false);
  }, [editForm]);

  /** Handle form change */
  const handleFormChange = useCallback((field: keyof AccountInfo, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  /** Handle password form change */
  const handlePasswordChange = useCallback((field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  }, []);

  /** Handle password submit */
  const handlePasswordSubmit = useCallback(() => {
    // Password change logic would go here
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }, []);

  /** Memoize sidebar menu */
  const sidebarMenu = useMemo(() => (
    SIDEBAR_MENU.map((item) => (
      <Link
        key={item.id}
        to={item.link}
        className={`w-full text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between border-b border-gray-200 last:border-b-0 ${
          activeMenu === item.id
            ? "bg-teal-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
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

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-6">
        <Container>
          <div className="flex gap-8">
            {/* Left Sidebar - Sticky */}
            <div 
              className="w-64 shrink-0 sticky"
              style={{ top: `${PROMOTION_HEADER_HEIGHT + 24}px` }}
            >
              <nav className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                {sidebarMenu}
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Account Information</h1>
                  <p className="text-gray-500 mt-1">Manage your personal information</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={handleEditClick}
                    className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Information
                  </button>
                )}
              </div>

              {/* Account Info Form */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">
                    {isEditing ? "Edit Account Information" : "Personal Details"}
                  </h2>
                </div>

                {/* Form Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => handleFormChange("firstName", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-lg text-gray-900">
                          {accountInfo.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => handleFormChange("lastName", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-lg text-gray-900">
                          {accountInfo.lastName}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleFormChange("email", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-lg text-gray-900">
                          {accountInfo.email}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          value={editForm.gender}
                          onChange={(e) => handleFormChange("gender", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        >
                          {GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-lg text-gray-900">
                          {GENDER_OPTIONS.find(g => g.value === accountInfo.gender)?.label || "Select"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit Mode Buttons */}
                  {isEditing && (
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password Section */}
              <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">Security</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Password</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Change your password to keep your account secure
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Change Password Modal */}
      {showPasswordModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setShowPasswordModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-[101]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

AccountInfoPage.displayName = "AccountInfoPage";
