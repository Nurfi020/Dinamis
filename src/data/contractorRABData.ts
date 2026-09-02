import { RAB, RABItem, WorkCategory } from '../types';

export const RAB_STORAGE_KEY = 'kelola_lead_sales_rab_v1';

export const WORK_CATEGORIES: WorkCategory[] = [
  'Pekerjaan Persiapan',
  'Pekerjaan Pondasi & Struktur',
  'Pekerjaan Dinding & Plesteran',
  'Pekerjaan Atap & Plafon',
  'Pekerjaan Lantai & Keramik',
  'Pekerjaan Pintu, Jendela & Kaca',
  'Pekerjaan Instalasi Listrik & MEP',
  'Pekerjaan Sanitasi & Plumbing',
  'Pekerjaan Pengecatan & Finishing',
  'Pekerjaan Eksterior & Lanskap',
  'Lain-lain',
];

export const WORK_UNITS = ['m2', 'm3', 'm1', 'ls', 'unit', 'titik', 'kg', 'btg', 'set', 'hari', 'bln'];

/**
 * Calculates line-item totals safely handling 0, empty, decimals, and preventing NaN/Infinity.
 */
export function calculateRABItem(
  volume: number,
  materialUnitPrice: number,
  laborUnitPrice: number
): { materialTotal: number; laborTotal: number; subtotal: number } {
  const safeVol = isNaN(volume) || volume < 0 ? 0 : volume;
  const safeMatPrice = isNaN(materialUnitPrice) || materialUnitPrice < 0 ? 0 : materialUnitPrice;
  const safeLaborPrice = isNaN(laborUnitPrice) || laborUnitPrice < 0 ? 0 : laborUnitPrice;

  const materialTotal = Math.round(safeVol * safeMatPrice);
  const laborTotal = Math.round(safeVol * safeLaborPrice);
  const subtotal = materialTotal + laborTotal;

  return {
    materialTotal,
    laborTotal,
    subtotal,
  };
}

/**
 * Calculates complete RAB summary figures safely.
 */
export function calculateRABSummary(
  items: RABItem[],
  overheadType: 'percent' | 'nominal' = 'percent',
  overheadValue: number = 5,
  marginType: 'percent' | 'nominal' = 'percent',
  marginValue: number = 15,
  discountAmount: number = 0
): {
  materialTotal: number;
  laborTotal: number;
  subtotalCost: number;
  overheadAmount: number;
  marginAmount: number;
  discountAmount: number;
  grandTotal: number;
} {
  let materialTotal = 0;
  let laborTotal = 0;

  for (const item of items) {
    materialTotal += item.materialTotal || 0;
    laborTotal += item.laborTotal || 0;
  }

  const subtotalCost = materialTotal + laborTotal;

  // Overhead calculation
  const safeOverheadVal = isNaN(overheadValue) || overheadValue < 0 ? 0 : overheadValue;
  const overheadAmount =
    overheadType === 'percent'
      ? Math.round((subtotalCost * safeOverheadVal) / 100)
      : Math.round(safeOverheadVal);

  // Margin calculation
  const safeMarginVal = isNaN(marginValue) || marginValue < 0 ? 0 : marginValue;
  const marginAmount =
    marginType === 'percent'
      ? Math.round((subtotalCost * safeMarginVal) / 100)
      : Math.round(safeMarginVal);

  // Discount calculation
  const safeDiscount = isNaN(discountAmount) || discountAmount < 0 ? 0 : discountAmount;

  // Grand Total (Cost + Overhead + Margin - Discount)
  const calculatedGrand = subtotalCost + overheadAmount + marginAmount - safeDiscount;
  const grandTotal = Math.max(0, calculatedGrand);

  return {
    materialTotal,
    laborTotal,
    subtotalCost,
    overheadAmount,
    marginAmount,
    discountAmount: safeDiscount,
    grandTotal,
  };
}

