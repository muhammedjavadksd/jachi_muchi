import { jsPDF } from "jspdf";
import { CURRENCY_SYMBOL, SUPPORT_PHONE } from "@/shared/constants";

const BRAND_NAME = "Jachi Muchi";
const BRAND_LOGO = "/logo.png";
const SUPPORT_EMAIL = "support@jachimuchi.com";
const BUSINESS_ADDRESS = "Plot No. XX, Industrial Area, Phase II, New Delhi - 110020";

interface InvoiceItem {
  name?: string;
  quantity?: number;
  price?: number;
}

export interface InvoiceData {
  orderId: string;
  date?: string;
  items?: InvoiceItem[];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  totalAmount?: number;
  paymentMethod?: string;
}

const M = {
  left: 15,
  right: 195,
  width: 180,
  colQty: 122,
  colPrice: 145,
  colTotal: 172,
  summaryLabel: 130,
  summaryValue: 195,
} as const;

function rs(n: number): string {
  return `${CURRENCY_SYMBOL}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function hLine(doc: jsPDF, y: number, color: [number, number, number], width = 0.2) {
  doc.setDrawColor(...color);
  doc.setLineWidth(width);
  doc.line(M.left, y, M.right, y);
}

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(title.toUpperCase(), M.left, y);
  return y + 5;
}

function labelValue(doc: jsPDF, label: string, value: string, y: number, opts?: { bold?: boolean; color?: [number, number, number] }) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(label, M.left, y);
  doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
  doc.setFontSize(9);
  doc.setTextColor(opts?.color ? opts.color[0] : 40, opts?.color ? opts.color[1] : 40, opts?.color ? opts.color[2] : 40);
  doc.text(value, M.left + 30, y);
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawRowStripe(doc: jsPDF, y: number, rowHeight: number, index: number) {
  if (index % 2 === 0) return;
  doc.setFillColor(245, 247, 250);
  doc.rect(M.left, y - 3.5, M.width, rowHeight, "F");
}

export async function generateInvoicePdf(data: InvoiceData): Promise<void> {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageH = doc.internal.pageSize.height;
  const pageW = doc.internal.pageSize.width;

  const orderId = data.orderId || "N/A";
  const orderDate = data.date
    ? new Date(data.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  const items = data.items || [];
  const subtotal = data.subtotal ?? items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const shipping = data.shipping ?? 0;
  const discount = data.discount ?? 0;
  const total = data.total ?? data.totalAmount ?? subtotal - discount + shipping;
  const paymentMethod = data.paymentMethod || "N/A";

  let y = 14;

  // ── HEADER: logo + brand name ──────────────────────────────
  const logoData = await loadImageAsBase64(BRAND_LOGO);
  if (logoData) {
    doc.addImage(logoData, "PNG", M.left, y, 14, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(20, 20, 20);
    doc.text(BRAND_NAME, M.left + 18, y + 8.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(SUPPORT_EMAIL, M.left + 18, y + 13);
    doc.text(SUPPORT_PHONE, M.left + 18, y + 16.5);
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(20, 20, 20);
    doc.text(BRAND_NAME, M.left, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(`${SUPPORT_EMAIL}  |  ${SUPPORT_PHONE}`, M.left, y + 13);
  }
  y += logoData ? 24 : 19;

  // Company address line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(BUSINESS_ADDRESS, M.left, y);
  y += 5;

  hLine(doc, y, [220, 220, 220], 0.4);
  y += 6;

  // ── INVOICE TITLE + META ───────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("INVOICE", M.left, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(`Invoice #${orderId}`, M.right, y, { align: "right" });
  y += 6;

  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(`Date: ${orderDate}`, M.left, y);
  doc.text(`Payment: ${paymentMethod}`, M.right, y, { align: "right" });
  y += 7;

  hLine(doc, y, [235, 235, 235]);
  y += 5;

  // ── BILL TO ────────────────────────────────────────────────
  y = sectionTitle(doc, "Bill To", y);

  const hasCustomer = data.customerName || data.customerPhone || data.customerEmail;
  if (hasCustomer) {
    if (data.customerName) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(data.customerName, M.left, y);
      y += 4;
    }
    const contactParts = [data.customerPhone, data.customerEmail].filter(Boolean);
    if (contactParts.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(90, 90, 90);
      doc.text(contactParts.join("  |  "), M.left, y);
      y += 4;
    }
  }

  if (data.shippingAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    const addrLines = doc.splitTextToSize(data.shippingAddress, M.width - 5);
    doc.text(addrLines, M.left, y);
    y += addrLines.length * 3.5 + 1;
  }

  y += 2;
  hLine(doc, y, [235, 235, 235]);
  y += 5;

  // ── ITEMS TABLE ────────────────────────────────────────────
  y = sectionTitle(doc, "Items", y);
  y += 1;

  // Table header background
  doc.setFillColor(240, 242, 245);
  doc.rect(M.left, y - 3.5, M.width, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Item", M.left + 1, y);
  doc.text("Qty", M.colQty + 3, y);
  doc.text("Price", M.colPrice + 4, y);
  doc.text("Total", M.right - 1, y, { align: "right" });
  y += 4;

  hLine(doc, y, [210, 210, 210]);
  y += 3;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const name = item.name || "Item";
    const qty = item.quantity || 1;
    const price = item.price || 0;
    const lineTotal = qty * price;

    const nameLines = doc.splitTextToSize(name, M.colQty - M.left - 4);
    const rowH = Math.max(nameLines.length * 3.8, 5.5);

    drawRowStripe(doc, y, rowH, idx);

    doc.setTextColor(40, 40, 40);
    doc.text(nameLines, M.left + 1, y);

    doc.setTextColor(70, 70, 70);
    doc.text(String(qty), M.colQty + 5, y);

    doc.text(rs(price), M.colPrice + 4, y);
    doc.text(rs(lineTotal), M.right - 1, y, { align: "right" });

    y += rowH + 1;

    if (y > pageH - 45) {
      doc.addPage();
      y = 20;
    }
  }

  hLine(doc, y, [210, 210, 210]);
  y += 6;

  // ── SUMMARY ────────────────────────────────────────────────
  const sumX = M.summaryLabel;
  const valX = M.right - 1;

  function summaryRow(label: string, value: string, opts?: { bold?: boolean; color?: [number, number, number]; bg?: boolean }) {
    if (opts?.bg) {
      doc.setFillColor(240, 255, 240);
      doc.rect(sumX - 2, y - 3.5, M.right - sumX + 3, 6.5, "F");
    }
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(label, sumX, y);
    const c = opts?.color || [40, 40, 40];
    doc.setTextColor(c[0], c[1], c[2]);
    doc.text(value, valX, y, { align: "right" });
    y += 5.5;
  }

  summaryRow("Subtotal", rs(subtotal));

  if (discount > 0) {
    summaryRow("Discount", `- ${rs(discount)}`, { color: [22, 120, 50] });
  }
  if (shipping > 0) {
    summaryRow("Shipping", rs(shipping));
  }
  if (discount > 0 || shipping > 0) {
    y += 0.5;
    hLine(doc, y, [200, 200, 200]);
    y += 4;
  }

  summaryRow("Total", rs(total), { bold: true, color: [20, 20, 20], bg: true });

  y += 5;

  // ── TERMS & CONDITIONS ─────────────────────────────────────
  hLine(doc, y, [235, 235, 235]);
  y += 5;
  y = sectionTitle(doc, "Terms & Conditions", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);

  const terms = [
    "1. Returns accepted within 14 days of delivery for unused, unopened items in original packaging.",
    "2. Refunds are processed to the original payment method within 5-7 business days after inspection.",
    "3. Damaged or defective items must be reported within 48 hours of delivery with photographic evidence.",
    "4. This invoice is computer-generated and does not require a physical signature.",
  ];
  for (const t of terms) {
    const tLines = doc.splitTextToSize(t, M.width - 2);
    doc.text(tLines, M.left, y);
    y += tLines.length * 3.2 + 0.8;
  }

  // ── FOOTER ─────────────────────────────────────────────────
  const footerY = pageH - 12;

  hLine(doc, footerY - 4, [230, 230, 230]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text("Thank you for shopping with Jachi Muchi!", pageW / 2, footerY, { align: "center" });

  const timestamp = new Date().toLocaleString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(170, 170, 170);
  doc.text(`Generated on ${timestamp}`, pageW / 2, footerY + 4, { align: "center" });

  doc.save(`invoice-${orderId}.pdf`);
}
