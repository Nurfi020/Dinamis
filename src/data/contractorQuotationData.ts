import { Quotation, RAB } from '../types';

export const QUOTATION_STORAGE_KEY = 'kelola_lead_sales_quotation_v1';

export const DEFAULT_COMPANY_INFO = {
  companyName: 'PT DINAMIS KONSTRUKSI NUSANTARA',
  companyAddress: 'Jl. H.R. Rasuna Said Kav. 62, Setiabudi, Jakarta Selatan 12920',
  companyPhone: '+62 21 5299-8800',
  companyEmail: 'commercial@dinamiskonstruksi.com',
};

export const DEFAULT_PAYMENT_TERMS =
  '1. Uang Muka (DP): 30% setelah Surat Perintah Kerja (SPK) ditandatangani.\n' +
  '2. Pembayaran Termijn I (Progress Lapangan 50%): 30%.\n' +
  '3. Pembayaran Termijn II (Progress Lapangan 80%): 25%.\n' +
  '4. Pelunasan & Serah Terima Fisik (Progress 100%): 10%.\n' +
  '5. Retensi Masa Pemeliharaan (30 Hari Kalender): 5%.';

export const DEFAULT_TERMS_AND_CONDITIONS =
  '1. Harga penawaran sudah termasuk pengadaan material, ongkos kerja teknis, alat bantu, dan supervisi K3.\n' +
  '2. Seluruh spesifikasi material mengacu pada standar mutu yang telah disepakati dalam dokumen RAB.\n' +
  '3. Pekerjaan tambah/kurang di luar lingkup penawaran akan dituangkan dalam Berita Acara Perubahan Pekerjaan terpisah.\n' +
  '4. Masa pemeliharaan dan garansi konstruksi berlaku selama 30 (tiga puluh) hari kalender terhitung sejak Serah Terima Pertama (PHO).\n' +
  '5. Penawaran harga ini mengikat dan sah sampai dengan tanggal batas masa berlaku dokumen ini.';

/**
 * Empty initial state by default as instructed (no fake pre-seeded quotation data).
 */
export const INITIAL_QUOTATIONS: Quotation[] = [];

/**
 * Calculates date string in YYYY-MM-DD format after adding N days.
 */
export function addDaysToDate(dateStr: string, days: number): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const today = new Date();
      today.setDate(today.getDate() + days);
      return today.toISOString().split('T')[0];
    }
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  }
}

/**
 * Generates an auto-incremented unique Quotation Number (SPH-YYYY-XXXX).
 */
export function generateNextQuotationNumber(existingQuotations: Quotation[]): string {
  const year = new Date().getFullYear();
  let maxSeq = 0;

  for (const q of existingQuotations) {
    if (q.quotationNumber && q.quotationNumber.startsWith(`SPH-${year}-`)) {
      const parts = q.quotationNumber.split('-');
      if (parts.length >= 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `SPH-${year}-${nextSeq}`;
}

/**
 * Creates an immutable Quotation Snapshot from a Finalized RAB.
 * Throws an error if RAB is in Draft status.
 */
export function createQuotationFromRAB(
  rab: RAB,
  existingQuotations: Quotation[],
  customOptions?: Partial<Quotation>
): Quotation {
  if (rab.status !== 'Final') {
    throw new Error('SPH hanya dapat dibuat dari RAB dengan status FINAL. Silakan finalisasi RAB terlebih dahulu.');
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const validityDays = customOptions?.validityDays || 14;
  const validUntil = customOptions?.validUntil || addDaysToDate(todayStr, validityDays);
  const quotationNumber = generateNextQuotationNumber(existingQuotations);
  const id = `sph-${Date.now()}`;

  const defaultWorkDescription =
    rab.notes ||
    `Pelaksanaan pekerjaan konstruksi untuk proyek "${rab.projectName}" berlokasi di ${rab.projectLocation}, mencakup ${rab.items?.length || 0} uraian item pekerjaan konstruksi sesuai rincian RAB ${rab.rabNumber}.`;

  return {
    id,
    quotationNumber,
    rabId: rab.id,
    rabNumber: rab.rabNumber,
    leadId: rab.leadId,
    projectName: rab.projectName,
    clientName: rab.clientName,
    clientPhone: rab.clientPhone,
    clientEmail: customOptions?.clientEmail || '',
    projectLocation: rab.projectLocation,
    buildingAreaM2: rab.buildingAreaM2,
    quotationDate: customOptions?.quotationDate || todayStr,
    validityDays,
    validUntil,
    companyName: customOptions?.companyName || DEFAULT_COMPANY_INFO.companyName,
    companyAddress: customOptions?.companyAddress || DEFAULT_COMPANY_INFO.companyAddress,
    companyPhone: customOptions?.companyPhone || DEFAULT_COMPANY_INFO.companyPhone,
    companyEmail: customOptions?.companyEmail || DEFAULT_COMPANY_INFO.companyEmail,
    workDescription: customOptions?.workDescription || defaultWorkDescription,
    paymentTerms: customOptions?.paymentTerms || DEFAULT_PAYMENT_TERMS,
    termsAndConditions: customOptions?.termsAndConditions || DEFAULT_TERMS_AND_CONDITIONS,
    notes: customOptions?.notes || '',
    materialTotal: rab.materialTotal,
    laborTotal: rab.laborTotal,
    subtotalCost: rab.subtotalCost,
    overheadAmount: rab.overheadAmount,
    overheadValue: rab.overheadValue,
    marginAmount: rab.marginAmount,
    marginValue: rab.marginValue,
    discountAmount: rab.discountAmount || 0,
    grandTotal: rab.grandTotal,
    status: customOptions?.status || 'Draft',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Loads quotations from isolated localStorage key.
 */
export function getStoredQuotations(): Quotation[] {
  if (typeof window === 'undefined') return INITIAL_QUOTATIONS;
  try {
    const raw = localStorage.getItem(QUOTATION_STORAGE_KEY);
    if (!raw) return INITIAL_QUOTATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_QUOTATIONS;
  } catch {
    return INITIAL_QUOTATIONS;
  }
}

/**
 * Saves quotations to isolated localStorage key.
 */
export function saveStoredQuotations(quotations: Quotation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUOTATION_STORAGE_KEY, JSON.stringify(quotations));
  } catch (err) {
    console.error('Failed to save quotations to localStorage', err);
  }
}
