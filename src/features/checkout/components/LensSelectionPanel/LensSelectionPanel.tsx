import { memo, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getLenses } from "@/features/lens/api/lensApi";
import type { LensItem } from "@/features/lens/types";
import { getOffers } from "@/shared/services/offerEngine";
import { Price } from "@/shared/components";
import { getImageUrl } from "@/shared/utils/image";
import type { Offer } from "@/features/offer/types";
import { useCart } from "@/features/cart/hooks";
import { useAuthGuard } from "@/shared/hooks";
import { uploadPrescription } from "@/features/checkout/api/prescriptionApi";
import type { PowerMethod } from "@/features/checkout/types";
import { validatePrescriptionFile } from "@/features/checkout/validations";
import {
  LENS_POWER_HELP_PHONE_DISPLAY,
  LENS_POWER_HELP_PHONE_TEL,
} from "@/shared/constants";
import {
  PRESCRIPTION_UPLOAD_ERROR,
  PRESCRIPTION_UPLOAD_HINT,
  PRESCRIPTION_UPLOADING_MESSAGE,
} from "@/features/checkout/constants";


type PowerType = "with-power" | "zero-power" | "progressive" | "frame-only";

interface CountryEntry {
  name: string;
  code: string;
  flag: string;
  digits: number | [number, number];
}

const COUNTRIES: CountryEntry[] = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫", digits: 9 },
  { name: "Albania", code: "+355", flag: "🇦🇱", digits: 9 },
  { name: "Algeria", code: "+213", flag: "🇩🇿", digits: 9 },
  { name: "Argentina", code: "+54", flag: "🇦🇷", digits: 10 },
  { name: "Australia", code: "+61", flag: "🇦🇺", digits: 9 },
  { name: "Austria", code: "+43", flag: "🇦🇹", digits: [4, 13] },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", digits: 10 },
  { name: "Belgium", code: "+32", flag: "🇧🇪", digits: 9 },
  { name: "Brazil", code: "+55", flag: "🇧🇷", digits: 11 },
  { name: "Canada", code: "+1", flag: "🇨🇦", digits: 10 },
  { name: "China", code: "+86", flag: "🇨🇳", digits: 11 },
  { name: "Egypt", code: "+20", flag: "🇪🇬", digits: 10 },
  { name: "France", code: "+33", flag: "🇫🇷", digits: 9 },
  { name: "Germany", code: "+49", flag: "🇩🇪", digits: [10, 11] },
  { name: "India", code: "+91", flag: "🇮🇳", digits: 10 },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", digits: [9, 12] },
  { name: "Italy", code: "+39", flag: "🇮🇹", digits: [9, 10] },
  { name: "Japan", code: "+81", flag: "🇯🇵", digits: 10 },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", digits: [9, 10] },
  { name: "Mexico", code: "+52", flag: "🇲🇽", digits: 10 },
  { name: "Nepal", code: "+977", flag: "🇳🇵", digits: 10 },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", digits: 9 },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", digits: 10 },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", digits: 10 },
  { name: "Philippines", code: "+63", flag: "🇵🇭", digits: 10 },
  { name: "Qatar", code: "+974", flag: "🇶🇦", digits: 8 },
  { name: "Russia", code: "+7", flag: "🇷🇺", digits: 10 },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", digits: 9 },
  { name: "Singapore", code: "+65", flag: "🇸🇬", digits: 8 },
  { name: "South Africa", code: "+27", flag: "🇿🇦", digits: 9 },
  { name: "South Korea", code: "+82", flag: "🇰🇷", digits: [9, 10] },
  { name: "Spain", code: "+34", flag: "🇪🇸", digits: 9 },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰", digits: 9 },
  { name: "Thailand", code: "+66", flag: "🇹🇭", digits: 9 },
  { name: "Turkey", code: "+90", flag: "🇹🇷", digits: 10 },
  { name: "UAE", code: "+971", flag: "🇦🇪", digits: 9 },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", digits: 10 },
  { name: "United States", code: "+1", flag: "🇺🇸", digits: 10 },
  { name: "Vietnam", code: "+84", flag: "🇻🇳", digits: 9 },
];

