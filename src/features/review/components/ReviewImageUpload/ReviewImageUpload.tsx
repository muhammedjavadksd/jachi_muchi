import { memo, useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadReviewImages } from "@/features/review/api/reviewApi";
import { getImageUrl } from "@/shared/utils/image";
import {
  ADD_PHOTOS_LABEL,
  REVIEW_MAX_IMAGES,
  REVIEW_MAX_IMAGE_SIZE_MB,
  UPLOADING_IMAGES_MESSAGE,
} from "@/features/review/constants";
import {
  validateReviewImageFile,
  validateReviewImageCount,
} from "@/features/review/validations";

interface ReviewImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
}

export const ReviewImageUpload = memo(function ReviewImageUpload({
  images,
  onChange,
  onBusyChange,
}: ReviewImageUploadProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState("");

  const isBusy = uploadingCount > 0;
  const canAddMore = images.length < REVIEW_MAX_IMAGES;

  const setBusy = useCallback(
    (count: number) => {
      setUploadingCount(count);
      onBusyChange?.(count > 0);
    },
    [onBusyChange]
  );

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (!files.length || isBusy) return;

      setError("");

      const validFiles: File[] = [];
      for (const file of files) {
        const fileError = validateReviewImageFile(file);
        if (fileError) {
          setError(fileError);
          return;
        }
        validFiles.push(file);
      }

      const countError = validateReviewImageCount(images.length, validFiles.length);
      if (countError) {
        setError(countError);
        return;
      }

      setBusy(validFiles.length);
      try {
        const uploadedUrls = await uploadReviewImages(validFiles);
        onChange([...images, ...uploadedUrls].slice(0, REVIEW_MAX_IMAGES));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload images");
      } finally {
        setBusy(0);
      }
    },
    [images, isBusy, onChange, setBusy]
  );

  const handleRemove = useCallback(
    (index: number) => {
      setError("");
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        void handleFiles(e.target.files);
      }
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        void handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{ADD_PHOTOS_LABEL}</p>
        <span className="text-xs text-gray-400">
          JPG, PNG, WebP · up to {REVIEW_MAX_IMAGE_SIZE_MB}MB · max{" "}
          {REVIEW_MAX_IMAGES}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group"
          >
            <img
              src={getImageUrl(image)}
              alt={`Review photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label={`Remove photo ${index + 1}`}
              disabled={isBusy}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            disabled={isBusy}
            aria-label="Add photos"
            className={`w-16 h-16 rounded-lg border border-dashed flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
              isDragging
                ? "border-teal-600 bg-teal-50"
                : "border-gray-300 hover:border-teal-500 hover:bg-gray-50"
            }`}
          >
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                <span className="text-[9px] font-medium text-teal-700 leading-none">
                  {UPLOADING_IMAGES_MESSAGE}
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 text-gray-400" />
                <span className="text-[9px] font-medium text-gray-400 leading-none">
                  Add
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {isBusy && (
        <p className="text-xs text-teal-700 mt-2 inline-flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          {UPLOADING_IMAGES_MESSAGE}
        </p>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
});

ReviewImageUpload.displayName = "ReviewImageUpload";
