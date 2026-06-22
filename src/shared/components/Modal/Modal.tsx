import { memo, useEffect, type ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = memo(function Modal({ isOpen, onClose, title, children }: ModalProps): JSX.Element | null {
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; } }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {title && <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
});
