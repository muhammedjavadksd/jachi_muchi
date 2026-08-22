import { memo, useState, useCallback, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks";
import type { UserProfile } from "@/features/auth/types";

const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

const PasswordField = memo(function PasswordField({
  label,
  value,
  onChange,
  isVisible,
  onToggle,
}: PasswordFieldProps): JSX.Element {
  const EyeIcon = isVisible ? Eye : EyeOff;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <EyeIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

PasswordField.displayName = "AccountInfoPage.PasswordField";

export const AccountInfoPage = memo(function AccountInfoPage(): JSX.Element {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordVisibility, setPasswordVisibility] = useState({ current: false, newPassword: false, confirmPassword: false });
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        if (res.success && res.data) setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

  const handleTogglePasswordVisibility = useCallback((field: keyof typeof passwordVisibility) => {
    setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleOpenPasswordModal = useCallback(() => {
    setShowPasswordModal(true);
    setPasswordVisibility({ current: false, newPassword: false, confirmPassword: false });
  }, []);

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
  const genderLabel = gender ? GENDER_OPTIONS.find(g => g.value === gender)?.label || "Not specified" : "Not specified";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0) || ""}`.toUpperCase();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">

        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-base truncate">{firstName} {lastName}</p>
              <p className="text-sm text-gray-500 truncate">{email}</p>
              {mobile && <p className="text-sm text-gray-500">{mobile}</p>}
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Personal Information</h2>
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="p-5">
            {isEditing ? (
              /* Edit Mode — replaces view, no duplicate */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName || ""}
                    onChange={e => handleFormChange("firstName", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName || ""}
                    onChange={e => handleFormChange("lastName", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                  <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed truncate">{email}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Mobile</label>
                  <input
                    type="tel"
                    value={editForm.mobile || ""}
                    onChange={e => handleFormChange("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Gender</label>
                  <select
                    value={editForm.gender || ""}
                    onChange={e => handleFormChange("gender", e.target.value)}
                    className="w-full sm:w-1/2 px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {GENDER_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-0.5">First Name</p>
                  <p className="text-sm text-gray-900">{firstName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-0.5">Last Name</p>
                  <p className="text-sm text-gray-900">{lastName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-0.5">Email</p>
                  <p className="text-sm text-gray-900 break-all">{email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-0.5">Mobile</p>
                  <p className="text-sm text-gray-900">{mobile || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-0.5">Gender</p>
                  <p className="text-sm text-gray-900">{genderLabel}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Security</h2>
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Password</p>
              <p className="text-xs text-gray-400 mt-0.5">••••••••••</p>
            </div>
            <button
              onClick={handleOpenPasswordModal}
              className="shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

      </div>

      {/* Password Modal — unchanged */}
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
                <PasswordField
                  label="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={value => handlePasswordChange("currentPassword", value)}
                  isVisible={passwordVisibility.current}
                  onToggle={() => handleTogglePasswordVisibility("current")}
                />
                <PasswordField
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={value => handlePasswordChange("newPassword", value)}
                  isVisible={passwordVisibility.newPassword}
                  onToggle={() => handleTogglePasswordVisibility("newPassword")}
                />
                <PasswordField
                  label="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={value => handlePasswordChange("confirmPassword", value)}
                  isVisible={passwordVisibility.confirmPassword}
                  onToggle={() => handleTogglePasswordVisibility("confirmPassword")}
                />
              </div>
              <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-medium">Cancel</button>
                <button onClick={handlePasswordSubmit} disabled={passwordLoading} className={`flex-1 py-3.5 rounded-2xl font-medium transition-colors ${passwordLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

AccountInfoPage.displayName = "AccountInfoPage";