function getPhoneError(phone: string, country: CountryEntry | null): string {
  if (!phone) return "";
  if (!country) return "Please select a country code.";
  const { digits, name } = country;
  if (typeof digits === "number") {
    if (phone.length !== digits)
      return `${name} numbers are ${digits} digits. You entered ${phone.length}.`;
  } else {
    const [min, max] = digits;
    if (phone.length < min || phone.length > max)
      return `${name} numbers are ${min}–${max} digits. You entered ${phone.length}.`;
  }
  return "";
}

const LENS_TYPE_MAP: Record<PowerType, string> = {
  "with-power": "with_power",
  "zero-power": "zero_power",
  "progressive": "progressive",
  "frame-only": "frame_only",
};

// Step 3 "Add Power" icons — inline SVGs in the same style as the rest of the panel.
const ICON_PENCIL = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7.5 18.5 3 20l1.5-4.5L16.5 3.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 5.5l4 4" />
  </svg>
);

const ICON_UPLOAD = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

const ICON_FILE = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
  </svg>
);

const ICON_SPINNER = (
  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

interface LensSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productPrice: number;
  productMrp: number;
  productImage?: string;
  selectedColor?: { name: string; id: string };
}

export const LensSelectionPanel = memo(function LensSelectionPanel({
  isOpen,
  onClose,
  productId,
  productName,
  productPrice,
  productImage,
  selectedColor,
}: LensSelectionPanelProps): JSX.Element | null {
  const navigate = useNavigate();
  const { requireAuth } = useAuthGuard();
const { addToCart } = useCart();
const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPowerType, setSelectedPowerType] = useState<PowerType | null>(null);
  const [selectedLens, setSelectedLens] = useState<LensItem | null>(null);
  const [lenses, setLenses] = useState<LensItem[]>([]);
  const [lensLoading, setLensLoading] = useState(false);
  const [bogoOffer, setBogoOffer] = useState<Offer | null>(null);
  const [samePowerBothEyes, setSamePowerBothEyes] = useState(false);
  const [hasCylindrical, setHasCylindrical] = useState(false);
  const [powerDetails, setPowerDetails] = useState({
    leftSph: "",
    rightSph: "",
    leftCyl: "",
    rightCyl: "",
    leftAxis: "",
    rightAxis: "",
    name: "",
    phone: "",
    knowPowerLater: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryEntry | null>(
    COUNTRIES.find((c) => c.code === "+91") ?? null
  );
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // --- Step 3 "Add Power" state -------------------------------------------
  // powerMethod persists across back/forward navigation inside the drawer, so
  // the option the customer picked is still highlighted when they return.
  const [powerMethod, setPowerMethod] = useState<PowerMethod | null>(null);
  // Sub-view within step 3: the option cards, the existing manual form, or
  // the prescription upload form.
  const [step3View, setStep3View] = useState<"options" | "manual" | "upload">("options");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const prescriptionInputRef = useRef<HTMLInputElement>(null);

  // Local preview while/after uploading; revoked when the file is replaced.
  const filePreviewUrl = useMemo(
    () =>
      prescriptionFile && prescriptionFile.type.startsWith("image/")
        ? URL.createObjectURL(prescriptionFile)
        : null,
    [prescriptionFile]
  );

  useEffect(() => {
    if (!filePreviewUrl) return;
    return () => URL.revokeObjectURL(filePreviewUrl);
  }, [filePreviewUrl]);

  useEffect(() => {
    if (!showCountryDropdown) return;
    const handler = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCountryDropdown]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  useEffect(() => {
    if (!isOpen) return;
    getOffers().then((allOffers) => {
      const bogo = allOffers.find(
        (o) => o.offerType === "bogo" && o.applicableProducts?.some((p) => typeof p === "object" && p._id === productId)
      );
      setBogoOffer(bogo || null);
    }).catch(() => {});
  }, [isOpen, productId]);

  useEffect(() => {
    if (!selectedPowerType || selectedPowerType === "frame-only") return;

    const fetchLenses = async () => {
      try {
        setLensLoading(true);
        const apiType = LENS_TYPE_MAP[selectedPowerType];
        const result = await getLenses(apiType);
        setLenses(result);
      } catch (error) {
        console.error("Failed to fetch lenses:", error);
        setLenses([]);
      } finally {
        setLensLoading(false);
      }
    };

    fetchLenses();
  }, [selectedPowerType]);

  const handlePowerTypeSelect = useCallback((type: PowerType) => {
    setSelectedPowerType(type);
    if (type === "frame-only") {
      setStep(4);
    } else {
      setStep(2);
    }
  }, []);

  const handleLensSelect = useCallback((lens: LensItem) => {
    setSelectedLens(lens);
    if (selectedPowerType === "zero-power") {
      setStep(4);
    } else {
      setStep(3);
    }
  }, [selectedPowerType]);

  const handleBack = useCallback(() => {
    if (step === 1) {
      onClose();
    } else if (step === 2) {
      setStep(1);
      setSelectedPowerType(null);
      setLenses([]);
    } else if (step === 3) {
      // Inside a step-3 sub-view (manual form / upload) the back arrow first
      // returns to the option cards; only from there does it leave the step.
      // powerMethod + typed values are kept so the choice persists on return.
      if (step3View !== "options") {
        setStep3View("options");
        return;
      }
      setStep(2);
      setStep3View("options");
    } else if (step === 4) {
      if (selectedPowerType === "frame-only") {
        setStep(1);
        setSelectedPowerType(null);
      } else if (selectedPowerType === "zero-power") {
        setStep(2);
      } else {
        setStep(3);
      }
    }
  }, [step, step3View, selectedPowerType, onClose]);

  /**
   * Step 3 validation, branched by the chosen power method:
   * - "upload" → name + phone only (the file is enforced by the disabled Save);
   * - "manual" → the existing rules: name, phone, and the SPH/CYL values.
   */
  const validatePrescription = useCallback((method: PowerMethod | null): boolean => {
    const errs: Record<string, string> = {};

    const name = powerDetails.name.trim();
    if (!name) errs.name = "Name is required.";
    else if (name.length < 2) errs.name = "Name must be at least 2 characters.";

    const phone = powerDetails.phone.trim();
    if (!phone) errs.phone = "Phone number is required.";
    else {
      const phoneErr = getPhoneError(phone, selectedCountry);
      if (phoneErr) errs.phone = phoneErr;
    }

    if (method !== "upload" && !powerDetails.knowPowerLater) {
      if (!powerDetails.leftSph) errs.leftSph = "Left SPH is required.";
      if (!samePowerBothEyes && !powerDetails.rightSph) errs.rightSph = "Right SPH is required.";
      if (hasCylindrical) {
        if (!powerDetails.leftCyl) errs.leftCyl = "Left CYL is required.";
        if (!samePowerBothEyes && !powerDetails.rightCyl) errs.rightCyl = "Right CYL is required.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [powerDetails, samePowerBothEyes, hasCylindrical, selectedCountry]);

  // BUG-012: this called addToCartApi directly and threw the response away, then
  // broadcast a "cart changed" event so the provider would guess the new state
  // with its own refetch. Routing through useCart means the badge is driven by the
  // cart the server just returned. The isAddingToCart guard closes the double
  // submit window that used to let one intent POST twice, and the try/catch keeps
  // a failed write from silently skipping the toast and the navigation.
  const handleAddToCart = useCallback(async (method?: PowerMethod) => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await requireAuth(async () => {
        // Callers pass the method they just confirmed ("manual"/"upload");
        // without an override the panel's persisted choice is used and manual
        // stays the fallback for anything saved before this step.
        const effectiveMethod: PowerMethod = method ?? powerMethod ?? "manual";
        if (selectedPowerType === "with-power" || selectedPowerType === "progressive") {
          if (!validatePrescription(effectiveMethod)) return;
        }
        const bogoGroupId = bogoOffer?.freeProduct ? Date.now().toString() + "-bogo" : undefined;

        const customerPhone = powerDetails.phone
          ? `${selectedCountry?.code ?? ""}${powerDetails.phone}`
          : "";

        const resolvedPowerDetails =
          selectedPowerType === "with-power" || selectedPowerType === "progressive"
            ? effectiveMethod === "upload"
              ? {
                  // Power lives in the uploaded document, not in the fields.
                  leftSPH: "",
                  rightSPH: "",
                  leftCYL: null,
                  rightCYL: null,
                  isSamePower: false,
                  hasCylindrical: false,
                  customerName: powerDetails.name,
                  customerPhone,
                  knowPowerLater: false,
                  powerMethod: "upload" as const,
                  prescriptionFile: prescriptionUrl ?? "",
                }
              : {
                  leftSPH: powerDetails.leftSph,
                  rightSPH: samePowerBothEyes ? powerDetails.leftSph : powerDetails.rightSph,
                  leftCYL: hasCylindrical ? powerDetails.leftCyl : null,
                  rightCYL: hasCylindrical
                    ? (samePowerBothEyes ? powerDetails.leftCyl : powerDetails.rightCyl)
                    : null,
                  isSamePower: samePowerBothEyes,
                  hasCylindrical,
                  customerName: powerDetails.name,
                  customerPhone,
                  knowPowerLater: powerDetails.knowPowerLater,
                  powerMethod: "manual" as const,
                }
            : null;

        await addToCart({
          productId,
          quantity: 1,
          color: selectedColor ?? null,
          lens: selectedLens
            ? { id: selectedLens._id ?? "", name: selectedLens.name, price: selectedLens.price }
            : null,
          powerType: selectedPowerType,
          powerDetails: resolvedPowerDetails,
          bogoGroupId: bogoGroupId ?? null,
          isFree: false,
        });

        if (bogoOffer?.freeProduct) {
          await addToCart({
            productId: bogoOffer.freeProduct._id,
            quantity: 1,
            color: null,
            lens: null,
            powerType: "frame-only",
            powerDetails: null,
            bogoGroupId: bogoGroupId ?? null,
            isFree: true,
          });
        }

        onClose();
        navigate("/cart");
      });
    } catch (error: any) {
      // The provider leaves its state on the last confirmed cart, so the badge
      // correctly stays where it was.
      console.error("Failed to add item to cart:", error);
      toast.error(
        error?.response?.data?.message || "Could not add this item to your cart. Please try again."
      );
    } finally {
      setIsAddingToCart(false);
    }
  }, [
    isAddingToCart,
    productId,
    selectedPowerType,
    selectedLens,
    powerDetails,
    powerMethod,
    prescriptionUrl,
    samePowerBothEyes,
    hasCylindrical,
    selectedColor,
    bogoOffer,
    navigate,
    onClose,
    requireAuth,
    addToCart,
    validatePrescription,
    selectedCountry,
  ]);

  // --- Step 3 "Add Power" handlers ----------------------------------------

  const openManualForm = useCallback(() => {
    setPowerMethod("manual");
    setStep3View("manual");
  }, []);

  const openUploadForm = useCallback(() => {
    setPowerMethod("upload");
    setStep3View("upload");
  }, []);

  const backToStep3Options = useCallback(() => setStep3View("options"), []);

  /**
   * Validates the picked file (JPG/PNG/PDF ≤ 5MB) and uploads it right away,
   * so the sub-view can show its own loading spinner and error + retry state.
   */
  const handlePrescriptionFile = useCallback(async (file: File) => {
    const fileError = validatePrescriptionFile(file);
    if (fileError) {
      setUploadError(fileError);
      return;
    }
    setUploadError("");
    setPrescriptionFile(file);
    setPrescriptionUrl(null);
    setIsUploading(true);
    try {
      setPrescriptionUrl(await uploadPrescription(file));
    } catch (err) {
      setUploadError(
        err instanceof Error && err.message ? err.message : PRESCRIPTION_UPLOAD_ERROR
      );
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handlePrescriptionInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // Cleared so picking the same file again after Remove still fires.
      e.target.value = "";
      if (file) void handlePrescriptionFile(file);
    },
    [handlePrescriptionFile]
  );

  const removePrescription = useCallback(() => {
    setPrescriptionFile(null);
    setPrescriptionUrl(null);
    setUploadError("");
  }, []);

  const retryUpload = useCallback(() => {
    if (prescriptionFile) void handlePrescriptionFile(prescriptionFile);
  }, [prescriptionFile, handlePrescriptionFile]);

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handlePrescriptionFile(file);
    },
    [handlePrescriptionFile]
  );

  const handleSaveManual = useCallback(() => {
    void handleAddToCart("manual");
  }, [handleAddToCart]);

  const handleSaveUpload = useCallback(() => {
    void handleAddToCart("upload");
  }, [handleAddToCart]);

  const completedSteps = step - 1;

  const renderStep1 = () => (
    <div className="flex flex-col gap-4">
      <button onClick={() => handlePowerTypeSelect("with-power")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/Dual_Power.png" alt="With Power" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">With Power</p>
          <p className="text-sm text-gray-500">Positive, Negative or Cylindrical</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <button onClick={() => handlePowerTypeSelect("zero-power")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/ZeroPowerComputer.png" alt="Zero Power" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Zero Power</p>
          <p className="text-sm text-gray-500">BLU Screen lenses (Blue light protection)</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <button onClick={() => handlePowerTypeSelect("progressive")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/ProgressiveBifocal.png" alt="Progressive" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Progressive/Bifocals</p>
          <p className="text-sm text-gray-500">Two powers in one eye</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      <button onClick={() => handlePowerTypeSelect("frame-only")} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
        <img src="/category/FrameOnly.png" alt="Frame Only" className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Frame Only</p>
          <p className="text-sm text-gray-500">With no lenses</p>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );

  const renderStep2 = () => {
    if (lensLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading lenses...</p>
        </div>
      );
    }

    if (lenses.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No lenses available for this type
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {lenses.map((lens) => (
          <button key={lens._id || lens.id || lens.name} onClick={() => handleLensSelect(lens)} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all text-left group shadow-md hover:shadow-lg">
            <img src="/category/image.png" alt={lens.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">{lens.name}</p>
                {lens.badge && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{lens.badge}</span>}
              </div>
              {lens.features && <div className="flex flex-wrap gap-1 mb-2">{lens.features.slice(0, 3).map((f, i) => <span key={i} className="text-xs text-gray-500">{f}</span>)}</div>}
              <div className="flex items-center gap-2">
                {lens.originalPrice && <Price value={lens.originalPrice} size="sm" className="text-gray-400 line-through" />}
                <Price value={lens.price} size="md" />
                {lens.discount && <span className="text-xs text-green-600 font-medium">{lens.discount}% OFF</span>}
              </div>
              {lens.warranty && <p className="text-xs text-gray-400 mt-1">{lens.warranty} warranty</p>}
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 mt-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    );
  };

  /** Icon + title + subtext + chevron row used by the step-3 option cards. */
  const renderOptionCard = (
    icon: JSX.Element,
    title: string,
    subtext: string,
    selected: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left group shadow-md hover:shadow-lg ${
        selected
          ? "border-teal-600 bg-teal-50"
          : "border-gray-200 hover:border-teal-600 hover:bg-teal-50"
      }`}
    >
      <span
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          selected
            ? "bg-teal-600 text-white"
            : "bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-medium text-gray-900">{title}</span>
        <span className="block text-sm text-gray-500">{subtext}</span>
      </span>
      <svg
        className={`w-5 h-5 shrink-0 ${selected ? "text-teal-600" : "text-gray-400 group-hover:text-teal-600"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  /** Back arrow shown at the top of the manual / upload step-3 sub-views. */
  const renderSubViewBack = (label: string) => (
    <button
      type="button"
      onClick={backToStep3Options}
      className="flex items-center gap-1.5 self-start mb-4 -ml-1 p-1 rounded-lg text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );

  /**
   * Name + phone (with the country-code dropdown) — the same fields the
   * manual form has always had, shared by the manual and upload sub-views.
   */
  const renderContactFields = () => (
    <div className="mt-4">
      <input
        type="text"
        placeholder="Name (required)"
        value={powerDetails.name}
        onChange={(e) => setPowerDetails({ ...powerDetails, name: e.target.value })}
        className={`w-full p-3 border rounded-lg mb-1 ${errors.name ? "border-red-400" : "border-gray-200"}`}
      />
      {errors.name && <p className="text-red-500 text-xs mb-2">{errors.name}</p>}

      <p className="text-sm font-medium text-gray-700 mb-1 mt-2">Phone Number <span className="text-red-500">*</span></p>
      <div className="flex gap-2">
        <div className="relative shrink-0" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => { setShowCountryDropdown((p) => !p); setCountrySearch(""); }}
            className="h-full min-w-[90px] flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-3 text-sm text-gray-700 hover:border-teal-400 focus:outline-none transition-colors"
          >
            {selectedCountry ? (
              <>
                <span className="text-base leading-none">{selectedCountry.flag}</span>
                <span className="font-medium">{selectedCountry.code}</span>
              </>
            ) : (
              <span className="text-gray-400">Code</span>
            )}
            <svg className="w-3 h-3 text-gray-400 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCountryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-[200] overflow-hidden">
              <div className="p-2 border-b border-gray-100">
                <input
                  autoFocus
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search country or code…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
                />
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-gray-400">No results</li>
                ) : filteredCountries.map((c) => (
                  <li
                    key={`${c.code}-${c.name}`}
                    onClick={() => { setSelectedCountry(c); setShowCountryDropdown(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 transition-colors"
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="font-medium text-gray-800">{c.code}</span>
                    <span className="text-gray-500">{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Phone number"
          value={powerDetails.phone}
          onChange={(e) => setPowerDetails({ ...powerDetails, phone: e.target.value.replace(/\D/g, "") })}
          className={`flex-1 p-3 border rounded-lg ${errors.phone ? "border-red-400" : "border-gray-200"}`}
        />
      </div>
      {errors.phone && <p className="text-red-500 text-xs mt-1 mb-2">{errors.phone}</p>}
    </div>
  );

  /**
   * Step 3 "Add Power" — the two ways to supply power: the existing manual
   * form, or a prescription upload. Both open as a sub-view with a back arrow
   * to these cards. The picked method stays selected when the customer comes
   * back.
   */
  const renderStep3 = () => {
    if (step3View === "manual") return renderManualPowerForm();
    if (step3View === "upload") return renderUploadForm();

    return (
      <div className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          I know my power
        </p>
        <div className="flex flex-col gap-4">
          {renderOptionCard(
            ICON_PENCIL,
            "Enter Power Manually",
            "Input your latest eye prescription",
            powerMethod === "manual",
            openManualForm
          )}
          {renderOptionCard(
            ICON_UPLOAD,
            "Upload Prescription",
            "Just upload your power prescription",
            powerMethod === "upload",
            openUploadForm
          )}
        </div>
      </div>
    );
  };

  /** Existing manual power form, now reached as a step-3 sub-view. */
  const renderManualPowerForm = () => (
    <div className="flex flex-col">
      {renderSubViewBack("Add Power")}
      <label className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={samePowerBothEyes} onChange={(e) => { setSamePowerBothEyes(e.target.checked); setErrors({}); }} className="w-4 h-4 text-teal-600 rounded" />
        <span className="text-sm text-gray-700">I have same power for both eyes</span>
      </label>
      <label className="flex items-center gap-2 mb-4">
        <input type="checkbox" checked={hasCylindrical} onChange={(e) => { setHasCylindrical(e.target.checked); setErrors({}); }} className="w-4 h-4 text-teal-600 rounded" />
        <span className="text-sm text-gray-700">I have cylindrical power</span>
      </label>

      <div className="grid grid-cols-2 gap-4 mb-1">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">LEFT (OS) <span className="text-red-500">*</span></p>
          <select
            value={powerDetails.leftSph}
            onChange={(e) => setPowerDetails({ ...powerDetails, leftSph: e.target.value })}
            className={`w-full p-3 border rounded-lg ${errors.leftSph ? "border-red-400" : "border-gray-200"}`}
          >
            <option value="">Select SPH</option>
            {Array.from({ length: 41 }, (_, i) => (i - 20) * 0.25).map((v) => <option key={v} value={v}>{v <= 0 ? v : `+${v}`}</option>)}
          </select>
          {errors.leftSph && <p className="text-red-500 text-xs mt-1">{errors.leftSph}</p>}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            RIGHT (OD) {!samePowerBothEyes && <span className="text-red-500">*</span>}
          </p>
          <select
            value={samePowerBothEyes ? powerDetails.leftSph : powerDetails.rightSph}
            onChange={(e) => setPowerDetails({ ...powerDetails, rightSph: e.target.value })}
            disabled={samePowerBothEyes}
            className={`w-full p-3 border rounded-lg ${
              samePowerBothEyes ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100" :
              errors.rightSph ? "border-red-400" : "border-gray-200"
            }`}
          >
            <option value="">Select SPH</option>
            {Array.from({ length: 41 }, (_, i) => (i - 20) * 0.25).map((v) => <option key={v} value={v}>{v <= 0 ? v : `+${v}`}</option>)}
          </select>
          {samePowerBothEyes && <p className="text-xs text-teal-600 mt-1">Same as left eye</p>}
          {!samePowerBothEyes && errors.rightSph && <p className="text-red-500 text-xs mt-1">{errors.rightSph}</p>}
        </div>
      </div>

      {hasCylindrical && (
        <div className="grid grid-cols-2 gap-4 mb-1 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">LEFT CYL <span className="text-red-500">*</span></p>
            <select
              value={powerDetails.leftCyl}
              onChange={(e) => setPowerDetails({ ...powerDetails, leftCyl: e.target.value })}
              className={`w-full p-3 border rounded-lg ${errors.leftCyl ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select CYL</option>
              {Array.from({ length: 21 }, (_, i) => (i - 10) * 0.25).map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.leftCyl && <p className="text-red-500 text-xs mt-1">{errors.leftCyl}</p>}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              RIGHT CYL {!samePowerBothEyes && <span className="text-red-500">*</span>}
            </p>
            <select
              value={samePowerBothEyes ? powerDetails.leftCyl : powerDetails.rightCyl}
              onChange={(e) => setPowerDetails({ ...powerDetails, rightCyl: e.target.value })}
              disabled={samePowerBothEyes}
              className={`w-full p-3 border rounded-lg ${
                samePowerBothEyes ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100" :
                errors.rightCyl ? "border-red-400" : "border-gray-200"
              }`}
            >
              <option value="">Select CYL</option>
              {Array.from({ length: 21 }, (_, i) => (i - 10) * 0.25).map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {samePowerBothEyes && <p className="text-xs text-teal-600 mt-1">Same as left eye</p>}
            {!samePowerBothEyes && errors.rightCyl && <p className="text-red-500 text-xs mt-1">{errors.rightCyl}</p>}
          </div>
        </div>
      )}

      {renderContactFields()}

      <p className="text-sm text-gray-500 text-center mt-2">Can't find your power? Call <a href={LENS_POWER_HELP_PHONE_TEL} className="font-medium text-teal-600 no-underline hover:underline">{LENS_POWER_HELP_PHONE_DISPLAY}</a></p>
      <button
        onClick={handleSaveManual}
        disabled={isAddingToCart}
        aria-busy={isAddingToCart}
        className="w-full mt-4 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Save &amp; Proceed
      </button>
    </div>
  );

  /** Step-3 upload sub-view: file picker / drag-and-drop + name & phone. */
  const renderUploadForm = () => {
    const canSave =
      Boolean(prescriptionUrl) &&
      !isUploading &&
      powerDetails.name.trim().length > 0 &&
      powerDetails.phone.trim().length > 0;

    return (
      <div className="flex flex-col">
        {renderSubViewBack("Add Power")}

        {prescriptionFile ? (
          <div className="rounded-xl border border-gray-200 p-3 flex items-center gap-3">
            {filePreviewUrl ? (
              <img
                src={filePreviewUrl}
                alt="Prescription preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0"
              />
            ) : (
              <span className="w-16 h-16 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                {ICON_FILE}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{prescriptionFile.name}</p>
              <p className="text-xs text-gray-400">
                {(prescriptionFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {isUploading ? (
                <p className="text-xs text-teal-700 mt-1 inline-flex items-center gap-1.5">
                  {ICON_SPINNER}
                  {PRESCRIPTION_UPLOADING_MESSAGE}
                </p>
              ) : prescriptionUrl ? (
                <p className="text-xs text-green-600 mt-1">Uploaded</p>
              ) : null}
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => prescriptionInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 disabled:opacity-50"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={removePrescription}
                disabled={isUploading}
                className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => prescriptionInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") prescriptionInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
            }}
            onDrop={handleFileDrop}
            className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center text-center transition-colors ${
              isDraggingFile
                ? "border-teal-600 bg-teal-50"
                : "border-gray-300 hover:border-teal-500 hover:bg-gray-50"
            }`}
          >
            <span className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              {ICON_UPLOAD}
            </span>
            <p className="text-sm font-medium text-gray-900">Drag &amp; drop your prescription</p>
            <p className="text-sm text-gray-500 mt-0.5">or tap to browse</p>
            <p className="text-xs text-gray-400 mt-2">{PRESCRIPTION_UPLOAD_HINT}</p>
          </div>
        )}

        {uploadError && (
          <div className="flex items-start justify-between gap-3 mt-2">
            <p className="text-xs text-red-500">{uploadError}</p>
            {prescriptionFile && !prescriptionUrl && !isUploading && (
              <button
                type="button"
                onClick={retryUpload}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 shrink-0"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {renderContactFields()}

        <button
          onClick={handleSaveUpload}
          disabled={isAddingToCart || isUploading || !canSave}
          aria-busy={isAddingToCart || isUploading}
          className="w-full mt-4 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Save &amp; Proceed
        </button>

        <input
          ref={prescriptionInputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handlePrescriptionInputChange}
          className="hidden"
        />
      </div>
    );
  };

  const renderStep4 = () => {
    const lensPrice = selectedLens?.price || 0;
    const totalPrice = productPrice + lensPrice;
    return (
      <div className="flex flex-col">
        {bogoOffer && (
          <div className="mb-4 p-3 rounded-xl border border-purple-200 bg-purple-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              BOGO
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-900">Buy 1 Get 1 Free</p>
              <p className="text-xs text-purple-700">
                {bogoOffer.freeProduct?.name
                  ? `Get ${bogoOffer.freeProduct.name} FREE`
                  : "Free product added to cart"}
              </p>
            </div>
          </div>
        )}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center p-1">
              <img src={getImageUrl(productImage)} alt={productName} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }} />
            </div>
            <div className="min-w-0"><p className="font-medium text-gray-900 truncate">{productName}</p><Price value={productPrice} size="sm" className="text-gray-500" /></div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Lens Type</span><span className="text-gray-900 font-medium">{selectedPowerType === "with-power" ? "With Power" : selectedPowerType === "zero-power" ? "Zero Power" : selectedPowerType === "progressive" ? "Progressive" : "Frame Only"}</span></div>
            {selectedLens && <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Lens</span><span className="text-gray-900 font-medium">{selectedLens.name} (+<Price value={selectedLens.price} size="xs" />)</span></div>}
            <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-gray-200"><span>Total</span><Price value={totalPrice} size="md" /></div>
          </div>
        </div>
        <button
          onClick={() => handleAddToCart()}
          disabled={isAddingToCart}
          aria-busy={isAddingToCart}
          className="w-full py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Add to Cart - <Price value={totalPrice} size="md" className="text-white" />
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex items-center justify-between">
            {(["Power Type", "Lens", "Add Power"] as const).map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = completedSteps >= stepNum;
              const isZeroPowerSkip = selectedPowerType === "zero-power" && stepNum === 3;
              if (isZeroPowerSkip) return null;
              const isVisible = selectedPowerType !== "frame-only" || stepNum === 1;
              if (!isVisible) return null;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center ${idx > 0 ? "flex-1" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted ? "bg-teal-600 text-white" : isActive ? "bg-teal-100 text-teal-700 border-2 border-teal-600" : "bg-gray-100 text-gray-400"}`}>
                      {isCompleted ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : stepNum}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? "text-teal-700 font-medium" : isCompleted ? "text-teal-600" : "text-gray-400"}`}>{label}</span>
                  </div>
                  {idx < 2 && idx < (selectedPowerType !== "frame-only" ? 2 : 0) && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-teal-600" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {step === 1
              ? "Select Lens Type"
              : step === 2
              ? "Choose Lens Package"
              : step === 3
              ? step3View === "manual"
                ? "Enter Power Details"
                : step3View === "upload"
                ? "Upload Prescription"
                : "Add Power"
              : "Confirm Selection"}
          </h2>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </>
  );
});

LensSelectionPanel.displayName = "LensSelectionPanel";
