import { memo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PromotionHeader, Footer, WhatsAppButton, Container } from "../../components";
import { HEADER_SPACER_HEIGHT, PREFERRED_FRAME_TYPES } from "../../lib/constants";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  preferredDate: string;
  preferredTime: string;
  preferredFrameType: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

interface SubmittedData {
  preferredDate: string;
  preferredTime: string;
}

const initialForm = (userName: string, userPhone: string, userEmail: string): FormData => ({
  fullName: userName,
  phone: userPhone,
  email: userEmail,
  address: "",
  city: "",
  state: "",
  pincode: "",
  preferredDate: "",
  preferredTime: "",
  preferredFrameType: "",
  notes: "",
});

const LETTERS_SPACES = /^[A-Za-z\s]+$/;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const DIGITS_ONLY = /^\d+$/;

const getTodayStr = () => new Date().toISOString().split("T")[0];
const getNowTimeStr = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

export const HomeTryOnBookingPage = memo(function HomeTryOnBookingPage(): JSX.Element {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const todayDate = getTodayStr();
  const nowTime = getNowTimeStr();

  const [form, setForm] = useState<FormData>(initialForm("", "", ""));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.name || "";
      setForm(initialForm(fullName, "", user.email));
    }
  }, [user]);

  const setField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = "Enter a valid full name";
    else if (form.fullName.trim().length < 3) errs.fullName = "Enter a valid full name";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!INDIAN_MOBILE.test(form.phone.trim())) errs.phone = "Enter a valid 10-digit mobile number";
    if (!form.address.trim()) errs.address = "Address is required";
    else if (form.address.trim().length < 10) errs.address = "Please enter a complete address";
    if (!form.city.trim()) errs.city = "City is required";
    else if (form.city.trim().length < 2) errs.city = "Enter a valid city";
    else if (!LETTERS_SPACES.test(form.city.trim())) errs.city = "City must contain only letters";
    if (!form.state.trim()) errs.state = "State is required";
    else if (form.state.trim().length < 2) errs.state = "Enter a valid state";
    else if (!LETTERS_SPACES.test(form.state.trim())) errs.state = "State must contain only letters";
    if (!form.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(form.pincode.trim())) errs.pincode = "Enter a valid 6-digit pincode";
    if (!form.preferredDate) errs.preferredDate = "Preferred date is required";
    else if (form.preferredDate < todayDate) errs.preferredDate = "Please select a future date";
    if (!form.preferredTime) errs.preferredTime = "Preferred time is required";
    else if (form.preferredDate === todayDate && form.preferredTime <= nowTime) errs.preferredTime = "Please select a future time";
    if (form.notes.trim().length > 300) errs.notes = "Notes must be under 300 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstErrorField = Object.keys(errs)[0] as keyof FormErrors;
      const el = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, string | undefined> = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        preferredFrameType: form.preferredFrameType || undefined,
        notes: form.notes.trim() || undefined,
      };
      await api.post("/home-try-on", payload);
      setSubmittedData({
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
      });
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PromotionHeader />
        <div style={{ height: `${HEADER_SPACER_HEIGHT}px` }} />
        <main className="flex-1 flex items-center justify-center">
          <Container>
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Request Submitted</h1>
              <p className="text-gray-600 mb-2">Your home try-on appointment has been booked successfully.</p>
              <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Preferred Date:</span> {submittedData?.preferredDate}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Preferred Time:</span> {submittedData?.preferredTime}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-8">Our team will contact you shortly to confirm your appointment.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/account/home-try-on-appointments"
                  className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
                >
                  View My Appointments
                </Link>
                <Link
                  to="/home-try-on"
                  className="px-8 py-3 border border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold rounded-xl transition-colors"
                >
                  Back to Home Try-On
                </Link>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const inputClass = "w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900";
  const errorClass = (field: keyof FormErrors) => errors[field] ? "border-red-400 focus:ring-red-400" : "";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PromotionHeader />
      <div style={{ height: `${HEADER_SPACER_HEIGHT}px` }} />

      <main className="flex-1">
        <Container>
          <div className="max-w-2xl mx-auto py-8">
            <Link to="/home-try-on" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Book a Home Try-On</h1>
            <p className="text-gray-600 mb-8">Fill in your details and we'll schedule a frame trial at your home.</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">
                Booking as <span className="font-semibold text-gray-900">{form.fullName}</span>
                {form.email && <span> &middot; {form.email}</span>}
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={form.phone} onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className={`${inputClass} ${errors.phone ? "border-red-400 focus:ring-red-400" : ""}`} placeholder="9876543210" maxLength={10} inputMode="numeric" />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode <span className="text-red-500">*</span></label>
                  <input type="text" name="pincode" value={form.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} className={`${inputClass} ${errorClass("pincode")}`} placeholder="110001" maxLength={6} inputMode="numeric" />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Frame Type</label>
                  <select
                    name="preferredFrameType"
                    value={form.preferredFrameType}
                    onChange={(e) => setField("preferredFrameType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select frame type</option>
                    {PREFERRED_FRAME_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                <textarea name="address" value={form.address} onChange={(e) => setField("address", e.target.value)} className={`${inputClass} resize-none ${errorClass("address")}`} rows={3} placeholder="Street, building, area..." />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" value={form.city} onChange={(e) => setField("city", e.target.value)} className={`${inputClass} ${errorClass("city")}`} placeholder="Mumbai" />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State <span className="text-red-500">*</span></label>
                  <input type="text" name="state" value={form.state} onChange={(e) => setField("state", e.target.value)} className={`${inputClass} ${errorClass("state")}`} placeholder="Maharashtra" />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date <span className="text-red-500">*</span></label>
                  <input type="date" name="preferredDate" value={form.preferredDate} onChange={(e) => setField("preferredDate", e.target.value)} min={todayDate} className={`${inputClass} ${errorClass("preferredDate")}`} />
                  {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time <span className="text-red-500">*</span></label>
                  <input type="time" name="preferredTime" value={form.preferredTime} onChange={(e) => setField("preferredTime", e.target.value)} className={`${inputClass} ${errorClass("preferredTime")}`} />
                  {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes {form.notes.length > 0 && <span className="text-gray-400 font-normal">({form.notes.length}/300)</span>}</label>
                <textarea name="notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} className={`${inputClass} resize-none ${errors.notes ? "border-red-400 focus:ring-red-400" : ""}`} rows={2} placeholder="Any special requests..." maxLength={300} />
                {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{submitError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Appointment Request"}
              </button>
            </form>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

HomeTryOnBookingPage.displayName = "HomeTryOnBookingPage";
