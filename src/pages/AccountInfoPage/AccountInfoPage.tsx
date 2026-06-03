import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../types";

/** Gender options */
const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const AccountInfoPage = memo(function AccountInfoPage(): JSX.Element {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEditClick = useCallback(() => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        mobile: profile.mobile || "",
        gender: profile.gender || "",
      });
    }
    setIsEditing(true);
  }, [profile]);

  const handleCancelEdit = useCallback(() => {
    setEditForm({});
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const res = await authApi.updateProfile(editForm);
      if (res.success && res.data) {
        setProfile(res.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }, [editForm]);

  const handleFormChange = useCallback((field: keyof Partial<UserProfile>, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePasswordChange = useCallback((field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordSubmit = useCallback(async () => {
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await authApi.changePassword(passwordForm);
      if (res.success) {
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordError(res.message || "Failed to change password");
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  }, [passwordForm]);

  const firstName = profile?.firstName || authUser?.name?.split(" ")[0] || "User";
  const lastName = profile?.lastName || authUser?.name?.split(" ").slice(1).join(" ") || "";
  const email = profile?.email || authUser?.email || "user@example.com";
  const mobile = profile?.mobile || "";
  const gender = profile?.gender || "";

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Information</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>
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

                {loading ? (
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="p-6 space-y-5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                          <div className="h-12 bg-gray-100 rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
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
                        {firstName}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900">
                        {lastName}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Email Address</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 break-all">
                        {email}
                      </div>
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Mobile</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900">
                        {mobile || "Not provided"}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
                      <div className="px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900">
                        {gender ? GENDER_OPTIONS.find(g => g.value === gender)?.label || "Not specified" : "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                  <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-900">Edit Personal Details</h2>
                    </div>
                    <div className="p-5 md:p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={editForm.firstName || ""}
                          onChange={(e) => handleFormChange("firstName", e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          value={editForm.lastName || ""}
                          onChange={(e) => handleFormChange("lastName", e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Mobile</label>
                        <input
                          type="tel"
                          value={editForm.mobile || ""}
                          onChange={(e) => handleFormChange("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
                        <select
                          value={editForm.gender || ""}
                          onChange={(e) => handleFormChange("gender", e.target.value)}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          {GENDER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-medium rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-1 py-3.5 bg-teal-600 text-white font-medium rounded-2xl hover:bg-teal-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                  </>
                )}

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
                {passwordError && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{passwordError}</p>
                )}
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
                <button onClick={handlePasswordSubmit} disabled={passwordLoading} className={`flex-1 py-3.5 rounded-2xl font-medium transition-colors ${passwordLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}`}>{passwordLoading ? "Updating..." : "Update Password"}</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

AccountInfoPage.displayName = "AccountInfoPage";