/**
 * Generates an auto-incremented unique RAB number.
 * Format: RAB-2026-0001, RAB-2026-0002, etc.
 */
export function generateNextRABNumber(existingRABs: RAB[]): string {
  const year = new Date().getFullYear();
  let maxSeq = 0;

  for (const rab of existingRABs) {
    if (rab.rabNumber && rab.rabNumber.startsWith(`RAB-${year}-`)) {
      const parts = rab.rabNumber.split('-');
      if (parts.length >= 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `RAB-${year}-${nextSeq}`;
}

// Initial Simulated Contractor RABs
export const INITIAL_RABS: RAB[] = [
  {
    id: 'rab-101',
    rabNumber: 'RAB-2026-0001',
    leadId: 'proj-101',
    projectName: 'Renovasi Gedung Kantor 4 Lantai — Fit-out & MEP',
    clientName: 'PT Maju Bersama (Bpk. Hendrawan)',
    clientPhone: '081288991122',
    projectLocation: 'TB Simatupang, Jakarta Selatan',
    buildingAreaM2: 800,
    status: 'Final',
    overheadType: 'percent',
    overheadValue: 5,
    overheadAmount: 19000000,
    marginType: 'percent',
    marginValue: 15,
    marginAmount: 57000000,
    discountAmount: 6000000,
    materialTotal: 260000000,
    laborTotal: 120000000,
    subtotalCost: 380000000,
    grandTotal: 450000000,
    notes: 'Estimasi renovasi interior komersial 4 lantai lengkap dengan partisi acoustic glass, upgrade panel MEP, dan custom backdrop resepsionis.',
    createdAt: '2026-08-29T10:00:00.000Z',
    updatedAt: '2026-09-01T14:15:00.000Z',
    items: [
      {
        id: 'item-101-1',
        rabId: 'rab-101',
        category: 'Pekerjaan Persiapan',
        itemName: 'Pembersihan site, mobilisasi alat & proteksi area kerja',
        description: 'Termasuk safety K3, barikade debu, dan koordinasi gedung',
        volume: 1,
        unit: 'ls',
        materialUnitPrice: 5000000,
        materialTotal: 5000000,
        laborUnitPrice: 7000000,
        laborTotal: 7000000,
        subtotal: 12000000,
      },
      {
        id: 'item-101-2',
        rabId: 'rab-101',
        category: 'Pekerjaan Dinding & Plesteran',
        itemName: 'Pemasangan Partisi Gypsum Acoustic 2 Muka Rangka Hollow Galvalum',
        description: 'Gypsum 9mm + Glasswool density 24kg/m3',
        volume: 320,
        unit: 'm2',
        materialUnitPrice: 185000,
        materialTotal: 59200000,
        laborUnitPrice: 65000,
        laborTotal: 20800000,
        subtotal: 80000000,
      },
      {
        id: 'item-101-3',
        rabId: 'rab-101',
        category: 'Pekerjaan Lantai & Keramik',
        itemName: 'Pemasangan Karpet Tile Heavy Commercial 50x50 cm',
        description: 'Karpet tile nylon backing PVC + underlayer foam',
        volume: 450,
        unit: 'm2',
        materialUnitPrice: 210000,
        materialTotal: 94500000,
        laborUnitPrice: 40000,
        laborTotal: 18000000,
        subtotal: 112500000,
      },
      {
        id: 'item-101-4',
        rabId: 'rab-101',
        category: 'Pekerjaan Instalasi Listrik & MEP',
        itemName: 'Upgrade Instalasi Panel Sub-Distribution, Kabel NYM & LED Downlight 18W',
        description: '40 titik lampu LED Phillips + saklar & stopkontak Schneider',
        volume: 40,
        unit: 'titik',
        materialUnitPrice: 1250000,
        materialTotal: 50000000,
        laborUnitPrice: 625000,
        laborTotal: 25000000,
        subtotal: 75000000,
      },
      {
        id: 'item-101-5',
        rabId: 'rab-101',
        category: 'Pekerjaan Pengecatan & Finishing',
        itemName: 'Pengecatan Interior Dulux Pentalite Anti-Bakteri 3 Lapis',
        description: 'Plafon dan seluruh dinding ruangan meeting & direksi',
        volume: 850,
        unit: 'm2',
        materialUnitPrice: 60353,
        materialTotal: 51300000,
        laborUnitPrice: 57882,
        laborTotal: 49200000,
        subtotal: 100500000,
      },
    ],
  },
  {
    id: 'rab-102',
    rabNumber: 'RAB-2026-0002',
    leadId: 'proj-102',
    projectName: 'Bangun Rumah Tinggal Mewah 2 Lantai (BSD City)',
    clientName: 'Bpk. Irwan Santoso',
    clientPhone: '081377889900',
    projectLocation: 'Cluster Greenwich Park, BSD City',
    buildingAreaM2: 420,
    status: 'Draft',
    overheadType: 'percent',
    overheadValue: 5,
    overheadAmount: 52500000,
    marginType: 'percent',
    marginValue: 15,
    marginAmount: 157500000,
    discountAmount: 10000000,
    materialTotal: 735000000,
    laborTotal: 315000000,
    subtotalCost: 1050000000,
    grandTotal: 1250000000,
    notes: 'Draft estimasi bangun rumah 2 lantai gaya Modern Tropis. Pondasi tiang pancang mini pile, struktur beton bertulang K-300, kusen aluminium YKK.',
    createdAt: '2026-08-30T11:00:00.000Z',
    updatedAt: '2026-08-31T16:00:00.000Z',
    items: [
      {
        id: 'item-102-1',
        rabId: 'rab-102',
        category: 'Pekerjaan Pondasi & Struktur',
        itemName: 'Pondasi Tiang Pancang Mini Pile 20x20 + Pile Cap Beton K-300',
        description: 'Kedalaman 12 meter, 24 titik pancang',
        volume: 24,
        unit: 'titik',
        materialUnitPrice: 9000000,
        materialTotal: 216000000,
        laborUnitPrice: 3500000,
        laborTotal: 84000000,
        subtotal: 300000000,
      },
      {
        id: 'item-102-2',
        rabId: 'rab-102',
        category: 'Pekerjaan Pondasi & Struktur',
        itemName: 'Struktur Kolom, Balok & Plat Lantai 2 Beton Bertulang ReadyMix K-300',
        description: 'Besi ulir BJTS 420B, bekisting multiplex 12mm',
        volume: 180,
        unit: 'm3',
        materialUnitPrice: 1900000,
        materialTotal: 342000000,
        laborUnitPrice: 850000,
        laborTotal: 153000000,
        subtotal: 495000000,
      },
      {
        id: 'item-102-3',
        rabId: 'rab-102',
        category: 'Pekerjaan Dinding & Plesteran',
        itemName: 'Dinding Pasangan Bata Ringan AAC 10cm + Plester Aci Mortar Utama',
        description: 'Bata ringan kualitas super + semen mortar instan',
        volume: 680,
        unit: 'm2',
        materialUnitPrice: 145000,
        materialTotal: 98600000,
        laborUnitPrice: 70000,
        laborTotal: 47600000,
        subtotal: 146200000,
      },
      {
        id: 'item-102-4',
        rabId: 'rab-102',
        category: 'Pekerjaan Atap & Plafon',
        itemName: 'Rangka Atap Baja Ringan Zincalume C75 + Genteng Keramik Kanmuri',
        description: 'Profil C75 tebal 0.80mm + insulasi alumunium foil bubble',
        volume: 260,
        unit: 'm2',
        materialUnitPrice: 301538,
        materialTotal: 78400000,
        laborUnitPrice: 116923,
        laborTotal: 30400000,
        subtotal: 108800000,
      },
    ],
  },
  {
    id: 'rab-103',
    rabNumber: 'RAB-2026-0003',
    leadId: 'proj-103',
    projectName: 'Interior Commercial & Fit-Out Cafe',
    clientName: 'Kopi Kenangan Nusantara (Ibu Citra)',
    clientPhone: '081122334455',
    projectLocation: 'Jl. Ir. H. Juanda No. 120, Dago, Bandung',
    buildingAreaM2: 120,
    status: 'Final',
    overheadType: 'percent',
    overheadValue: 5,
    overheadAmount: 7750000,
    marginType: 'percent',
    marginValue: 16,
    marginAmount: 24800000,
    discountAmount: 2550000,
    materialTotal: 108000000,
    laborTotal: 47000000,
    subtotalCost: 155000000,
    grandTotal: 185000000,
    notes: 'Pekerjaan fit-out cafe seluas 120m2. Bar counter marble synthetic, custom bench booth sofa, dan spotlight warm white.',
    createdAt: '2026-08-22T09:00:00.000Z',
    updatedAt: '2026-08-30T17:00:00.000Z',
    items: [
      {
        id: 'item-103-1',
        rabId: 'rab-103',
        category: 'Pekerjaan Dinding & Plesteran',
        itemName: 'Pembuatan Custom Bar Counter Coffee Station 4.5 Meter Finishing HPL Taco & Solid Surface',
        description: 'Rangka multiplex 18mm, sink stainless 304, laci knockers soft close',
        volume: 1,
        unit: 'set',
        materialUnitPrice: 38000000,
        materialTotal: 38000000,
        laborUnitPrice: 14000000,
        laborTotal: 14000000,
        subtotal: 52000000,
      },
      {
        id: 'item-103-2',
        rabId: 'rab-103',
        category: 'Pekerjaan Lantai & Keramik',
        itemName: 'Lantai Vinyl Plank SPC 5mm Click System Motif Wood Oak',
        description: 'Tahan air, anti rayap, underlayer foam IXPE',
        volume: 120,
        unit: 'm2',
        materialUnitPrice: 240000,
        materialTotal: 28800000,
        laborUnitPrice: 60000,
        laborTotal: 7200000,
        subtotal: 36000000,
      },
      {
        id: 'item-103-3',
        rabId: 'rab-103',
        category: 'Pekerjaan Instalasi Listrik & MEP',
        itemName: 'Pekerjaan Lampu Track Light Spotlight & Gantung Industrial Cafe',
        description: 'Track rail 24 meter + 28 spotlight 12W warm white + panel breaker',
        volume: 28,
        unit: 'titik',
        materialUnitPrice: 750000,
        materialTotal: 21000000,
        laborUnitPrice: 450000,
        laborTotal: 12600000,
        subtotal: 33600000,
      },
      {
        id: 'item-103-4',
        rabId: 'rab-103',
        category: 'Pekerjaan Pengecatan & Finishing',
        itemName: 'Finishing Cat Dinding Semen Ekspos Tekstur Industrial',
        description: 'Semen pasta tekstur + clear coat matt polyurethane',
        volume: 180,
        unit: 'm2',
        materialUnitPrice: 112222,
        materialTotal: 20200000,
        laborUnitPrice: 73333,
        laborTotal: 13200000,
        subtotal: 33400000,
      },
    ],
  },
];

/**
 * Loads RABs from localStorage with fallback to INITIAL_RABS.
 */
export function getStoredRABs(): RAB[] {
  if (typeof window === 'undefined') return INITIAL_RABS;
  try {
    const raw = localStorage.getItem(RAB_STORAGE_KEY);
    if (!raw) return INITIAL_RABS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RABS;
  } catch {
    return INITIAL_RABS;
  }
}

/**
 * Saves RABs to isolated localStorage key.
 */
export function saveStoredRABs(rabs: RAB[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RAB_STORAGE_KEY, JSON.stringify(rabs));
  } catch (err) {
    console.error('Failed to save RABs to localStorage', err);
  }
}
